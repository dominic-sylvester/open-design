/** Pass-through image staging after OpenDesign Cloud AMR removal. */
export async function stageAmrImagePaths(
  _cwd: string,
  imagePaths: string[],
  _uploadDir: string,
): Promise<string[]> {
  return imagePaths;
}

/** Identity stderr filter when AMR-specific filtering is unavailable. */
export function createAgentStderrVisibilityFilter(_agentId: string) {
  return {
    write(chunk: unknown): string {
      if (chunk === null || chunk === undefined) return '';
      return typeof chunk === 'string' ? chunk : String(chunk);
    },
    flush(): string {
      return '';
    },
  };
}
