import axios from 'axios'
import {CoinKey } from '../types';

const CoinGeckoIds = {
  [CoinKey.ETH]: "ethereum",
  [CoinKey.BNB]: "binancecoin",
  [CoinKey.MATIC]: "matic-network",
  [CoinKey.DAI]: "dai",
  [CoinKey.USDT]: 'tether',
  [CoinKey.USDC]: 'usd-coin',
  [CoinKey.UNI]: 'uniswap',
  [CoinKey.LINK]: 'chainlink',
  [CoinKey.AAVE]: 'aave',
}

async function getPricesForTokens(coinKeys: Array<CoinKey>){

  //build string for Url
  var idString: string = ""
  for (const coin of coinKeys){
    idString += `${CoinGeckoIds[coin]},`
  }

  // get data from coingecko
  const coingeckoURL = `https://api.coingecko.com/api/v3/simple/price?ids=${idString}&vs_currencies=usd%2Ceur}`
  var result;
  try{
    result = await axios.get(coingeckoURL);
  } catch (e){
    console.warn("Coingecko api call failed with status " + e)
    console.warn(e)
    return null
  }

  // response body is empty?
  if (Object.keys(result.data).length === 0){
    return null;
  }

  // build return object
  var prices: {[k: string]: object} = {}
  for (const coin of coinKeys){
    prices[coin] = result.data[CoinGeckoIds[coin]] 
  }
  console.log(prices);

  // return prices
  return prices

  

}

export {getPricesForTokens}
