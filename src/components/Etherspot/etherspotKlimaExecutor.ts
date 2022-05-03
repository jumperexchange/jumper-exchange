import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { BigNumberish, ethers } from 'ethers'
import { GatewayBatchStates, Sdk } from 'etherspot'
import { useState } from 'react'

import {
  erc20Abi,
  KLIMA_ADDRESS,
  sKLIMA_ADDRESS,
  STAKE_KLIMA_CONTRACT_ADDRESS,
  stakeKlimaAbi,
} from '../../constants'
import LiFi from '../../LiFi'
import { switchChain } from '../../services/metamask'
import { ChainId, Execution, ExtendedRoute, getChainById, Process } from '../../types'
import { getRpcProvider } from '../web3/connectors'

const getSetAllowanceTransaction = async (
  tokenAddress: string,
  approvalAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.approve(approvalAddress, amount)
}

const getStakeKlimaTransaction = (amount: BigNumberish) => {
  const contract = new ethers.Contract(STAKE_KLIMA_CONTRACT_ADDRESS, stakeKlimaAbi)
  return contract.populateTransaction.stake(amount)
}
const getTransferTransaction = async (
  tokenAddress: string,
  toAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.transfer(toAddress, amount)
}

export const useEtherspotKlimaExecutor = (etherspot: Sdk, route: ExtendedRoute) => {
  const web3 = useWeb3React<Web3Provider>()
  const [etherspotStepExecution, setEtherspotStepExecution] = useState<Execution>()

  const resetEtherspotExecution = () => {
    setEtherspotStepExecution(undefined)
  }

  const handlePotentialEtherSpotError = (e: any) => {
    if (route.lifiRoute.steps.some((step) => step.execution?.status === 'FAILED')) {
      return
    }

    if (!etherspotStepExecution) {
      setEtherspotStepExecution({
        status: 'FAILED',
        process: [
          {
            errorMessage: e.errorMessage,
            status: 'FAILED',
            message: 'Prepare Transaction',
            startedAt: Date.now(),
            doneAt: Date.now(),
          },
        ],
      })
    } else {
      const processList = etherspotStepExecution.process
      processList[processList.length - 1].status = 'FAILED'
      processList[processList.length - 1].errorMessage = e.errorMessage
      processList[processList.length - 1].doneAt = Date.now()
      setEtherspotStepExecution({
        status: 'FAILED',
        process: processList,
      })
    }
  }

  const finalizeEtherSpotExecution = (stepExecution: Execution, toAmount: string) => {
    const doneList = stepExecution.process.map((p) => {
      p.status = 'DONE'
      return p
    })

    setEtherspotStepExecution({
      status: 'DONE',
      process: doneList,
      toAmount: toAmount,
    })
  }

  const prepareEtherSpotStep = async () => {
    if (!etherspot) {
      throw new Error('Etherspot not initialized.')
    }
    const tokenPolygonKLIMAPromise = LiFi.getToken(ChainId.POL, KLIMA_ADDRESS)!
    const tokenPolygonSKLIMAPromise = LiFi.getToken(ChainId.POL, sKLIMA_ADDRESS)!

    const gasStepRefreshPromise = LiFi.getQuote({
      fromChain: route.gasStep.action.fromChainId,
      fromToken: route.gasStep.action.fromToken.address,
      fromAddress: etherspot.state.accountAddress!,
      fromAmount: route.gasStep.action.fromAmount, // TODO: check if correct value
      toChain: route.gasStep.action.fromChainId,
      toToken: route.gasStep.action.toToken.address, // hardcode return gastoken
      slippage: route.gasStep.action.slippage,
      integrator: 'lifi-etherspot',
      allowExchanges: [route.gasStep.tool],
    })
    const klimaStepRefreshPromise = LiFi.getQuote({
      fromChain: route.klimaStep.action.fromChainId,
      fromToken: route.klimaStep.action.fromToken.address,
      fromAddress: etherspot.state.accountAddress!,
      fromAmount: route.klimaStep.action.fromAmount, // TODO: check if correct value
      toChain: route.klimaStep.action.fromChainId,
      toToken: route.klimaStep.action.toToken.address, // hardcode return gastoken
      slippage: route.gasStep.action.slippage,
      integrator: 'lifi-etherspot',
      allowExchanges: [route.klimaStep.tool],
    })

    const resolvedPromises = await Promise.all([
      tokenPolygonKLIMAPromise,
      tokenPolygonSKLIMAPromise,
      gasStepRefreshPromise,
      klimaStepRefreshPromise,
    ])
    const tokenPolygonKLIMA = resolvedPromises[0]
    const tokenPolygonSKLIMA = resolvedPromises[1]
    route.gasStep = resolvedPromises[2]
    route.klimaStep = resolvedPromises[3]

    if (!route.gasStep.transactionRequest || !route.klimaStep.transactionRequest) {
      throw new Error('Swap transaction missing')
    }

    // reset gateway batch
    etherspot.clearGatewayBatch()

    const totalAmount = ethers.BigNumber.from(route.gasStep.estimate.fromAmount).add(
      route.klimaStep.estimate.fromAmount,
    )
    const txAllowTotal = await getSetAllowanceTransaction(
      route.gasStep.action.fromToken.address,
      route.gasStep.estimate.approvalAddress as string,
      totalAmount,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txAllowTotal.to as string,
      data: txAllowTotal.data as string,
    })

    // Swap
    await etherspot.batchExecuteAccountTransaction({
      to: route.gasStep.transactionRequest.to as string,
      data: route.gasStep.transactionRequest.data as string,
    })

    await etherspot.batchExecuteAccountTransaction({
      to: route.klimaStep.transactionRequest.to as string,
      data: route.klimaStep.transactionRequest.data as string,
    })
    const amountKlima = route.klimaStep.estimate.toAmountMin
    // approve KLIMA: e.g. https://polygonscan.com/tx/0xb1aca780869956f7a79d9915ff58fd47acbaf9b34f0eb13f9b18d1772f1abef2
    const txAllow = await getSetAllowanceTransaction(
      tokenPolygonKLIMA!.address,
      STAKE_KLIMA_CONTRACT_ADDRESS,
      amountKlima,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txAllow.to as string,
      data: txAllow.data as string,
    })

    // stake KLIMA: e.g. https://polygonscan.com/tx/0x5c392aa3487a1fa9e617c5697fe050d9d85930a44508ce74c90caf1bd36264bf
    const txStake = await getStakeKlimaTransaction(amountKlima)
    await etherspot.batchExecuteAccountTransaction({
      to: txStake.to as string,
      data: txStake.data as string,
    })
    const txTransfer = await getTransferTransaction(
      tokenPolygonSKLIMA!.address,
      web3.account!,
      amountKlima,
    )
    await etherspot.batchExecuteAccountTransaction({
      to: txTransfer.to as string,
      data: txTransfer.data as string,
    })
  }
  const executeEtherspotStep = async () => {
    const processList: Process[] = []

    // FIXME: My be needed if user is bridging from chain which is not supported by etherspot
    if (!etherspot) {
      processList.push({
        id: 'chainSwitch',
        message: 'Switch Chain',
        startedAt: Date.now(),
        status: 'ACTION_REQUIRED',
      })
      setEtherspotStepExecution({
        status: 'ACTION_REQUIRED',
        process: processList,
      })

      await switchChain(ChainId.POL)
      const signer = web3.library!.getSigner()
      if ((await signer.getChainId()) !== ChainId.POL) {
        throw Error('Chain was not switched!')
      }

      processList.map((process) => {
        if (process.id === 'chainSwitch') {
          process.status = 'DONE'
          process.doneAt = Date.now()
        }
        return process
      })
    }
    if (!etherspot) {
      throw new Error('Etherspot not initialized.')
    }

    processList.push({
      id: 'prepare',
      message: 'Initialize Etherspot',
      startedAt: Date.now(),
      status: 'PENDING',
    })

    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })
    await prepareEtherSpotStep()

    await etherspot.estimateGatewayBatch()

    processList.map((process) => {
      if (process.id === 'prepare') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })
    processList.push({
      id: 'sign',
      message: 'Provide Signature',
      startedAt: Date.now(),
      status: 'ACTION_REQUIRED',
    })
    setEtherspotStepExecution({
      status: 'ACTION_REQUIRED',
      process: processList,
    })
    let batch = await etherspot.submitGatewayBatch()
    processList.map((process) => {
      if (process.id === 'sign') {
        process.status = 'DONE'
        process.doneAt = Date.now()
      }
      return process
    })
    processList.push({
      id: 'wait',
      message: 'Wait For Execution',
      startedAt: Date.now(),
      status: 'PENDING',
    })
    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })

    // info: batch.state seams to wait for a lot of confirmations (6 minutes) before changing to 'Sent'
    let hasTransaction = !!(batch.transaction && batch.transaction.hash)
    while (!hasTransaction) {
      try {
        batch = await etherspot.getGatewaySubmittedBatch({
          hash: batch.hash,
        })
      } catch (e) {
        // ignore failed requests and try again
        // eslint-disable-next-line no-console
        console.error(e)
      }

      if (batch.state === GatewayBatchStates.Reverted) {
        // eslint-disable-next-line no-console
        console.error(batch)
        throw new Error('Execution Reverted')
      }

      hasTransaction = !!(batch.transaction && batch.transaction.hash)
      if (!hasTransaction) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000)
        })
      }
    }

    // Add Transaction
    const chain = getChainById(ChainId.POL)
    processList.map((process) => {
      if (process.id === 'wait') {
        process.txHash = batch.transaction.hash
        process.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + batch.transaction.hash
      }
      return process
    })
    setEtherspotStepExecution({
      status: 'PENDING',
      process: processList,
    })

    // Wait for Transaction
    const provider = await getRpcProvider(ChainId.POL)
    let receipt
    while (!receipt) {
      try {
        const tx = await provider.getTransaction(batch.transaction.hash!)
        if (tx) {
          receipt = await tx.wait()
        }
      } catch (e) {
        // ignore failed requests and try again
        // eslint-disable-next-line no-console
        console.error(e)
      }

      if (!receipt) {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000)
        })
      }
    }

    processList.map((process) => {
      if (process.id === 'wait') {
        process.status = 'DONE'
        process.message = 'Staking successful'
        process.txHash = batch.transaction.hash
        process.txLink = chain.metamask.blockExplorerUrls[0] + 'tx/' + batch.transaction.hash
        process.doneAt = Date.now()
      }
      return process
    })
    const stepExecution: Execution = {
      status: 'DONE',
      process: processList,
    }
    setEtherspotStepExecution(stepExecution)
    return stepExecution
  }
  return {
    etherspotStepExecution,
    executeEtherspotStep,
    resetEtherspotExecution,
    handlePotentialEtherSpotError,
    finalizeEtherSpotExecution,
  }
}
