import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function buildSynpressCache() {
  console.log('Building Synpress cache...');
  try {
    await execPromise('yarn build:cache --force tests/wallet-setup/');
    console.log('Synpress cache build complete.');
  } catch (error) {
    console.error('Failed to build Synpress cache:', error);
    process.exit(1); // Fail the test suite if the cache build fails
  }
}

export default buildSynpressCache;
