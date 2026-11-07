# Polibench — frontend

Interfaccia web di Polibench: React 19 + Vite, in JavaScript.

## Comandi

```bash
npm install     # installa le dipendenze
npm run dev     # server di sviluppo su http://localhost:5173 (inoltra /api a http://localhost:8000)
npm run build   # build di produzione
npm run lint    # controllo ESLint (lo stesso della CI)
```

## Sviluppare con Docker acceso

Il modo più semplice è tenere acceso il resto dello stack con Docker e fermare solo il container del frontend:

```bash
docker compose up -d
docker compose stop frontend
cd frontend
npm run dev
```

- Apri `http://localhost:5173`. `http://localhost` risponde "404 page not found" finché il container del frontend è fermo.
- Quando hai finito, ferma `npm run dev` (Ctrl+C) e ricostruisci il frontend in Docker: `docker compose up -d --build frontend`. Da quel momento torna a funzionare `http://localhost`.

## Dove guardare

- `src/App.jsx`: le rotte.
- `src/pages/`: una pagina per file, con il suo CSS in `src/styles/`.
- `src/hooks/`: le chiamate al backend.
- `src/index.css`: colori, font, tema chiaro e scuro.

La descrizione completa è in [`docs/frontend/00_overview.md`](../docs/frontend/00_overview.md), nella radice del repository.

