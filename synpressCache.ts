
import { execSync } from 'child_process';

async function buildSynpressCache() {
  console.log('Building Synpress cache...');
  try {
    execSync('yarn build:cache --force tests/wallet-setup/', { stdio: 'inherit' });
    console.log('Synpress cache build complete.');
  } catch (error) {
    console.error('Failed to build Synpress cache:', error);
    process.exit(1); // Exit with failure if the cache build fails
  }
}

export default buildSynpressCache;
