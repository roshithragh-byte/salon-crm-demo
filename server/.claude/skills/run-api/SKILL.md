---
name: run-api
description: Build, launch, and drive the API app
---

The API app is a NestJS server providing a health endpoint. It is driven by a custom Node.js script that builds the app, starts the server, and verifies the health endpoint.

## Prerequisites
- Node.js >=20
- npm

## Build
```bash
npm run build
```
This compiles TypeScript to JavaScript in the `dist/` directory.

## Run (agent path)
```bash
node .claude/skills/run-api/driver.mjs
```
This script:
1. Runs `npm run build`
2. Starts the server in production mode (`npm run start:prod`)
3. Waits for the health endpoint (`GET /api/v1/health`) to return 200
4. Outputs the health check response
5. Stops the server

The script exits with code 0 on success.

## Run (human path)
For manual testing, you can start the server and interact with it directly:
```bash
npm run start:prod
```
Then open http://localhost:3001/api/v1/health in a browser or use `curl`.

## Test
Run the test suite:
```bash
npm test
```

## Gotchas
- The server listens on port 3001 by default, configurable via the `API_PORT` environment variable.
- The health endpoint is at `/api/v1/health` due to the global prefix set in `main.ts`.
- The driver script assumes it is run from the API app directory (`apps/api`).

## Troubleshooting
- "Timeout waiting for server": Ensure the built output exists (`dist/main`) and that the server starts without errors. Check the server logs for startup issues.
- Health check returns non-200: Verify the server routes are correctly mapped and the health controller is functioning.