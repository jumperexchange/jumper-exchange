import { testWithSynpress, metaMaskFixtures } from '@synthetixio/synpress';

import connectedSetup from '../wallet-setup/connected.setup';

export default testWithSynpress(metaMaskFixtures(connectedSetup));
