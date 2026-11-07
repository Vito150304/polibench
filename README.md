# Polibench

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Python](https://img.shields.io/badge/Python-%3E=3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

**Polibench** è una piattaforma web per il **benchmarking comparativo di modelli di raccomandazione** (Recommender Systems). Consente a ricercatori e team di registrare dataset, algoritmi, esperimenti e metriche di valutazione in un unico ambiente strutturato, e di consultare leaderboard ordinate per performance.

Il progetto nasce in contesto accademico e si ispira a piattaforme come [BARS](https://openbenchmark.github.io/BARS/) e [OpenBenchmark](https://openbenchmark.github.io/), con l'obiettivo di centralizzare i risultati sperimentali e facilitare la riproducibilità.

> **Questa versione del repository.** Il backend è stato realizzato da Raffaele Grieco. Il frontend è stato riprogettato da zero da Vito Burdi come tesi di laurea triennale (Politecnico di Bari, corso di Ingegneria Informatica e dell'Automazione, relatore Prof. Antonio Ferrara). Il codice del frontend è in JavaScript e si trova nel branch `newFrontend`. Per far partire tutto in pochi passi segui la [guida di avvio](GUIDA-AVVIO.md).

---

## Funzionalità principali

- **Gestione Dataset e Versioni** — dataset catalografico + dataset versioning con YAML (`dataset`, `version`, `characteristics`) e tracciamento `sources/resources`.
- **Pipeline Registry** — pipeline separate dalla versione (`P001`, `P002`, …), visualizzazione a blocchi/chain e YAML dedicato per pipeline.
- **Registrazione Modelli** — catalogo di algoritmi di raccomandazione (BPR, LightGCN, SGL, …) con iperparametri di riferimento, paper e implementazione.
- **Submission di Esperimenti** — associazione pipeline–modello con configurazione di training, seed, codice sorgente e artefatti per la riproducibilità.
- **Metriche di Valutazione** — registrazione batch di metriche (AUC, LogLoss, NDCG@k, Recall@k, …) per split (test/validation) con direzione (max/min).
- **Leaderboard** — classifica in tempo reale dei modelli per dataset, metrica e split, con grafici interattivi (Recharts).
- **Autenticazione** — JWT con email/password, Google OAuth2 (SSO), verifica email via SMTP.
- **Ruoli utente** — `admin`, `researcher`, `viewer` con controlli di accesso differenziati.
- **API UUID-first** — tutti gli endpoint pubblici usano UUID; gli ObjectId MongoDB restano interni.
- **Pannello MongoDB** — Mongo Express integrato per ispezionare il database via web.

---

## Stack tecnologico

| Layer                  | Tecnologia                                                                     | Ruolo                                     |
|------------------------|--------------------------------------------------------------------------------|-------------------------------------------|
| **Backend**            | [FastAPI](https://fastapi.tiangolo.com/)                                       | Framework API async                       |
| **ODM**                | [Beanie](https://beanie-odm.dev/)                                              | Object-Document Mapper per MongoDB        |
| **Validazione**        | [Pydantic v2](https://docs.pydantic.dev/)                                      | Schemi API e modelli dati                 |
| **Database**           | [MongoDB](https://www.mongodb.com/)                                            | Database documentale NoSQL                |
| **Driver DB**          | [Motor](https://motor.readthedocs.io/)                                         | Client MongoDB async per Python           |
| **Frontend**           | [React 19](https://react.dev/) (JavaScript)                                    | Interfaccia utente a componenti           |
| **Build tool**         | [Vite](https://vitejs.dev/)                                                    | Dev server con HMR e build ottimizzato    |
| **Stili**              | CSS Modules + variabili CSS (`index.css`)                                      | Un file CSS per pagina, senza framework   |
| **Grafici**            | [Recharts](https://recharts.org/)                                              | Visualizzazione dati (leaderboard charts) |
| **Routing**            | [React Router v7](https://reactrouter.com/) (`react-router-dom`)               | Navigazione lato client, rotte protette   |
| **Dati dal server**    | [TanStack Query](https://tanstack.com/query)                                   | Chiamate API, cache, stati di caricamento |
| **Notifiche**          | [react-toastify](https://fkhadra.github.io/react-toastify/)                    | Messaggi a comparsa (successo/errore)     |
| **Reverse proxy**      | [Traefik](https://traefik.io/)                                                 | Routing, TLS automatico (Let's Encrypt)   |
| **Containerizzazione** | [Docker Compose](https://docs.docker.com/compose/)                             | Orchestrazione servizi (dev + prod)       |
| **Package manager**    | [uv](https://docs.astral.sh/uv/) (backend), npm (frontend)                     | Gestione dipendenze                       |
| **Testing**            | pytest + httpx (backend)                                                       | Test DB e API (nessun test automatico nel frontend) |
| **Linting**            | Ruff + Black (backend), ESLint (frontend)                                      | Qualità del codice                        |

---

## Struttura del progetto

```
polibench/
├── backend/                    # API FastAPI
│   ├── app/
│   │   ├── auth/               # Autenticazione JWT e OAuth2
│   │   ├── config/             # Configurazione (Pydantic Settings)
│   │   ├── models/             # Documenti Beanie (MongoDB)
│   │   ├── routers/            # Endpoint HTTP (sottili)
│   │   ├── schemas/            # Schemi Pydantic (input/output API)
│   │   ├── services/           # Logica di business
│   │   └── main.py             # Entry point dell'applicazione
│   ├── scripts/
│   │   └── seed.py             # Popolazione DB con dati di esempio
│   └── tests/
│       ├── db/                 # Smoke test database
│       └── routers/            # Test API end-to-end
│
├── frontend/                   # Web app React (JavaScript)
│   ├── src/
│   │   ├── pages/              # Una pagina per file (Home, Dataset, Modelli, Leaderboard, …)
│   │   ├── components/         # Componenti riusati (Layout, EmptyState, FilterMenu, grafici, …)
│   │   ├── contexts/           # Sessione utente (AuthContext e AuthProvider)
│   │   ├── hooks/              # Hook per le chiamate al backend (useDatasets, useModels, …)
│   │   ├── utils/              # Funzioni di supporto (date, metriche, controllo del CSV)
│   │   ├── styles/             # Un file .module.css per pagina o componente
│   │   ├── App.jsx             # Tabella delle rotte
│   │   ├── main.jsx            # Punto di ingresso
│   │   └── index.css           # Variabili di colore, tipografia, regole globali
│   └── public/                 # Asset statici
│
├── docs/                       # Documentazione estesa
│   ├── backend/                
│   └── frontend/
│
├── docker-compose.yml          # Sviluppo locale (hot reload)
├── docker-compose.prod.yml     # Produzione (non preparata per il frontend, vedi più sotto)
├── .env.example                # Template variabili d'ambiente
├── GUIDA-AVVIO.md              # Guida passo passo per avviare il progetto
└── LICENSE                     # MIT
```

---

## Architettura

### Backend — layer separati

```
┌──────────────────────────────────────────┐
│            HTTP (FastAPI routers)         │  ← routers/
├──────────────────────────────────────────┤
│         Schemi API (Pydantic)            │  ← schemas/
├──────────────────────────────────────────┤
│         Service Layer (logica)           │  ← services/
├──────────────────────────────────────────┤
│         Autenticazione (JWT)             │  ← auth/
├──────────────────────────────────────────┤
│        Modelli dati (Beanie/ODM)         │  ← models/
├──────────────────────────────────────────┤
│           Database (MongoDB)             │  ← via Motor (async)
└──────────────────────────────────────────┘
```

I router sono volutamente **sottili**: ricevono la richiesta, delegano al service layer e restituiscono la risposta. Tutta la logica (risoluzione UUID → ObjectId, denormalizzazione, query leaderboard) vive nei service.

### Frontend — layout

```
┌──────────────────────────────────────────────────────────────┐
│  Menu in alto: logo, pagine (Home, Leaderboard, Submit        │
│  Experiment, Models, Datasets, Users), profilo / login        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Contenuto della pagina (larghezza massima, centrato):       │
│  liste e schede, form, dettagli, filtri e grafici            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Il frontend parla con il backend solo con chiamate `fetch` agli indirizzi `/api/v1/...`: con Docker le inoltra Traefik (porta 80), con `npm run dev` le inoltra Vite (da `http://localhost:5173` verso `http://localhost:8000`). Non serve nessun indirizzo da configurare. I dettagli sono in [`docs/frontend/00_overview.md`](docs/frontend/00_overview.md).

---

## Entità del dominio

| Entità         | Descrizione                                                                                           |
|----------------|-------------------------------------------------------------------------------------------------------|
| **User**       | Utente della piattaforma con ruolo (`admin`, `researcher`, `viewer`), autenticazione e verifica email |
| **Team**       | Gruppo di ricerca che aggrega utenti sotto uno stesso namespace                                       |
| **Dataset**    | Catalogo logico del dataset (nome, task, visibilità, metadati)                                        |
| **DatasetVersion** | Unità operativa versionata con YAML raw, sources/resources e dataset characteristics               |
| **Pipeline**   | Configurazione eseguibile su una DatasetVersion (YAML + blocchi normalizzati + status)                 |
| **MLModel**    | Algoritmo di raccomandazione con iperparametri di riferimento                                         |
| **Experiment** | Associazione pipeline–modello con configurazione, seed, codice e stato                                |
| **ExperimentMetric** | Risultato numerico di performance (CSV import) denormalizzato per leaderboard/query veloci      |
| **MetricImportJob** | Job async di import metriche da CSV con stati (`uploaded`, `processing`, `completed`, `failed`) |

---

## Avvio rapido

La guida passo passo, pensata anche per chi non conosce Docker, è in [`GUIDA-AVVIO.md`](GUIDA-AVVIO.md). Qui il riassunto.

### Prerequisiti

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)
- Le porte **80, 5173, 8000, 8090, 27017** libere (se hai altre copie di Polibench accese, fermale con `docker compose stop`)

### 1. Clona il repository

```bash
git clone -b newFrontend https://github.com/Vito150304/polibench.git polibench
cd polibench
```

### 2. Configura le variabili d'ambiente

```bash
cp .env.example .env
```

Per un primo avvio in locale bastano **due modifiche** nel file `.env`: `SECRET_KEY` (una sequenza casuale di almeno 32 caratteri, per esempio con `openssl rand -hex 32`) e `FIRST_SUPERUSER_PASSWORD` (la password dell'amministratore). Gli altri valori si possono lasciare così come sono; la sezione "Configurazione" più sotto li descrive. Il file `.env` non va mai committato: contiene password e chiavi segrete. La [guida di avvio](GUIDA-AVVIO.md) spiega ogni passo.

### 3. Avvia lo stack

```bash
docker compose up -d --build
```

Parte tutto: database, backend, frontend, reverse proxy e Mongo Express. Per spegnere tenendo i dati usa `docker compose stop`; per riaccendere `docker compose up -d`.

### 4. Popola il database con dati di esempio

```bash
docker compose exec backend uv run python scripts/seed.py --mode demo
```

Modalità disponibili del seed:

- `minimal`: seed rapido con 1 dataset/versione + 1 modello + 1 esperimento.
- `demo`: seed esteso multi-dataset/multi-versione con stati esperimenti misti e metric import realistici.
- `edge`: casi limite validi per test UI/consistenza (senza dati volutamente invalidi).

Per svuotare il database prima di ripopolarlo esiste l'opzione `--reset` (per un primo avvio non serve: lancia il comando una volta sola).

### 5. Apri l'applicazione

| Servizio              | URL                                                              |
|-----------------------|------------------------------------------------------------------|
| **Frontend (Docker)** | [http://localhost](http://localhost)                             |
| **API root**          | [http://localhost/api/v1](http://localhost/api/v1)               |
| **Swagger UI**        | [http://localhost/docs](http://localhost/docs)                   |
| **ReDoc**             | [http://localhost/redoc](http://localhost/redoc)                 |
| **Mongo Express**     | [http://localhost/mongo-express](http://localhost/mongo-express) |
| **Traefik Dashboard** | [http://localhost:8090](http://localhost:8090)                   |

Con il frontend avviato da Docker apri sempre `http://localhost`, **senza** `:5173`: la porta 5173 è l'accesso interno del container e non inoltra le chiamate al backend, quindi non funziona correttamente.

Se invece stai lavorando sul frontend con `npm run dev` (vedi "Sviluppo locale"), il frontend è su [http://localhost:5173](http://localhost:5173) e `http://localhost` mostra "404 page not found", perché il container del frontend è fermo. Gli altri link della tabella (API, Swagger, ReDoc, Mongo Express, Traefik) funzionano in entrambi i casi.

Per entrare come amministratore scegli **Login** e usa l'email scritta in `FIRST_SUPERUSER` e la password impostata al punto 2. Senza login puoi già consultare leaderboard, dataset e modelli.

Note sul seed:

- fixture YAML registry reali in `backend/scripts/fixtures/datarec_registry/`
- metriche esperimenti demo importate da CSV separati (non confuse con dataset characteristics YAML)
- `demo` include fixture per testare `Show best configuration`: `amazon_books` v2023 con ranking metric trade-off (`ndcg@10`, `recall@20`, `hit@10`) e `movielens` v1m con metriche rating minimizzate (`rmse`, `mae`)

---

## Sviluppo locale (senza Docker)

### Backend

```bash
cd backend
uv sync                        # Installa le dipendenze nel venv
uv run fastapi dev app/main.py # Avvia il server di sviluppo
```

Il server sarà disponibile su `http://127.0.0.1:8000`.

- API: `http://localhost:8000/api/v1/`
- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend

Il modo più semplice per lavorare sul frontend è tenere acceso il resto con Docker e fermare solo il container del frontend:

```bash
docker compose up -d
docker compose stop frontend
cd frontend
npm install     # Installa le dipendenze
npm run dev     # Avvia il dev server con hot reload
```

Il frontend sarà disponibile su [http://localhost:5173](http://localhost:5173). Il server di sviluppo inoltra le chiamate `/api` al backend in Docker (`http://localhost:8000`, vedi `frontend/vite.config.js`), quindi il resto dello stack deve essere acceso.

Mentre lavori così:

- usa `http://localhost:5173`, non `http://localhost`: finché il container del frontend è fermo, `http://localhost` risponde "404 page not found";
- il link di verifica dell'email stampato nei log del backend comincia con `http://localhost/verify-email?token=...`: aggiungi `:5173` dopo `localhost` (`http://localhost:5173/verify-email?token=...`);
- quando hai finito, ferma `npm run dev` (Ctrl+C) e ricostruisci il frontend in Docker con `docker compose up -d --build frontend`: da quel momento torna a funzionare `http://localhost`.

---

## Test

### Backend — test database (smoke test)

```bash
cd backend
uv run pytest tests/db/ -v
```

### Backend — test API end-to-end

```bash
cd backend
uv run pytest tests/routers/ -v
```

### Backend — tutti i test

```bash
cd backend
uv run pytest -v
```

### Frontend

Il frontend non ha test automatici. Si controlla la qualità del codice con ESLint (lo stesso controllo della CI):

```bash
cd frontend
npm run lint
```

---

## Configurazione

Tutte le variabili d'ambiente sono definite nel file `.env` alla radice del progetto. Un template con valori di esempio è disponibile in [`.env.example`](.env.example).

### Variabili principali

Il frontend non legge variabili d'ambiente: chiama sempre `/api/v1/...` sullo stesso indirizzo da cui è servito. `VITE_BACKEND_API_URL` e `VITE_PWD_SIGNUP_ENABLED` sono ancora presenti in `.env.example` (restano dal progetto originale), ma il codice del frontend non le usa.

| Variabile                  | Descrizione                                                  | Default                    |
|----------------------------|--------------------------------------------------------------|----------------------------|
| `DOMAIN`                   | Dominio dell'applicazione                                    | `localhost`                |
| `ENVIRONMENT`              | Ambiente (`development`, `test`, `production`)               | `development`              |
| `PROJECT_NAME`             | Nome del progetto                                            | `polibench`                |
| `SECRET_KEY`               | Chiave segreta per JWT (generala con `openssl rand -hex 32`) | —                          |
| `FIRST_SUPERUSER`          | Email del superutente creato al primo avvio                  | `admin@polibench.com`      |
| `FIRST_SUPERUSER_PASSWORD` | Password del superutente                                     | —                          |
| `MONGO_HOST`               | Host MongoDB                                                 | `localhost`                |
| `MONGO_PORT`               | Porta MongoDB                                                | `27017`                    |
| `MONGO_DB`                 | Nome del database                                            | `polibench`                |
| `MONGO_USER`               | Username MongoDB                                             | —                          |
| `MONGO_PASSWORD`           | Password MongoDB                                             | —                          |
| `STACK_NAME`               | Nome dello stack Docker (separa i dati di copie diverse)     | `polibench`                |
| `FRONTEND_URL`             | URL del frontend (per link di verifica email)                | `http://localhost`         |

### SMTP (invio email di verifica)

Polibench supporta la verifica dell'email degli utenti registrati. Configura un provider SMTP per abilitare l'invio. Se SMTP non è configurato, il link di verifica viene stampato nella console del backend (per leggerlo: `docker compose logs backend | grep "Link di verifica"`).

Opzioni supportate:

- **Gmail** — STARTTLS su porta 587 (richiede [App Password](https://myaccount.google.com/apppasswords))
- **Aruba** — SSL diretto su porta 465
- Qualsiasi provider SMTP compatibile

### SSO Google (opzionale)

Per abilitare il login con Google, configura `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` ottenuti dalla [Google Cloud Console](https://console.cloud.google.com/). Lascia vuoti per disabilitare.

### Mongo Express

Il pannello web Mongo Express è protetto da HTTP Basic Auth. Configura `MONGO_EXPRESS_USER` e `MONGO_EXPRESS_PASSWORD` nel file `.env`. In produzione cambia sempre le credenziali di default.

---

## Deploy in produzione

Il file [`docker-compose.prod.yml`](docker-compose.prod.yml) è configurato per il deploy su un server con:

- **Traefik** come reverse proxy con TLS automatico (Let's Encrypt)
- Redirect automatico HTTP → HTTPS e www → non-www
- Mongo Express protetto e accessibile su `/mongo-express`

> **Nota.** In questa versione la parte di produzione è ereditata dal progetto originale e **non è stata provata**: il frontend ha solo il `Dockerfile.development`, mentre `docker-compose.prod.yml` cerca un `frontend/Dockerfile` (build compilata servita da un web server) che non è stato scritto. Per un uso reale servirà prepararlo.

### Avviare in produzione

```bash
# Crea la rete Traefik (solo la prima volta)
docker network create traefik-public

# Avvia lo stack
docker compose -f docker-compose.prod.yml up -d
```

### Variabili specifiche per produzione

Nel file `.env` aggiorna almeno:

| Variabile                  | Valore produzione                |
|----------------------------|----------------------------------|
| `DOMAIN`                   | `tuodominio.com`                 |
| `ENVIRONMENT`              | `production`                     |
| `SECRET_KEY`               | Valore casuale (32+ byte hex)    |
| `FIRST_SUPERUSER_PASSWORD` | Password forte                   |
| `MONGO_PASSWORD`           | Password forte                   |
| `MONGO_EXPRESS_PASSWORD`   | Password forte                   |
| `TRAEFIK_TLS_EMAIL`        | Email valida per Let's Encrypt   |
| `VITE_BACKEND_API_URL`     | `https://tuodominio.com/api/v1/` |
| `FRONTEND_URL`             | `https://tuodominio.com`         |
| `BACKEND_CORS_ORIGINS`     | `["https://tuodominio.com"]`     |

> ⚠️ **Non usare mai i valori di default del `.env.example` in produzione.** Genera sempre password e chiavi casuali.

---

## Endpoint API principali

| Metodo  | Endpoint                             | Descrizione                                       |
|---------|--------------------------------------|---------------------------------------------------|
| `POST`  | `/api/v1/login/access-token`         | Ottieni JWT (email/password)                      |
| `GET`   | `/api/v1/login/google`               | Avvia OAuth2 con Google                           |
| `POST`  | `/api/v1/users`                      | Registrazione utente                              |
| `GET`   | `/api/v1/users/me`                   | Profilo utente corrente                           |
| `PATCH` | `/api/v1/users/me`                   | Aggiorna profilo                                  |
| `GET`   | `/api/v1/users/verify/{token}`       | Verifica email con token                          |
| `GET`   | `/api/v1/datasets`                   | Lista dataset                                     |
| `POST`  | `/api/v1/datasets`                   | Crea dataset (autenticato + verificato)           |
| `GET`   | `/api/v1/datasets/{uuid}`            | Dettaglio dataset                                 |
| `GET`   | `/api/v1/datasets/{uuid}/versions`   | Lista DatasetVersion del dataset                  |
| `POST`  | `/api/v1/datasets/{uuid}/versions`   | Crea DatasetVersion da YAML                       |
| `POST`  | `/api/v1/datasets/{uuid}/versions/preview` | Preview parse/validazione YAML               |
| `GET`   | `/api/v1/dataset-versions/{uuid}`    | Dettaglio DatasetVersion                          |
| `GET`   | `/api/v1/dataset-versions/{uuid}/sources` | Sources della DatasetVersion                 |
| `GET`   | `/api/v1/dataset-versions/{uuid}/resources` | Resources della DatasetVersion              |
| `GET`   | `/api/v1/dataset-versions/{uuid}/sources-with-resources` | Sources annidate con Resources figlie |
| `GET`   | `/api/v1/dataset-versions/{uuid}/pipelines` | Lista pipeline della DatasetVersion          |
| `POST`  | `/api/v1/dataset-versions/{uuid}/pipelines` | Crea pipeline per DatasetVersion             |
| `POST`  | `/api/v1/dataset-versions/{uuid}/pipelines/preview` | Preview parse pipeline YAML            |
| `GET`   | `/api/v1/pipelines/{uuid}`           | Dettaglio Pipeline                                |
| `GET`   | `/api/v1/pipelines/{uuid}/yaml`      | YAML della Pipeline                               |
| `GET`   | `/api/v1/pipelines/{uuid}/experiments` | Esperimenti collegati alla Pipeline            |
| `GET`   | `/api/v1/dataset-versions/{uuid}/yaml/{kind}` | YAML (`dataset`, `version`, `characteristics`) |
| `GET`   | `/api/v1/dataset-versions/{uuid}/experiments` | Esperimenti collegati alla versione         |
| `GET`   | `/api/v1/ml-models`                  | Lista modelli                                     |
| `POST`  | `/api/v1/ml-models`                  | Registra modello (autenticato + verificato)       |
| `GET`   | `/api/v1/ml-models/{uuid}`           | Dettaglio modello                                 |
| `POST`  | `/api/v1/experiments`                | Sottometti esperimento (autenticato + verificato) |
| `GET`   | `/api/v1/experiments/{uuid}`         | Dettaglio esperimento                             |
| `GET`   | `/api/v1/experiments/{uuid}/metrics` | Metriche dell'esperimento                         |
| `POST`  | `/api/v1/experiments/{uuid}/metric-import` | Import metriche da CSV (async)              |
| `GET`   | `/api/v1/leaderboard`                | Leaderboard filtrata per dataset/version/pipeline |
| `GET`   | `/api/v1/leaderboard/multi`          | Leaderboard multi-metrica (dataset/version/pipeline) |
| `POST`  | `/api/v1/leaderboard/query`          | Query avanzata (author/model/hyperparams)         |
| `POST`  | `/api/v1/leaderboard/best-configuration` | Best per modello su stessa dataset version/pipeline, metrica target e direction |

La documentazione interattiva completa è disponibile su `/docs` (Swagger UI) e `/redoc`.

### Contratto YAML (allineato a DataRec)

- `dataset_yaml_raw`: metadata catalografici dataset-level (`datasets/*.yml`)
- `version_yaml_raw`: definizione version-level con `sources` e `resources` (`versions/*_*.yml`)
- `characteristics_yaml_raw`: dataset characteristics (`metrics/*_*.yml`)
- `pipeline_yaml_raw`: compatibilità transitoria in create-version; la source of truth pipeline è il model `Pipeline` (`yaml_raw` + `blocks`)

Le **dataset characteristics** (`n_users`, `density`, `gini_*`) restano in `DatasetVersion`;  
le **experiment metrics** (`ndcg`, `recall`, `rmse`, ...) entrano solo in `ExperimentMetric` via CSV import.

---

## Documentazione

La cartella [`docs/`](docs/) contiene documentazione estesa divisa per area:

### Backend (`docs/backend/`)

| File                                                                                | Contenuto                                   |
|-------------------------------------------------------------------------------------|---------------------------------------------|
| [`00_overview.md`](docs/backend/00_overview.md)                                     | Panoramica generale e obiettivi             |
| [`01_technologies.md`](docs/backend/01_technologies.md)                             | Stack tecnologico e motivazioni             |
| [`02_architecture.md`](docs/backend/02_architecture.md)                             | Architettura a layer e struttura cartelle   |
| [`03_data_models.md`](docs/backend/03_data_models.md)                               | Modelli dati Beanie e diagramma di dominio  |
| [`04_schemas.md`](docs/backend/04_schemas.md)                                       | Schemi Pydantic per input/output API        |
| [`05_authentication.md`](docs/backend/05_authentication.md)                         | JWT, OAuth2, verifica email, ruoli          |
| [`06_routers.md`](docs/backend/06_routers.md)                                       | Endpoint HTTP e convenzioni                 |
| [`07_configuration.md`](docs/backend/07_configuration.md)                           | Pydantic Settings e variabili d'ambiente    |
| [`08_testing.md`](docs/backend/08_testing.md)                                       | Strategia di test (DB smoke test + API e2e) |
| [`09_services.md`](docs/backend/09_services.md)                                     | Service layer e logica di business          |
| [`10_decisions.md`](docs/backend/10_decisions.md)                                   | Decisioni architetturali (ADR) e trade-off  |
| [`11_errors_and_api_conventions.md`](docs/backend/11_errors_and_api_conventions.md) | Gestione errori e convenzioni HTTP          |
| [`12_indexes_and_performance.md`](docs/backend/12_indexes_and_performance.md)       | Query critiche, indici e performance        |
| [`13_deployment.md`](docs/backend/13_deployment.md)                                 | Deploy con Docker e Traefik                 |
| [`14_future_work.md`](docs/backend/14_future_work.md)                               | Limiti attuali e sviluppi futuri            |
| [`domain_model.puml`](docs/backend/domain_model.puml)                               | Diagramma UML del dominio (PlantUML)        |

### Frontend (`docs/frontend/`)

| File                                                     | Contenuto                                                                   |
|----------------------------------------------------------|-----------------------------------------------------------------------------|
| [`00_overview.md`](docs/frontend/00_overview.md)         | Struttura, rotte, sessione, chiamate al backend, leaderboard, stili         |

---

## Pagine dell'applicazione

Le pagine marcate "protetta" richiedono di aver fatto il login: se non lo sei, l'app ti porta a `/login`.

| Pagina                       | Route                                            | Descrizione                                                       |
|------------------------------|--------------------------------------------------|-------------------------------------------------------------------|
| Home                         | `/`                                              | Presentazione, percorso in sei passi, collegamenti rapidi         |
| Login                        | `/login`                                         | Accesso con email e password                                      |
| Registrazione                | `/register`                                      | Registrazione di un nuovo utente                                  |
| Email inviata                | `/email-sent`                                    | Conferma dell'invio dell'email di verifica                        |
| Verifica email               | `/verify-email`                                  | Conferma dell'indirizzo email (link ricevuto)                     |
| Profilo                      | `/profile`                                       | Dati dell'utente, modifica e cancellazione dell'account (protetta) |
| Utenti                       | `/users`                                         | Elenco utenti (protetta, solo superutente)                        |
| Dataset                      | `/datasets`                                      | Elenco dei dataset con ricerca                                    |
| Dettaglio dataset            | `/datasets/:dataset_uuid`                        | Informazioni, versioni e download dei file YAML                   |
| Nuovo dataset                | `/register-dataset`                              | Form di registrazione (protetta)                                  |
| Nuova versione               | `/datasets/:dataset_uuid/create-version`         | Creazione di una versione da YAML con anteprima (protetta)        |
| Dettaglio versione           | `/dataset-versions/:version_uuid`                | Pipeline, esperimenti e relative metriche (protetta)              |
| Nuova pipeline               | `/dataset-versions/:version_uuid/create-pipeline`| Creazione di una pipeline da YAML con anteprima (protetta)        |
| Modelli                      | `/models`                                        | Elenco dei modelli                                                |
| Nuovo modello                | `/register-model`                                | Form di registrazione (protetta)                                  |
| Nuovo esperimento            | `/experiment`                                    | Invio di un esperimento, con caricamento opzionale del CSV (protetta) |
| Leaderboard                  | `/leaderboard/:datasetId?/:versionId?/:pipelineId?` | Classifica con filtri e grafici                                |

---

## Licenza

Questo progetto è distribuito con licenza [MIT](LICENSE).

---

## Autori

- **Backend, documentazione del backend e progetto originale:** Raffaele Grieco.
- **Frontend (riprogettazione completa dell'interfaccia):** Vito Burdi, tesi di laurea triennale in Ingegneria Informatica e dell'Automazione, Politecnico di Bari, relatore Prof. Antonio Ferrara.
