import { NxtpSdkEvent } from '@connext/nxtp-sdk'
import {
  InvariantTransactionData,
  TransactionPreparedEvent,
  VariantTransactionData,
} from '@connext/nxtp-utils'

export type CrosschainTransaction = {
  invariant: InvariantTransactionData
  sending?: VariantTransactionData
  receiving?: VariantTransactionData
}

export interface ActiveTransaction {
  txData: CrosschainTransaction
  status: NxtpSdkEvent
  event: TransactionPreparedEvent
}
