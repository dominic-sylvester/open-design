# Hermes Agent × OpenDesign MCP

**Parent:** [`architecture.md`](../architecture.md) · **Siblings:** [`agent-adapters.md`](../agent-adapters.md) · [`skills-protocol.md`](../skills-protocol.md) · [`wsl-setup.md`](../wsl-setup.md)

This guide wires **[Hermes Agent](https://github.com/nousresearch/hermes-agent)** to OpenDesign's MCP server so Hermes can list skills, create projects, commission generation runs, and read back artifacts — without opening the Studio UI.

For the product overview of Hermes as a design agent (skills, design systems, screenshot→UI loops), see the landing-page guide at [open-design.ai/agents/hermes-design/](https://open-design.ai/agents/hermes-design/).

> **Two directions, one product.** OpenDesign also launches Hermes as a **native runtime** inside Studio (`hermes acp --accept-hooks`). That path is documented in [`agent-adapters.md`](../agent-adapters.md). **This file covers the reverse:** Hermes stays the outer agent and calls OpenDesign through MCP or `od` CLI.

---

## What you get

Once connected, Hermes discovers OpenDesign tools the same way it discovers any other MCP server. Typical flows:

1. **Discover** — `list_skills`, `list_plugins`, design-system resources.
2. **Brief** — `collect_brief` / `confirm_brief` for interactive artifact setup (optional).
3. **Generate** — `create_project` → `start_run` → poll `get_run` until the run finishes.
4. **Deliver** — follow the Studio deep link from `get_run`, or pull source with `get_artifact` / `get_file`.

Hermes does **not** execute OpenDesign skills itself. `start_run` asks the OpenDesign daemon to spawn **its own** configured agent (Claude Code, Codex, BYOK, etc.) against the project workspace.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **OpenDesign running** | Desktop app, `pnpm tools-dev`, or Docker deploy. The daemon must answer `GET /api/health`. |
| **Hermes Agent installed** | [Install guide](https://hermes-agent.nousresearch.com/docs/guides/getting-started). MCP support needs the `mcp` extra (`pip install mcp` or the standard installer). |
| **Node on PATH (for `npx` servers)** | Only if you use a third-party bridge package; the official path uses the bundled `od mcp` stdio server. |

Hermes MCP config lives at `~/.hermes/config.yaml`. See [Hermes MCP docs](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes) for transport, filtering, and `/reload-mcp`.

---

## Quick start

### 1. Start OpenDesign

Use whichever shape you already run:

- **Desktop** — launch Open Design / Open Design Beta from Applications.
- **Development** — `pnpm tools-dev` from a source checkout.
- **Docker** — follow [`deploy/README.md`](../../deploy/README.md).

### 2. Print the MCP snippet

With the daemon up, print the Hermes YAML block (dry-run; does not write Hermes config):

```bash
od mcp install hermes --print
```

On macOS desktop installs, prefer **Settings → MCP server** in the app and copy the Hermes snippet there. The desktop path uses absolute binaries and avoids `/usr/bin/od` (macOS's octal-dump utility) shadowing OpenDesign's `od` command.

Hosted bootstrap (same installer, fails fast if `od` is wrong):

```bash
curl -fsSL https://open-design.ai/install.sh | sh -s hermes
```

While the daemon is running, the same payload is available at `GET /api/mcp/install-info`.

### 3. Paste into Hermes config

Open `~/.hermes/config.yaml` and merge the printed block under `mcp_servers:`. The shape is:

```yaml
mcp_servers:
  open-design:
    command: "<node-or-packaged-binary>"
    args: ["<path-to-od-cli>", "mcp", "--daemon-url", "http://127.0.0.1:<port>"]
    env:
      OD_DATA_DIR: "<daemon-data-root>"
```

`od mcp install hermes` is **manual-only**: OpenDesign prints this snippet instead of editing Hermes config automatically, because Hermes's on-disk schema is not auto-written by the installer yet.

Sidecar/desktop launches may omit `--daemon-url` in the snippet; the spawned `od mcp` discovers the live daemon URL through the packaged IPC status socket instead.

### 4. Reload MCP inside Hermes

In an active Hermes chat session:

```text
/reload-mcp
```

Verify tools loaded:

```text
What MCP tools do you have available?
```

Or run `/tools` and look for the `open-design` server prefix.

### 5. Try a generation prompt

```text
Use open-design to generate a landing page with the Linear design system.
```

Or step explicitly:

```text
Call list_skills, create a prototype project named "Hermes demo", start_run with the Linear design system and a one-page SaaS landing brief, poll get_run until done, then summarize what was written.
```

---

## Example workflow (MCP tool sequence)

End-to-end shape an outer Hermes session typically follows:

```text
1. list_skills                          → pick a recipe id (optional)
2. create_project { name, designSystem } → returns project id + conversationId
3. start_run { project, prompt, skill }  → returns runId immediately
4. get_run { runId }                     → poll until status is terminal
5. get_artifact { project, entry }       → bundle entry + referenced assets (optional)
```

`collect_brief` / `confirm_brief` replace steps 2–3 when you want the interactive brief card instead of a free-form prompt.

When `get_run` completes, prefer the **Preview / Studio URL** in the response for human review. Use `get_artifact` when Hermes needs source context for follow-up edits.

---

## MCP tools reference

Authoritative definitions: [`apps/daemon/src/mcp.ts`](../../apps/daemon/src/mcp.ts).

| Tool | Purpose |
|------|---------|
| `collect_brief` / `confirm_brief` | Interactive brief card for a new artifact type |
| `list_projects` / `get_project` / `create_project` / `delete_project` | Project CRUD |
| `get_active_context` | What the user currently has open in Studio (~5 min TTL) |
| `list_skills` / `list_plugins` | Discovery for `start_run` recipes |
| `start_run` / `get_run` / `cancel_run` | Commission generation and poll completion |
| `list_agents` | Runtimes the daemon can spawn for runs |
| `get_artifact` / `get_file` / `list_files` / `search_files` | Read project outputs |
| `create_artifact` / `write_file` / `delete_file` | Write paths when the outer agent edits files directly |

Design systems are exposed as MCP **resources** (`od://design-systems/...`), not runnable tools.

---

## CLI alternative (no MCP)

Every MCP capability also exists on the `od` CLI against the same `/api/*` surface. Hermes can shell out when MCP is unavailable:

```bash
od project list --json
od project create "Hermes demo" --json
od chat --project <id> --prompt "Build a one-page landing with the Linear design system" --json
```

Use `--prompt-file -` for heredoc-friendly prompts. This path is the embeddability contract documented in root `AGENTS.md`.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `od mcp install hermes` prints a snippet but exits non-zero | Expected for manual agents. Copy the YAML; success is measured by Hermes loading the server. |
| macOS `od: illegal option` or garbage output | Your shell resolved `/usr/bin/od`. Use the desktop **Settings → MCP server** snippet or put OpenDesign's `od` earlier on `PATH`. |
| Hermes shows no OpenDesign tools after paste | Run `/reload-mcp`. Confirm `pip install mcp` (or reinstall with `[mcp]` extras). Check Hermes logs for spawn errors. |
| MCP spawn fails with `EPERM` / wrong data dir | Ensure the snippet includes `OD_DATA_DIR` from the daemon (desktop Settings snippet pins this). |
| `start_run` succeeds but nothing generates | OpenDesign spawns **its own** agent. Confirm a runtime is installed/detected in OpenDesign Settings, or configure BYOK. |
| Docker daemon, local Hermes | Official MCP snippets are stdio/local-path based. Run Hermes where it can reach the daemon URL, or use a bridge such as [open-design-mcp](https://github.com/nano-step/open-design-mcp) with `OD_DAEMON_URL` (community-maintained). |

---

## Related documentation

| Topic | Link |
|-------|------|
| Hermes MCP (generic) | [Use MCP with Hermes](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes) |
| Hermes MCP config schema | [MCP config reference](https://hermes-agent.nousresearch.com/docs/reference/mcp-config-reference) |
| OpenDesign agent adapters (Hermes as runtime) | [`agent-adapters.md`](../agent-adapters.md) |
| OpenDesign architecture | [`architecture.md`](../architecture.md) |
| WSL2 + MCP install notes | [`wsl-setup.md`](../wsl-setup.md) |
| External reference entry | [`references.md`](../references.md#hermes-agent-hermes-nous-research) |
