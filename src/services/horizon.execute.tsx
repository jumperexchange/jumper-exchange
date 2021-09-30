import BigNumber from 'bignumber.js'
import { EXCHANGE_MODE, NETWORK_TYPE, STATUS, TOKEN } from 'bridge-sdk'
import { ChainId, CoinKey, Execution, getChainById, Process, Token } from '../types'
import horizon from './horizon'
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'


export const executeHorizonCross = async (fromToken: Token, fromAmount: BigNumber, fromChainId: number, toChainId: number, destAddress: string, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)
  const fromChain = getChainById(fromChainId)
  const toChain = getChainById(toChainId)


  const allowanceAndCrossProcess = createAndPushProcess(update, status, 'Set Allowance and Cross', { status: 'ACTION_REQUIRED' })
  let waitForBlocksProcess: Process
  let mintProcess: Process

  try {
    const bridgeSDK = await horizon.setupTestnet()
    const tokenMapping: { [k: string]: any } = {
      [CoinKey.ETH]: {
        token: TOKEN.ETH,
      },
      [CoinKey.BNB]: {
        token: TOKEN.ETH,
        // for other direction
        // token: TOKEN.HRC20,
        // hrc20Address: '0xbef55684b382bae72051813a898d17282066c007',
      },
      [CoinKey.ONE]: {
        token: TOKEN.ONE,
      },
      [CoinKey.USDC]: {
        token: TOKEN.ERC20,
        erc20Address: '',
      },
    }

    // params
    const type = (toChainId === ChainId.ONE || toChainId === ChainId.ONET) ? EXCHANGE_MODE.ETH_TO_ONE : EXCHANGE_MODE.ONE_TO_ETH
    const network = (fromChainId === ChainId.BSC || fromChainId === ChainId.BSCT || toChainId === ChainId.BSC || toChainId === ChainId.BSCT) ? NETWORK_TYPE.BINANCE : NETWORK_TYPE.ETHEREUM
    const token = tokenMapping[fromToken.key].token
    const amount = fromAmount.shiftedBy(-fromToken.decimals).toNumber()
    const erc20Address = tokenMapping[fromToken.key].erc20Address
    const hrc20Address = tokenMapping[fromToken.key].hrc20Address

    const params = {
      type,
      network,
      amount,
      token,
      erc20Address,
      oneAddress: destAddress,
      ethAddress: destAddress,
      hrc20Address: hrc20Address,
      // maxWaitingTime?: number;
    }
    console.log(params)

    let operationId: string
    const bridgePromise = bridgeSDK.sendToken(
      params,
      id => (operationId = id)
    );

    let intervalId = setInterval(async () => {
      if (operationId) {
        const operation = await bridgeSDK.api.getOperation(operationId)
        console.log(operation)

        // Send > Wait
        if (operation.actions[0].status === 'in_progress' && allowanceAndCrossProcess.status === 'ACTION_REQUIRED') {
          allowanceAndCrossProcess.status = 'PENDING'
          allowanceAndCrossProcess.txHash = operation.actions[0].transactionHash
          allowanceAndCrossProcess.txLink = fromChain.metamask.blockExplorerUrls[0] + 'tx/' + allowanceAndCrossProcess.txHash
          allowanceAndCrossProcess.message = <>Send Transaction - Wait for <a href={allowanceAndCrossProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
          update(status)
        }

        // Wait > Done; Wait for confirmations
        if (operation.actions[0].status === 'success' && allowanceAndCrossProcess.status === 'PENDING') {
          allowanceAndCrossProcess.message = <>Transaction Sent: <a href={allowanceAndCrossProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
          setStatusDone(update, status, allowanceAndCrossProcess)
          waitForBlocksProcess = createAndPushProcess(update, status, 'Wait for Block Confirmations', { status: 'PENDING' })
        }

        // Confirmed > Done; Wait for mint
        if (operation.actions[1].status === 'success' && waitForBlocksProcess.status === 'PENDING') {
          waitForBlocksProcess.message = 'Enough Block Confirmations'
          setStatusDone(update, status, waitForBlocksProcess)
          mintProcess = createAndPushProcess(update, status, 'Minting tokens', { status: 'PENDING' })
        }

        // Minted > Done; ??
        if (operation.actions[2].status === 'success' && mintProcess.status === 'PENDING') {
          mintProcess.txHash = operation.actions[2].transactionHash
          mintProcess.txLink = toChain.metamask.blockExplorerUrls[0] + 'tx/' + mintProcess.txHash
          mintProcess.message = <>Minted in <a href={mintProcess.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
          setStatusDone(update, status, mintProcess)
        }

        if (operation.status !== STATUS.IN_PROGRESS) {
          clearInterval(intervalId);
        }
      }
    }, 4000)

    await bridgePromise

    // Fallback
    if (allowanceAndCrossProcess && allowanceAndCrossProcess.status !== 'DONE') setStatusDone(update, status, allowanceAndCrossProcess)
    if (waitForBlocksProcess! && waitForBlocksProcess.status !== 'DONE') setStatusDone(update, status, waitForBlocksProcess)
    if (mintProcess! && mintProcess.status !== 'DONE') setStatusDone(update, status, mintProcess)

  } catch (e: any) {
    console.error(e)
    if (allowanceAndCrossProcess && allowanceAndCrossProcess.status !== 'DONE') setStatusFailed(update, status, allowanceAndCrossProcess)
    if (waitForBlocksProcess! && waitForBlocksProcess.status !== 'DONE') setStatusFailed(update, status, waitForBlocksProcess)
    if (mintProcess! && mintProcess.status !== 'DONE') setStatusFailed(update, status, mintProcess)
    throw e
  }

  // DONE
  status.status = 'DONE'
  update(status)
  return status
}
