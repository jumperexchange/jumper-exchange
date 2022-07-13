import LIFI from '@lifi/sdk'

import { getRpcs } from './config/connectors'

const LiFi = new LIFI({
  apiUrl: process.env.REACT_APP_API_URL,
  rpcs: getRpcs(),
  defaultRouteOptions: {
    integrator: 'transferto.xyz',
  },
})

export default LiFi
