import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { runVelaCommandMock } = vi.hoisted(() => ({
  runVelaCommandMock: vi.fn(),
}));

vi.mock('../src/workspace/vela-command-stub.js', () => ({
  runVelaCommand: runVelaCommandMock,
}));

import { runResource } from '../src/resource-cli.js';

describe('od resource Vela compatibility entry point', () => {
  beforeEach(() => {
    process.exitCode = undefined;
    runVelaCommandMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it('forwards resource arguments to the login-backed Vela CLI', async () => {
    runVelaCommandMock.mockResolvedValue('{"version":3}\n');
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await runResource([
      'push',
      'project',
      'project-1',
      '/tmp/project-1',
      '--json',
    ]);

    expect(runVelaCommandMock).toHaveBeenCalledWith([
      'resource',
      'push',
      'project',
      'project-1',
      '/tmp/project-1',
      '--json',
    ]);
    expect(write).toHaveBeenCalledWith('{"version":3}\n');
  });

  it('shows Vela resource help when no subcommand is provided', async () => {
    runVelaCommandMock.mockResolvedValue('resource help\n');
    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await runResource([]);

    expect(runVelaCommandMock).toHaveBeenCalledWith(['resource', '--help']);
  });

  it('surfaces stub errors as a failed od command', async () => {
    runVelaCommandMock.mockRejectedValue(
      new Error('OpenDesign Cloud resource commands are not available in this build'),
    );
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    await runResource(['shared', '--json']);

    expect(error).toHaveBeenCalledWith(
      'OpenDesign Cloud resource commands are not available in this build',
    );
    expect(process.exitCode).toBe(1);
  });
});
