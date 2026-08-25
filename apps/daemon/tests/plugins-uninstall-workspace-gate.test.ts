// Red spec for the plugin uninstall security gap the workspace-isolation
// round fixed: `POST /api/plugins/:id/uninstall` used to carry NO permission
// check at all — any caller, any workspace, any role could uninstall any
// plugin. It is now gated the same way project mutations are, via the shared
// `enforceWorkspaceResourceMutation` (collab/workspace-resource-mutation.ts),
// applied only to plugins that carry an actual `workspace_resources` binding
// row (see routes/plugins/index.ts's doc comment on the uninstall route for
// why a legacy/unbound plugin stays outside the gate).
//
// Follows the same "seed the plugin folder directly on disk, alongside the
// real running server" pattern as tests/plugins-uninstall-traversal.test.ts,
// plus directly seeding the `workspace_resources` binding via db.ts — the
// same SQLite instance the running server already opened (db.ts caches one
// instance per resolved data dir; RUNTIME_DATA_DIR / OD_DATA_DIR agree within
// one vitest file, so this reuses the server's own connection instead of
// racing a second one).

import type http from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startServer } from '../src/server.js';
import {
  defaultRegistryRoots,
  resolvePluginFolder,
  upsertInstalledPlugin,
} from '../src/plugins/registry.js';
import { ensureWorkspaceResource, openDatabase, updateWorkspaceResource } from '../src/db.js';

let server: http.Server;
let baseUrl: string;
let shutdown: (() => Promise<void> | void) | undefined;

beforeAll(async () => {
  const started = (await startServer({ port: 0, returnServer: true })) as {
    url: string;
    server: http.Server;
    shutdown?: () => Promise<void> | void;
  };
  baseUrl = started.url;
  server = started.server;
  shutdown = started.shutdown;
});

afterAll(async () => {
  await Promise.resolve(shutdown?.());
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

async function seedPluginFolder(pluginId: string): Promise<string> {
  const pluginsRoot = defaultRegistryRoots().userPluginsRoot;
  const folder = path.join(pluginsRoot, pluginId);
  await mkdir(folder, { recursive: true });
  await writeFile(
    path.join(folder, 'open-design.json'),
    JSON.stringify({ name: pluginId, title: pluginId, version: '1.0.0' }),
  );
  const resolved = await resolvePluginFolder({
    folder,
    folderId: pluginId,
    sourceKind: 'local',
    source: folder,
  });
  if (!resolved.ok) throw new Error(resolved.errors.join('; '));
  const db = openDatabase(process.cwd(), { dataDir: process.env.OD_DATA_DIR! });
  upsertInstalledPlugin(db, resolved.record);
  return folder;
}

function bindPluginToWorkspace(pluginId: string, workspaceId: string, createdByWorkspaceMemberId: string) {
  const db = openDatabase(process.cwd(), { dataDir: process.env.OD_DATA_DIR! });
  return ensureWorkspaceResource(db, 'plugin', workspaceId, pluginId, {
    visibility: 'personal',
    resourceState: 'active',
    createdByWorkspaceMemberId,
    updatedByWorkspaceMemberId: createdByWorkspaceMemberId,
  });
}

describe('POST /api/plugins/:id/uninstall — workspace ownership gate', () => {
  it('keeps a legacy unbound plugin manageable from the headerless local lane', async () => {
    const pluginId = `wsgate-legacy-local-${Date.now()}`;
    const folder = await seedPluginFolder(pluginId);

    const resp = await fetch(`${baseUrl}/api/plugins/${pluginId}/uninstall`, {
      method: 'POST',
    });

    expect(resp.status).toBe(200);
    expect(existsSync(folder)).toBe(false);
  });

  it('rejects a headerless caller against a team-visibility plugin', async () => {
    const pluginId = `wsgate-team-${Date.now()}`;
    const folder = await seedPluginFolder(pluginId);
    bindPluginToWorkspace(pluginId, 'ws-gate-5', 'member-owner');
    const db = openDatabase(process.cwd(), { dataDir: process.env.OD_DATA_DIR! });
    updateWorkspaceResource(db, 'plugin', 'ws-gate-5', pluginId, { visibility: 'team' });

    const resp = await fetch(`${baseUrl}/api/plugins/${pluginId}/uninstall`, { method: 'POST' });

    expect(resp.status).toBe(404);
    expect(existsSync(folder)).toBe(true);
  });
});
