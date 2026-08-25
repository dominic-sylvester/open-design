export function appendAmrAttributionToUrl(url: string): string {
  return url;
}

export function trackAmrAttributionClick(_props: Record<string, unknown>): void {}

export type AmrEntryAttribution = Record<string, unknown>;

export function readAmrEntryAttribution(): AmrEntryAttribution | null {
  return null;
}

export function readAmrAttribution(_now?: Date): AmrEntryAttribution | null {
  return null;
}

export function setRuntimeAmrConsoleOrigin(_origin?: string): void {}
