import LIFI from '@lifi/sdk'

import { getRpcs } from './config/connectors'

const LiFi = new LIFI({
  apiUrl: import.meta.env.VITE_API_URL,
  rpcs: getRpcs(),
  defaultRouteOptions: {
    integrator: 'transferto.xyz',
  },
})

export default LiFi
