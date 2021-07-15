import { Token } from '../types'
import { getChainById } from '../types/lists'

export const switchChain = async (chainId: number) => {
  const ethereum = (window as any).ethereum
  if (typeof ethereum === 'undefined') return false

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: getChainById(chainId).metamask?.chainId }],
    })
    return true
  } catch (error) {
    console.error(error)
    if (error.code === 4902) {
      return await addChain(chainId)
    }
  }
  return false
}

export const addChain = async (chainId: number) => {
  const ethereum = (window as any).ethereum
  if (typeof ethereum === 'undefined') return false

  const params = getChainById(chainId).metamask
  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    })
    return true
  } catch (error) {
    console.error(`Error adding chain ${chainId}: ${error.message}`)
  }
  return false
}

export const addToken = async (token: Token) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await (window as any).ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: token.id, // The address that the token is at.
          symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: token.decimals, // The number of decimals in the token
          image: token.logoURI, // A string url of the token logo
        },
      },
    })
    return wasAdded
  } catch (error) {
    console.log(error)
  }
  return false
}
