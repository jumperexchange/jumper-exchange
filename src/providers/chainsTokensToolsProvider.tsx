import { Chain, getChainById } from '@lifinance/sdk'
import { createContext, ReactChild, ReactChildren, useContext, useEffect, useState } from 'react'

import LiFi from '../LiFi'
import { TokenAmountList } from '../types'

export interface ChainsTokensToolsContextProps {
  chains: Chain[]
  tokens: TokenAmountList
  bridges: string[]
  exchanges: string[]
  chainsLoaded: boolean
  tokensLoaded: boolean
  toolsLoaded: boolean
}

const initialData = {
  chains: [],
  tokens: {},
  bridges: [],
  exchanges: [],
  chainsLoaded: false,
  tokensLoaded: false,
  toolsLoaded: false,
}

const chainsTokensToolsContext = createContext<ChainsTokensToolsContextProps>(initialData)

export const useChainsTokensTools = () => {
  return useContext(chainsTokensToolsContext)
}

interface AuxProps {
  children: ReactChild | ReactChild[] | ReactChildren | ReactChildren[]
}

export const ChainsTokensToolsProvider = ({ children }: AuxProps) => {
  const [data, setData] = useState<ChainsTokensToolsContextProps>(initialData)

  //get chains
  useEffect(() => {
    const load = async () => {
      const chains = await LiFi.getChains()

      if (!chains) {
        // eslint-disable-next-line
        console.warn('possibilities request did not contain required setup information')
        return
      }

      setData((data) => ({ ...data, chains, chainsLoaded: true }))
    }

    load()
  }, [])

  //get tokens
  useEffect(() => {
    const load = async () => {
      const tokens = (await LiFi.getTokens()).tokens
      if (!tokens) {
        // eslint-disable-next-line
        console.warn('token request did not contain required setup information')
        return
      }
      const newTokens: TokenAmountList = {}
      // let chain: keyof typeof tokens
      for (let chainId in tokens) {
        const chain = getChainById(Number(chainId))
        if (!newTokens[chain.key]) newTokens[chain.key] = []
        newTokens[chain.key] = tokens[chainId]
      }

      const oldTokens = data.tokens
      Object.keys(oldTokens).forEach((chainKey) => {
        oldTokens[chainKey].forEach((token) => {
          if (!newTokens[chainKey]) newTokens[chainKey] = []
          if (!newTokens[chainKey].find((item) => item.address === token.address)) {
            newTokens[chainKey].push(token)
          }
        })
      })

      setData((data) => ({ ...data, tokens: newTokens, tokensLoaded: true }))
    }
    load()
  }, [])

  //get tools
  useEffect(() => {
    const load = async () => {
      const tools = await LiFi.getTools()
      if (!tools.bridges || !tools.exchanges) {
        // eslint-disable-next-line
        console.warn('tools request did not contain required setup information')
        return
      }
      // bridges
      const bridges: string[] = tools.bridges
        .map((bridge: any) => bridge.key)
        .map((bridgeTool: string) => bridgeTool.split('-')[0])
      const allBridges = Array.from(new Set(bridges))

      setData((data) => ({ ...data, bridges: allBridges }))

      // exchanges
      const exchanges: string[] = tools.exchanges
        .map((exchange: any) => exchange.key)
        .map((exchangeTool: string) => exchangeTool.split('-')[0])
      const allExchanges = Array.from(new Set(exchanges))

      setData((data) => ({ ...data, exchanges: allExchanges, toolsLoaded: true }))
    }
    load()
  }, [])

  return (
    <chainsTokensToolsContext.Provider value={data}>{children}</chainsTokensToolsContext.Provider>
  )
}
