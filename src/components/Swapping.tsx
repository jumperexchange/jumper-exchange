import { BrowserNode } from '@connext/vector-browser-node';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Button } from 'antd';
import React, { useState } from 'react';
import * as connext from '../services/connext';
import { ChainKey } from '../types';
import { supportedChains } from '../types/lists';
import { CrossAction, DepositEstimate, SwapAction, TranferStep } from '../types/server';
import ConnectButton from './web3/ConnectButton';

interface SwappingProps {
  route: Array<TranferStep>,
}

const Swapping = ({ route } : SwappingProps) => {
  // Connext
  const [node, setNode] = useState<BrowserNode>()
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const initializeConnext = async () => {
    setLoggingIn(true)
    try {
      const _node = await connext.initNode()
      setNode(_node)
    } catch (e) {
      console.log('Initiation error', { e })
    } finally {
      setLoggingIn(false)
    }
  }

  // Wallet
  const web3 = useWeb3React<Web3Provider>()
  // const context = getWeb3ReactContext();

  // Swap
  const chainKeyToChainId = (chainKey: ChainKey) : number => {
    const chain = supportedChains.find(chain => chain.key === chainKey)
    return chain ? chain.id : 0
  }
  const swap = async () => {
    if (!node || !web3.library) {
      return
    }

    console.log(
      ((route[0].estimate as DepositEstimate)?.fromAmount * (10**6)).toString(),
      (route[1].action as SwapAction).fromToken.id,
      (route[1].action as SwapAction).toToken.id,
      (route[3].action as SwapAction).fromToken.id,
      (route[3].action as SwapAction).toToken.id,
      chainKeyToChainId((route[2].action as CrossAction).chainKey),
      chainKeyToChainId((route[2].action as CrossAction).toChainKey),
      node,
      web3.library.getSigner(),
    )

    connext.swap(
      ((route[0].estimate as DepositEstimate)?.fromAmount * (10**6)).toString(),
      (route[1].action as SwapAction).fromToken.id,
      (route[1].action as SwapAction).toToken.id,
      (route[3].action as SwapAction).fromToken.id,
      (route[3].action as SwapAction).toToken.id,
      chainKeyToChainId((route[2].action as CrossAction).chainKey),
      chainKeyToChainId((route[2].action as CrossAction).toChainKey),
      node,
      web3.library.getSigner(),
    )
  }

  // DEBUG
  const getBalances = async () => {
    if (!node) {
      return
    }
    for (const chainId of [56, 100, 137]) {
      const balances = await connext.getChannelBalances(node, chainId);
      console.log(balances)
    }
  }

  (window as any).reconcileDeposit = (chainId: any, tokenId: any) => {
    if (!node) {
      return
    }
    connext.reconcileDeposit(node, chainId, tokenId)
  }
  // END: DEBUG

  return (<>
    <p>
      Connext:
      { !node && !loggingIn && <Button onClick={() => initializeConnext()}>Login to Connext</Button> }
      { !node && loggingIn && 'loading...'}
      { node && 'connected' }
    </p>

    <p>
      Wallet:
      { !web3.account ? <ConnectButton /> : <>Connected with {web3.account.substr(0, 4)}...</> }
    </p>


    <p>
      Start: <Button onClick={() => swap()}>Swap</Button>
    </p>
    <p>
    <Button onClick={() => getBalances()}>getBalances</Button>
    </p>
  </>)
}

export default Swapping

