import { execFileSync } from 'node:child_process';

/**
 * Clears the OS clipboard so the seed phrase does not linger after a paste —
 * matters on a developer's own machine (CI runners are ephemeral).
 */
export function clearOsClipboard(): void {
  writeOsClipboard('');
}

/**
 * Writes text to the OS clipboard via a native tool, passing the value on stdin
 * (never argv, so it can't surface in a process list).
 *
 * On Linux, `xclip` daemonizes to serve the selection and holds the parent's
 * stdout/stderr open — capturing those pipes makes `execFileSync` block forever
 * — so they're detached, with a timeout that fails fast rather than freezing the
 * synchronous run.
 */
export function writeOsClipboard(text: string): void {
  if (process.platform === 'darwin') {
    execFileSync('pbcopy', { input: text });
    return;
  }
  execFileSync('xclip', ['-selection', 'clipboard'], {
    input: text,
    stdio: ['pipe', 'ignore', 'ignore'],
    timeout: 5_000,
  });
}
