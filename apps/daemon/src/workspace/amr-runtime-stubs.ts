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
    filter(chunk: string): string {
      return chunk;
    },
    flush(): string {
      return '';
    },
  };
}
