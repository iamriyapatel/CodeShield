# CodeShield 🛡️

CodeShield is a secure code analysis and vulnerability visualization platform
for JavaScript and TypeScript source code. It combines deterministic security
rules with a React dashboard and an interactive Three.js threat map.

## Features

- Paste source code and analyze it through a Fastify API
- Report file names, line numbers, evidence, severity, and confidence
- Detect potential hardcoded secrets, dynamic code execution, command injection,
  SQL injection patterns, and unsafe HTML rendering
- Show remediation guidance for each finding
- Visualize findings as a severity-colored 3D threat map
- Calculate an overall security posture: Good, Needs attention, or Critical

## Technology

- Node.js and TypeScript
- Fastify API
- React and Vite
- Three.js visualization
- Built-in Node test runner

## Run locally

Install dependencies and start the local development servers:

```powershell
cd C:\Projects\CodeShield
npm install
npm run dev
```

In a second terminal, start the dashboard:

```powershell
cd C:\Projects\CodeShield\frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The dashboard performs the
deterministic scan in the browser. The optional `/api/llm` endpoint is only
used to request AI root-cause analysis (RCA) and fixes.

## Vercel deployment and optional OpenRouter AI

Deploy the repository as a Vite frontend. In Vercel Project Settings, add:

```text
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=thinkingmachines/inkling:free
```

`OPENROUTER_API_KEY` is optional. If it is not configured, CodeShield still
performs local analysis and skips the AI RCA/fix request. Keep this key as a
server-side Vercel environment variable; never expose it as `VITE_*`.

The Vercel function in `api/llm.ts` forwards only the findings to OpenRouter,
so the full backend does not need to run in production.

## Testing

```powershell
cd C:\Projects\CodeShield
npm test
npm run build

cd frontend
npm run build
```

## Security note

CodeShield produces heuristic indicators for human review; it does not prove
that a vulnerability is exploitable. Only analyze code you own or have explicit
permission to inspect, and never commit real credentials or secrets.

## Roadmap

- AST-based analysis with language-aware rules
- File and folder upload support
- Finding detail drawer with source highlighting
- JSON and HTML security reports
- Persistent scan history
- Python analysis support
- Rule configuration and suppression workflow
