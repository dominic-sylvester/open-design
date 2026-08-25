/** Local stubs after OpenDesign Cloud removal. */

export type AmrProfile = 'prod' | 'test' | 'feature-test' | 'local';

export function resolveAmrProfile(_env: NodeJS.ProcessEnv = process.env): AmrProfile {
  return 'local';
}

export function readVelaLoginStatus(
  _env: NodeJS.ProcessEnv = process.env,
  _configuredEnv?: NodeJS.ProcessEnv,
): { loggedIn: false; sessionState: 'signed_out' } {
  return { loggedIn: false, sessionState: 'signed_out' };
}

export async function fetchVelaPresetModels(
  _launchPath: string,
  _env: NodeJS.ProcessEnv,
): Promise<{ models: never[]; source: 'preset' }> {
  return { models: [], source: 'preset' };
}

export async function fetchVelaRemoteModelsWithRetry(
  _launchPath: string,
  _env: NodeJS.ProcessEnv,
): Promise<{ models: never[]; source: 'remote' }> {
  return { models: [], source: 'remote' };
}

export function classifyAmrAccountFailure(_text: string): { code: string; message?: string } | null {
  return null;
}

export function classifyAmrAccountFailureSignal(_input: unknown): { code: string; message?: string } | null {
  return null;
}

export function amrAccountFailureDetails(_failure: { code: string }): Record<string, unknown> {
  return {};
}

export const DEFAULT_AMR_RECHARGE_URL = '';

export const amrModelLoadingCache = {
  get: () => null as null,
  set: () => {},
  clear: () => {},
};
