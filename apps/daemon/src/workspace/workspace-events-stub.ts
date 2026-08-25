type WorkspaceEventSink = {
  send: (payload: unknown) => void;
};

/** Local SSE fan-out after OpenDesign Cloud hub removal. */
export function emitWorkspaceEventToScope(
  sinks: Map<string, Set<WorkspaceEventSink>>,
  workspaceId: string,
  payload: { type: string; at?: number },
): boolean {
  const partition = sinks.get(workspaceId.trim());
  if (!partition || partition.size === 0) return false;
  for (const sink of partition) sink.send(payload);
  return true;
}

export function emitWorkspaceEventToAllScopes(
  sinks: Map<string, Set<WorkspaceEventSink>>,
  payload: { type: string; at?: number },
): boolean {
  if (sinks.size === 0) return false;
  let emitted = false;
  for (const workspaceId of sinks.keys()) {
    emitted = emitWorkspaceEventToScope(sinks, workspaceId, payload) || emitted;
  }
  return emitted;
}
