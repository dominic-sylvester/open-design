export * from './collab-contracts';
export type {
  ProjectWorkspaceScope,
  ProjectWorkspaceScopeResponse,
  ProjectSyncState,
  WorkspaceProjectSummary,
  LiveArtifactRefreshSsePayload,
  LiveArtifactSsePayload,
  ProjectConversationCreatedSsePayload,
} from '@open-design/contracts';

// Re-export daemon/chat types that previously lived on collab types barrel.
export type {
  ApiErrorResponse,
  ChatAnalyticsHints,
  ChatRunCreateResponse,
  ChatRunListResponse,
  ChatRunStatus,
  ChatRunStatusResponse,
  ChatRequest,
  ChatSessionMode,
  ChatSseEvent,
  ChatSseStartPayload,
  DaemonAgentPayload,
  AmrModelsResponse,
  ByokChatProviderConfig,
  MediaExecutionPolicy,
  ResearchOptions,
  RunContextSelection,
  SseErrorPayload,
  StrategyTaskProjectionV2,
} from '@open-design/contracts';

/** Local stub for AMR wallet types removed from contracts. */
export interface AmrWalletSnapshot {
  status: 'signed_out' | 'available' | 'unavailable';
  profile: string;
  user: {
    id?: string;
    email?: string;
    name?: string;
    plan?: string;
  } | null;
  balanceUsd: string | null;
  updatedAt: string | null;
  fetchedAt: string;
  stale: boolean;
  source: 'vela_api' | 'daemon_cache' | 'unavailable';
  codingPlanModels?: readonly string[];
  error?: {
    code: 'signed_out' | 'missing_control_key' | 'unauthorized' | 'network' | 'upstream';
    message: string;
  };
}

export type AmrSessionState = 'signed-out' | 'signed-in' | 'pending' | 'reauth_required';
