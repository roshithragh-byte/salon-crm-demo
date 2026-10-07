# PilotWave Agent — Mintlify Documentation

This directory is a standalone Mintlify documentation project for the PilotWave Salon Operations Agent.

## Local development

From this directory:

```bash
mint dev
```

Validate before publishing:

```bash
mint validate
```

Mintlify's current workflow supports a docs project in a subdirectory of a larger repository, which keeps this Agent documentation isolated from the application's existing `docs/` tree.

## Documentation rule

Do not implement Agent runtime code based on an undocumented behavior.

Update the relevant contract first, review it, then implement against the approved contract.

## Current scope

- Agent Charter
- Architecture
- Copilot/Autopilot modes
- 13-tool registry
- JSON input/output contracts
- Permission policy
- Decision/execution workflows
- Common error contract

Implementation is intentionally not included in this change.
