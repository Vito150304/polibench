# Guida di avvio di Polibench

Questa guida spiega come far partire Polibench sul proprio computer, caricare dei dati di esempio e provare l'applicazione.

## Cosa serve

- **Docker** (su Windows e Mac: Docker Desktop; su Linux: Docker Engine con il plugin Compose). Va **installato e avviato prima di cominciare**: su Windows e Mac apri Docker Desktop e aspetta che indichi che è in esecuzione. Docker richiede un computer abbastanza recente, indicativamente con almeno 8 GB di memoria: su computer meno recenti l'avvio è molto lento e Docker Desktop può non aprirsi correttamente.
- **Git**, per scaricare il progetto.
- Una connessione a Internet (la prima volta Docker scarica i componenti necessari).
- Queste porte del computer devono essere libere: **80, 5173, 8000, 8090, 27017**. Se hai già acceso altre copie di Polibench o altri container, fermali prima (`docker ps` mostra cosa è acceso; `docker stop` seguito dal nome del container lo ferma). Se un altro programma usa le porte, vedi la sezione "Se qualcosa non funziona".

I comandi vanno scritti in un terminale (su Windows: Git Bash o PowerShell).

## 1. Scaricare il progetto

```bash
git clone -b newFrontend https://github.com/Vito150304/polibench.git polibench
cd polibench
```

Da qui in poi tutti i comandi vanno lanciati **dentro la cartella `polibench`**.

Se sul computer esiste già una cartella `polibench` (per esempio una copia precedente), Git non la sovrascrive e si ferma con un errore. In quel caso dai alla nuova cartella un nome diverso, per esempio `polibench-prova`, sia nel comando `git clone` (ultima parola) sia nel `cd`. Il nome diverso serve anche a Docker: tiene separati i dati delle due copie.

## 2. Creare il file di configurazione `.env`

Il file `.env` contiene le impostazioni dell'applicazione. Nel progetto c'è un modello pronto, `.env.example`: basta copiarlo.

Git Bash, Mac, Linux:

```bash
cp .env.example .env
```

PowerShell o Prompt dei comandi di Windows:

```
copy .env.example .env
```

Poi apri il file `.env` con un editor di testo (Blocco note va bene) e modifica **solo queste due righe**. Da Git Bash il modo più semplice è `notepad .env`: il file si apre già pronto (nella finestra "Apri" il Blocco note non mostra i file senza estensione, quindi cercarlo a mano non funziona). Il terminale resta occupato finché non salvi e **chiudi la finestra del Blocco note**.

| Riga | Cosa mettere |
| --- | --- |
| `SECRET_KEY=` | Una sequenza casuale lunga, almeno 32 caratteri. Serve a proteggere gli accessi. Puoi generarla con i comandi sotto. |
| `FIRST_SUPERUSER_PASSWORD=` | La password che vuoi usare per l'utente amministratore (scegline una a piacere). |

Per generare `SECRET_KEY` puoi usare questo comando (serve solo Docker):

```bash
docker run --rm python:3-slim python -c "import secrets; print(secrets.token_urlsafe(32))"
```

In alternativa, da Git Bash, Mac o Linux, funziona anche:

```bash
openssl rand -hex 32
```

Copia il testo che compare e incollalo dopo `SECRET_KEY=`, senza spazi né virgolette. Salva il file.

L'email dell'amministratore è quella scritta nella riga `FIRST_SUPERUSER=` dello stesso file: ti servirà per entrare.

Il file `.env` resta sul tuo computer: non viene mai inviato a GitHub.

## 3. Avviare l'applicazione

```bash
docker compose up -d --build
```

La prima volta richiede alcuni minuti: Docker scarica e costruisce i componenti (database, backend, frontend…). Lascia che finisca senza interromperlo. Alla fine controlla che siano tutti accesi:

```bash
docker compose ps
```

Devi vedere cinque servizi con lo stato **Up** (il database anche **healthy**). Se uno risulta spento, vai alla sezione "Se qualcosa non funziona".

## 4. Caricare i dati di esempio

Il database appena creato è vuoto. Questo comando lo riempie con dataset, modelli ed esperimenti di esempio (Movielens, LastFM, Amazon Books e altri):

```bash
docker compose exec backend uv run python scripts/seed.py --mode demo
```

Può richiedere un po' di tempo. Alla fine l'ultima riga deve dire `consistency_issues: none`. Lancia il comando una volta sola e senza altre opzioni.

## 5. Aprire l'applicazione

Apri il browser e vai su:

- **http://localhost** per l'applicazione.
- http://localhost/docs per la documentazione dell'interfaccia del backend (Swagger), solo se ti interessa.

Usa sempre `http://localhost`, **senza** `:5173`: la porta 5173 è un accesso interno di sviluppo e in questa configurazione non funziona correttamente.

Per entrare come amministratore, scegli **Login** e usa l'email scritta in `FIRST_SUPERUSER` e la password che hai impostato al punto 2.

Senza fare il login puoi già consultare le classifiche (Leaderboard), i dataset e i modelli. Per creare dataset, modelli ed esperimenti serve un utente verificato (vedi il punto successivo).


**NOTA: Per spegnere l’applicazione, conservando i dati: `docker compose stop`. Per riaccenderla: `docker compose up -d`.**

## 6. Provare la registrazione di un nuovo utente (Facoltativo) 

1. Nella pagina **Register** inserisci nome, cognome, un'email qualsiasi (anche inventata) e una password.
2. Nell'applicazione non è configurato un servizio per spedire vere email, quindi il messaggio di verifica **non arriva per posta**: il link viene scritto nei log del backend. Per leggerlo:

   ```bash
   docker compose logs backend | grep "Link di verifica"
   ```

   Compaiono i link generati finora: prendi l'ultimo, quello che comincia con `http://localhost/verify-email?token=`. Copialo per intero e aprilo nel browser. Deve comparire "Email verified successfully!".
3. Torna al **Login** ed entra con l'utente appena creato.

Cosa succede se un utente non ha ancora verificato l'email: può accedere e consultare tutto, ma se prova a creare qualcosa (un dataset, per esempio) compare un messaggio che lo invita a verificare l'email. È il comportamento previsto.

Il link ha una durata limitata. Se è scaduto, nella pagina di Login scrivi l'email e premi **Resend email**: ne viene generato uno nuovo, sempre nei log.

## Se qualcosa non funziona

- **"Cannot connect to the Docker daemon" / "docker: command not found"**: Docker non è avviato o non è installato. Su Windows e Mac apri Docker Desktop e aspetta che sia pronto.
- **"port is already allocated" o errori sulle porte**: un altro programma usa una delle porte (80, 5173, 8000, 8090, 27017). Chiudilo, oppure fermalo con `docker compose stop` se è un'altra copia di questo stesso progetto, poi rilancia `docker compose up -d`.
- **Un servizio è spento o continua a riavviarsi**: guarda gli ultimi messaggi con `docker compose logs` seguito dal nome del servizio e da `--tail 50` (i servizi sono `backend`, `frontend`, `db`, `proxy`, `mongo-express`).
- **La pagina è bianca o mostra "Failed to resolve import"**: ricostruisci il frontend con `docker compose up -d --build frontend` e ricarica la pagina.
- **Hai modificato il file `.env` dopo aver avviato tutto**: fai rileggere le impostazioni con `docker compose up -d --force-recreate`.
- **Non riesci a entrare come amministratore dopo aver cambiato le credenziali nel `.env`**: i dati vecchi del database restano nel volume e le nuove credenziali non vengono applicate. Ripartire da zero con `docker compose down -v`, poi `docker compose up -d` e di nuovo il comando del punto 4 risolve

