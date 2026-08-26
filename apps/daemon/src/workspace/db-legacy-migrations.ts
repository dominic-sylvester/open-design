import type Database from 'better-sqlite3';

type SqliteDb = Database.Database;

export function migrateCollabSyncSnapshots(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS collab_sync_snapshots (
      face TEXT NOT NULL,
      account_id TEXT NOT NULL,
      workspace_id TEXT NOT NULL,
      digest_token TEXT NOT NULL,
      snapshot_json TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (face, account_id, workspace_id)
    );
  `);
}

export function migrateCommentRelayOutbox(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS comment_relay_outbox (
      workspace_id TEXT NOT NULL,
      workspace_member_id TEXT NOT NULL,
      team_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      comment_id TEXT NOT NULL,
      expected_owner_member_id TEXT,
      payload_json TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 1,
      attempt_count INTEGER NOT NULL DEFAULT 0,
      next_attempt_at INTEGER NOT NULL,
      last_error TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (workspace_id, workspace_member_id, project_id, comment_id)
    );

    CREATE INDEX IF NOT EXISTS idx_comment_relay_outbox_due
      ON comment_relay_outbox(next_attempt_at, updated_at);
  `);
}

export function migratePublicFilePublications(db: SqliteDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS public_file_publications (
      resource_team_id TEXT NOT NULL,
      owner_member_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      file_path TEXT NOT NULL,
      url TEXT NOT NULL,
      slug TEXT NOT NULL,
      file_name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (resource_team_id, owner_member_id, project_id, file_path)
    );
  `);
}
