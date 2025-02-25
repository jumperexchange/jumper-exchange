import { testWithSynpress, metaMaskFixtures } from '@synthetixio/synpress';

import connectedSetup from './basic.setup';

export default testWithSynpress(metaMaskFixtures(connectedSetup));
