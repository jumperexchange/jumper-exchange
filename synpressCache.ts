import { spawn } from 'child_process';

async function buildSynpressCache() {
  console.log('Building Synpress cache...');

  return new Promise<void>((resolve, reject) => {
    const process = spawn('yarn', ['build:cache', '--force', 'tests/wallet-setup/'], { stdio: ['inherit', 'pipe', 'inherit'] });

    process.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(output);

      // Proceed when the expected message is found
      if (output.includes('All wallet setup functions are now cached!')) {
        console.log('Detected successful cache completion.');
        resolve();
      }
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('Synpress cache process completed.');
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
