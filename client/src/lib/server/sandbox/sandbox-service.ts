import 'server-only';
import { Sandbox } from '@vercel/sandbox';
import { SandboxOperationConfig, SandboxExecutionResult } from './types';
import { sanitizeOutput } from './sanitization';

/**
 * Executes a predefined operation inside an isolated Vercel Sandbox microVM.
 *
 * Guarantees:
 * 1. Strictly runs pre-configured steps from the allowlist.
 * 2. Guaranteed cleanup: sandbox.stop() is executed in a finally block.
 * 3. All outputs (stdout, stderr, errors) are sanitized to prevent secret leaks.
 * 4. Bounded execution with timeout.
 */
export async function executeSandboxOperation(
  config: SandboxOperationConfig
): Promise<SandboxExecutionResult> {
  const startTime = Date.now();
  let sandbox: Sandbox | null = null;
  const stdoutChunks: string[] = [];
  const stderrChunks: string[] = [];
  let combinedExitCode = 0;
  let stepsExecuted = 0;

  try {
    // 1. Create isolated microVM with bounded timeout
    sandbox = await Sandbox.create({
      timeout: config.timeoutMs,
    });

    // 2. Execute predefined command steps sequentially
    for (const step of config.steps) {
      stepsExecuted++;
      const finished = await sandbox.runCommand(step.cmd, step.args, {
        timeoutMs: config.timeoutMs,
      });

      const stepStdout = await finished.stdout();
      const stepStderr = await finished.stderr();

      if (stepStdout) stdoutChunks.push(stepStdout);
      if (stepStderr) stderrChunks.push(stepStderr);

      if (finished.exitCode !== 0) {
        combinedExitCode = finished.exitCode;
        break;
      }
    }

    const durationMs = Date.now() - startTime;
    return {
      operation: config.id,
      status: combinedExitCode === 0 ? 'passed' : 'failed',
      exitCode: combinedExitCode,
      stdout: sanitizeOutput(stdoutChunks.join('\n')),
      stderr: sanitizeOutput(stderrChunks.join('\n')),
      durationMs,
      timestamp: new Date().toISOString(),
      stepsExecuted,
    };
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const sanitizedErrorMsg = sanitizeOutput(errorMessage || 'Unknown sandbox execution error');
    return {
      operation: config.id,
      status: 'failed',
      exitCode: 1,
      stdout: sanitizeOutput(stdoutChunks.join('\n')),
      stderr: sanitizeOutput(
        [stderrChunks.join('\n'), `[SANDBOX_ERROR] ${sanitizedErrorMsg}`]
          .filter(Boolean)
          .join('\n')
      ),
      durationMs,
      timestamp: new Date().toISOString(),
      stepsExecuted,
    };
  } finally {
    // 3. Ensure sandbox resources are stopped and cleaned up
    if (sandbox) {
      try {
        await sandbox.stop();
      } catch (stopErr: unknown) {
        const stopMessage = stopErr instanceof Error ? stopErr.message : String(stopErr);
        console.error('[Sandbox Cleanup Warning]:', sanitizeOutput(stopMessage));
      }
    }
  }
}
