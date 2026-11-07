# Frontend — panoramica

Il frontend di Polibench è una applicazione React scritta in JavaScript. Mostra i dati del backend (dataset, versioni, pipeline, modelli, esperimenti, leaderboard) e permette di registrarne di nuovi. Non contiene logica di calcolo: la classifica e la validazione definitiva dei dati sono compiti del backend (il browser fa solo controlli preliminari, per esempio sul file CSV).

È stato riprogettato da zero con tre obiettivi: ridurre il sovraccarico di informazioni (filtri e grafici), rendere l'interfaccia affidabile (attese, errori e pagine vuote sono sempre spiegati) e seguire i principi dell'interazione uomo-macchina.

---

## Tecnologie

| Cosa                       | Strumento                         | A cosa serve                                                   |
| -------------------------- | --------------------------------- | -------------------------------------------------------------- |
| Interfaccia                | React 19                          | Componenti e hook                                              |
| Build e server di sviluppo | Vite                              | Avvio rapido e ricarica automatica                             |
| Navigazione                | React Router (`react-router-dom`) | Rotte, rotte protette, parametri nell'indirizzo                |
| Dati dal server            | TanStack Query                    | Chiamate con cache, stati `isLoading` ed errore, `refetch`     |
| Grafici                    | Recharts                          | Barre, radar e migliore prova per modello                      |
| Messaggi a comparsa        | react-toastify                    | Esito di creazioni e errori                                    |
| Icone                      | lucide-react, react-icons         | Icona dei messaggi di pagina vuota; trofeo e medaglie nei tooltip |
| Stili                      | CSS Modules + variabili CSS       | Un file `.module.css` per pagina, colori e font in `index.css` |
| Controllo del codice       | ESLint                            | `npm run lint`, eseguito anche dalla CI                        |

Le chiamate al backend sono semplici `fetch` verso indirizzi che iniziano con `/api/v1/`, senza indirizzo completo: con Docker le inoltra Traefik (porta 80), con `npm run dev` le inoltra Vite (da `http://localhost:5173` verso `http://localhost:8000`, vedi `vite.config.js`: il backend deve essere acceso in Docker). Per questo il frontend non ha variabili d'ambiente.

---

## Struttura delle cartelle

```
frontend/src/
├── main.jsx          # Punto di ingresso: QueryClientProvider, BrowserRouter, AuthProvider, App
├── App.jsx           # Tabella delle rotte (pubbliche, protette, solo superutente)
├── index.css         # Variabili (colori, ombre, font), tema chiaro/scuro, regole globali
├── pages/            # Una pagina per file
├── components/       # Layout, ProtectedRoute, EmptyState, FilterMenu, charts/
├── contexts/         # AuthContext (il contesto) e AuthProvider (la logica di sessione)
├── hooks/            # Un file per area: useDatasets, useVersions, usePipelines, useModels, useExperiment, ...
├── utils/            # formatters (date, uuid), metrics (metriche per task), metricsCsv (controllo del CSV)
└── styles/           # Un file .module.css per ogni pagina e componente con stile proprio
```

La regola seguita è: la **pagina** decide cosa mostrare, l'**hook** sa come parlare con il backend, il **componente** è un pezzo riusabile. Una pagina non scrive mai `fetch`: chiama un hook.

---

## Rotte

Definite in `App.jsx`. Tutte le pagine dentro `Layout` hanno il menu in alto e un contenitore con larghezza massima.

| Tipo                | Rotte                                                                                                   |
|---------------------|---------------------------------------------------------------------------------------------------------|
| Pubbliche (lettura) | `/`, `/leaderboard`, `/datasets`, `/datasets/:dataset_uuid`, `/models`                                  |
| Protette (login)    | `/experiment`, `/register-model`, `/register-dataset`, `/dataset-versions/:version_uuid`, `/datasets/:dataset_uuid/create-version`, `/dataset-versions/:version_uuid/create-pipeline`, `/profile` |
| Solo superutente    | `/users`                                                                                                |
| Fuori dal layout    | `/login`, `/register`, `/verify-email`, `/email-sent`, pagina "non trovata"                              |

`ProtectedRoute` manda a `/login` chi non è autenticato. Con `requireSuperuser` mostra "Access denied" a chi non è superutente. Nel menu la voce "Users" compare solo per il superutente.

---

## Sessione e permessi

La logica è in `contexts/AuthProvider.jsx`.

- Dopo il login il token di accesso è salvato in `localStorage` e in uno stato React.
- I dati dell'utente (`/api/v1/users/me`) arrivano da una query di TanStack Query, non sono copiati in uno stato.
- Se la richiesta dei dati utente (`/users/me`) riceve 401 (token scaduto o non valido), `expireSession` cancella il token e mostra un messaggio; da quel momento le pagine protette rimandano a `/login`. Le altre richieste mostrano solo il messaggio di errore del backend.
- All'avvio, se non c'è un token, si prova a chiedere un nuovo token con il cookie del backend (`/login/refresh-token`). Serve per il ritorno dall'accesso con Google, che il backend supporta ma l'interfaccia non espone ancora.
- Registrazione: il backend genera un link di verifica (`/verify-email?token=...`) e lo invia per email; se l'invio delle email non è configurato (come nell'avvio di prova) il link compare nei log del backend. Chi non è verificato può leggere e fare login, ma le operazioni di scrittura vengono rifiutate dal backend.

---

## Chiamate al backend (hooks)

Ogni hook in `hooks/` segue lo stesso schema:

1. `useQuery` (lettura) o `useMutation` (scrittura) di TanStack Query;
2. `fetch` con `signal` per poter annullare la richiesta;
3. due tipi di errore distinti: rete ("Could not reach the server") e risposta non riuscita (messaggio del backend, campo `detail`);
4. nelle scritture, di norma dopo il successo, `invalidateQueries` per aggiornare le liste e un toast.

Le pagine ricevono `{ dati, isLoading, error }` e mostrano di conseguenza: caricamento, errore, stato vuoto (`EmptyState`) oppure i dati.

---

## Pagine principali

- **Home:** presentazione, percorso in sei passi (dataset, versione, pipeline, modello, esperimento, leaderboard) e collegamenti.
- **Dataset e dettaglio:** elenco con ricerca; il dettaglio mostra le informazioni e le versioni, con il download dei file YAML di ogni versione (dataset, version, metrics).
- **Dettaglio versione:** pipeline e esperimenti come schede. Le anteprime di pipeline ed esperimento si aprono sotto la riga cliccata; le metriche sono in una tabella con scorrimento orizzontale.
- **Creazione di versione e pipeline:** form con file o testo YAML e anteprima prima di salvare (l'anteprima si chiude se si modifica il form).
- **Modelli:** tabella con nome, famiglia e link al paper (si apre in una nuova scheda, solo se l'indirizzo è http/https).
- **Submit Experiment:** tre select a cascata (dataset, versione, pipeline), il modello, il seed e un CSV facoltativo con i risultati (vedi sotto).
- **Leaderboard:** vedi sotto.
- **Profile e Users:** dati dell'utente, modifica di nome ed email, cancellazione dell'account (con conferma); elenco degli utenti per il superutente, con lo stato di ogni account.

### Caricamento dei risultati da CSV

Il backend non esegue gli algoritmi: i risultati si importano da un file. Il flusso in `SubmitExperimentPage`:

1. `utils/metricsCsv.js` controlla il file **nel browser**: estensione `.csv`, massimo 1 MB, niente BOM, virgole al posto dei punti e virgola, colonne `metric` e `value` (più `split`, `k`, `direction` se presenti);
2. si crea l'esperimento, poi si invia il CSV (`hooks/useMetricImport.jsx`);
3. l'importazione è un lavoro asincrono del backend: la pagina ne controlla lo stato ogni 2 secondi e mostra l'esito;
4. in caso di errore c'è "Retry upload"; a fine operazione si aggiornano leaderboard e liste.

Limite noto: dopo l'importazione lo stato dell'esperimento resta "queued", perché nel backend non c'è nessun lavoro che lo aggiorni.

### Leaderboard

- Dataset, versione e pipeline sono nell'indirizzo (`/leaderboard/:datasetId?/:versionId?/:pipelineId?`), quindi la scelta si può condividere con un link. La versione si usa solo insieme alla pipeline.
- Le metriche disponibili dipendono dal tipo di task del dataset (`utils/metrics.js`): per il ranking `ndcg@10`, `recall@20`, `hit@10` (più alto è meglio); per la predizione dei voti `rmse`, `mae` (più basso è meglio).
- `FilterMenu` sceglie metrica e split (validation/test).
- Tre grafici (Recharts): classifica di tutte le prove (barre), confronto su più metriche (radar) e migliore prova di ogni modello (serve scegliere versione e pipeline). Passando il mouse sulle barre compaiono modello, punteggio, autore e iperparametri; sul radar compaiono i punteggi di ogni modello per la metrica scelta.

---

## Stili

- **Variabili in `index.css`:** colori (`--bg-sfondo`, `--bg-card`, `--text-primary`, `--brand-primary`, ...), ombre e font. Il tema scuro è quello di partenza; il tema chiaro si attiva con `@media (prefers-color-scheme: light)`, cioè segue la preferenza del dispositivo.
- **Un file CSS per pagina** (`styles/NomePagina.module.css`), con classi semplici. Le classi di una pagina non possono influenzare le altre.
- **Unità relative:** `html { font-size: 62.5% }`, quindi `1rem` vale 10 px e si ragiona in `rem`.
- **Tipografia fluida:** la dimensione base cresce con la larghezza dello schermo con `clamp()` e `vw`. Dove il browser supporta `progress()` si usa il calcolo più preciso dentro `@supports`; altrimenti resta il valore di riserva.
- **Responsività:** il contenitore delle pagine ha una larghezza massima, le tabelle scorrono dentro il proprio riquadro e le schede e i form si riadattano alla larghezza.
- **Accessibilità:** `label` collegate ai campi (`htmlFor`/`id`), `aria-label` sui pulsanti con sola icona, voce attiva del menu evidenziata. Limite noto: le schede dell'elenco dataset sono cliccabili con il mouse ma non raggiungibili da tastiera.

---

## Limiti noti

- L'usabilità non è stata valutata con utenti reali.
- Il pulsante di accesso con Google non c'è (il backend lo supporta).
- La visibilità `public/private` dei dataset è mostrata ma non è applicata dal backend.
- Non c'è un elenco delle metriche nel backend: nel frontend sono scritte per tipo di task (`utils/metrics.js`).
- Il radar diventa poco leggibile con più di 8 modelli.
- Non ci sono test automatici del frontend; il controllo è con ESLint e con prove manuali sulle pagine.
