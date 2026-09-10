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

Install backend dependencies and start the API:

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

Open `http://localhost:5173` in your browser. The API is available at
`http://localhost:4000` and exposes `/api/health` and `/api/analyze`.

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
