import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

import { JsonRpcSigner } from '@ethersproject/providers'
import { Execution } from '../types/'
import hop from './hop'
import { CoinKey } from '../types'
import notifications, { NotificationType } from './notifications'
import {getHopDestinationReceipt} from './serviceworker/sw.hop'

export const executeHopCross = async (signer: JsonRpcSigner, bridgeCoin: CoinKey, amount: string, fromChainId: number, toChainId: number, updateStatus?: Function, initialStatus?: Execution) => {
  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)
  hop.init(signer, fromChainId, toChainId)

  //set allowance AND send
  const allowanceAndCrossProcess = createAndPushProcess('allowanceAndCrossProcess', update, status, 'Set Allowance and Cross')
  let tx
  try {

    if(allowanceAndCrossProcess.txHash){
      tx = signer.provider.getTransaction(allowanceAndCrossProcess.txHash)
    } else {
      tx = await hop.setAllowanceAndCrossChains(bridgeCoin, amount, fromChainId, toChainId )
      allowanceAndCrossProcess.txHash = tx.hash
      update(status)
    }

  } catch (e: any) {
    if (e.message) allowanceAndCrossProcess.errorMessage = e.message
    if (e.code) allowanceAndCrossProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceAndCrossProcess)
    throw e
  }
  setStatusDone(update, status, allowanceAndCrossProcess)


  //wait for transaction
  const waitForTxProcess = createAndPushProcess('waitForTxProcess', update, status, 'Wait for transaction on receiving chain')
  waitForTxProcess.txHash = tx.hash
  update(status)
  let destinationTxReceipt;
  try{
    destinationTxReceipt = getHopDestinationReceipt()
    if(!destinationTxReceipt){
      destinationTxReceipt = await hop.waitForDestinationChainReceipt(tx.hash, bridgeCoin, fromChainId, toChainId)

    }
    waitForTxProcess.destinationReceipt = destinationTxReceipt.transactionHash
    update(status)
  } catch (_e){
    const e = _e as Error
    if (e.message) waitForTxProcess.errorMessage = "Transaction failed on receiving chain: \n" + e.message
    notifications.showNotification(NotificationType.CROSS_ERROR)
    setStatusFailed(update, status, waitForTxProcess)
    throw e
  }

  const parsedReceipt = hop.parseReceipt(tx, destinationTxReceipt)


  setStatusDone(update, status, waitForTxProcess, {
    fromAmount: parsedReceipt.fromAmount,
    toAmount: parsedReceipt.toAmount,
    gasUsed: (status.gasUsed || 0) + parsedReceipt.gasUsed,
  })

  // -> set status
  status.status = 'DONE'
  notifications.showNotification(NotificationType.CROSS_SUCCESSFUL)
  update(status)

  // DONE
  return status




}

