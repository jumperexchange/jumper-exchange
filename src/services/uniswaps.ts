import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'

const abi = [
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
];


const swappedTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "address",
    "name": "initiator",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "srcAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "receivedAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "expectedAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "string",
    "name": "referrer",
    "type": "string"
  }),
]
interface Swapped {
  initiator: string
  srcAmount: BigNumber
  receivedAmount: BigNumber
  expectedAmount: BigNumber
  referrer: string
}

export const getAllowance = async (contract: ethers.Contract, userAddress: string, tokenAddress: string) => {
  const tx  = await contract.allowance(userAddress, tokenAddress)
  return parseInt(tx)

}

export const setAllowance = async (signer: JsonRpcSigner, uniSwapRouter: string, userAddress: string, tokenAddress: string, amount: number) => {
  const contract = new ethers.Contract(tokenAddress, abi, signer);
  const tx = await contract.approve(uniSwapRouter, amount, {gasLimit: 100000, gasPrice: 5e9});
  console.log(JSON.stringify(tx));
  try {
    await tx.wait()
  } catch (e) {
    throw e
  }
  const allowance = await getAllowance(contract, userAddress, tokenAddress)
  console.log(allowance)
  return allowance
}


export const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
  console.log(tx)
  console.log(receipt)
  const result = {
    fromAmount: 0,
    toAmount: 0,
    gasUsed: 0,
    gasPrice: 0,
    gasFee: 0,
  }
  const decoder = new ethers.utils.AbiCoder()

  // gas
  result.gasUsed = receipt.gasUsed.toNumber()
  result.gasPrice = tx.gasPrice?.toNumber() || 0
  result.gasFee = result.gasUsed * result.gasPrice

  // log
  const logs = receipt.logs.filter((log) => log.address === receipt.to)
  const log = logs[logs.length - 1]
  if (log) {
    const parsed = decoder.decode(swappedTypes, log.data) as unknown as Swapped
    result.fromAmount = parsed.srcAmount.toNumber()
    result.toAmount = parsed.receivedAmount.toNumber()
  }

  return result
}
