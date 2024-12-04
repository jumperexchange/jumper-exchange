import { spawn, execSync } from 'child_process';
import { rmSync } from 'fs';

async function buildSynpressCache() {
  console.log('Cleaning up .cache-synpress directory...');
  try {
    rmSync('.cache-synpress', { recursive: true, force: true });
    console.log('.cache-synpress directory cleaned.');
  } catch (error) {
    console.warn('Failed to clean .cache-synpress directory:', error);
  }

  console.log('Building Synpress cache...');
  return new Promise<void>((resolve, reject) => {
    const process = spawn('yarn', ['build:cache', '--force', 'tests/wallet-setup/'], { stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('Synpress cache build complete.');
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
