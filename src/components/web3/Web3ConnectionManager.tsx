import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'

import { network } from './connectors'
import { useEagerConnect, useInactiveListener } from './hooks'

function Web3ConnectionManager({ children }: { children: JSX.Element }) {
  const web3 = useWeb3React<Web3Provider>()
  const { connector, activate, active } = web3

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  useEffect(() => {
    if (triedEager && !active) {
      activate(network)
    }
  }, [triedEager, active, connector, activate])

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager)

  return children
}

export default Web3ConnectionManager
