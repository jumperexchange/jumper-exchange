import { spawn } from 'child_process';

async function buildSynpressCache() {
  // console.log('Building Synpress cache...');

  return new Promise<void>((resolve, reject) => {
    const process = spawn(
      'yarn',
      ['build:cache', '--force', 'tests/wallet-setup/'],
      { stdio: 'inherit' },
    );

    process.on('close', (code) => {
      if (code === 0) {
        // console.log('Synpress cache build complete.');
        resolve();
      } else {
        console.error(`Failed to build Synpress cache with exit code ${code}`);
        reject(new Error(`Cache build failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      console.error('Error during cache build:', error);
      reject(error);
    });
  });
}
export default buildSynpressCache;
