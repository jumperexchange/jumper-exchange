import { ChainId } from '@lifi/sdk'

type BlockedTokens = {
  [ChainKey: string]: Array<string>
}

export const blockedTokens: BlockedTokens = {
  [ChainId.ETH]: [
    '0x82dfdb2ec1aa6003ed4acba663403d7c2127ff67', // akSwap.io - scam
  ],
  [ChainId.BSC]: [
    '0x119e2ad8f0c85c6f61afdf0df69693028cdc10be', // Zepe.io - scam
    '0xb0557906c617f0048a700758606f64b33d0c41a6', // Zepe.io - scam
    '0xbc6675de91e3da8eac51293ecb87c359019621cf', // BestAir.io - scam
    '0xb926beb62d7a680406e06327c87307c1ffc4ab09', // AlpacaDrop.Org - ??
    '0xb16600c510b0f323dee2cb212924d90e58864421', // GoFlux.io - ??
    '0x8ee3e98dcced9f5d3df5287272f0b2d301d97c57', // AirStack.net - scam
    '0x5558447b06867ffebd87dd63426d61c868c45904', // https://bnbw.me/ - scam
    '0x373233a38ae21cf0c4f9de11570e7d5aa6824a1e', // ALPACAFIN.COM - scam
    '0x0198be93b7cae38da7e2fd966946412cc36447bf', // BSCmello.io - scam
    '0xa43d8b1f070b8e2fd2de4e01369369d5fd7d4784', // melloBsc.com - scam
    '0xd5e3bf9045cfb1e6ded4b35d1b9c34be16d6eec3', // LinkP.io - scam
    '0x442b656f5a5c3dd09790951810c5a15ea5295b51', // Tu7.org - scam
    '0x27b880865395da6cda9c407e5edfcc32184cf429', // Dex88.org
    '0x893c25c46bfaa9b66cd557837d32af3fe264a07b', // PowNFT.net
    '0x556798dd55db12562a6950ea8339a273539b0495', // Def8.io
    '0x0d05a204e27e4815f1f5afdb9d82aa221aa0bdfa', // GemSwap.net
    '0xd22202d23fe7de9e3dbe11a2a88f42f4cb9507cf', // Minereum BSC
  ],
  [ChainId.POL]: [
    '0xe4fb1bb8423417a460286b0ed44b64e104c5fae5', // Zepe.io - scam
    '0x8ae127d224094cb1b27e1b28a472e588cbcc7620', // https://aaxexchange.org/ - scam
    '0x6142f62e7996faec5c5bb9d10669d60299d69dfe', // buy SpaceRat.Finance - spam
    '0x19a935cbaaa4099072479d521962588d7857d717', // Litcoin - fake
    '0x0364c8dbde082372e8d6a6137b45613dd0f8138a', // https://polybest.org/ - scam
    '0x81067076dcb7d3168ccf7036117b9d72051205e2', // DxDex.io - scam
    '0x2fd23d735860bc64090d9807ff6c0d1a3d721f08', // softbalanced.com
    '0x80a3f315542f7ff2149fd75a74a964c13de6c7fe', // BUY THRUST - https://t.me/thrust_zone'
    '0xa39b14f57087aa5f16b941e5ec182b84a5432aa7', // BeezEX.Net
    '0xcbf4ab00b6aa19b4d5d29c7c3508b393a1c01fe3', // MegaDoge.Org
    '0x02677c45fa858b9ffec24fc791bf72cdf4a8a8df', // RicheSwap.io - steal keys
    '0x1cc384b6f900a947eb3bbfc47417afeee7599e24', // yui.finance - offline
    '0x8a0b040f27407d7a603bca701b857f8f81a1c7af', // Buy Polydoge - fake
    '0x9e2d266d6c90f6c0d80a88159b15958f7135b8af', // https://stakeshare.org/polygon - scam
    '0xa9316e1909edf3ed33b0dd1c6631c50b82c6e142', // A NFTSprites.com - ??
    '0xdad0d08d5b0544fc853682c6ca07eaab201bd550', // auto-stake.com - offline
    '0x22e51bae3f545255e115090202a23c7ede0b00b9', // LELX.io
    '0xe06bd4f5aac8d0aa337d13ec88db6defc6eaeefe', // PlanetIX
    '0x2744861accb5bd435017c1cfee789b6ebab42082', // AeFX.io
    '0xa85f8a198d59f0fda82333be9aeeb50f24dd59ff', // FlowDAO.io
    '0xd7f1d4f5a1b44d827a7c3cc5dd46a80fade55558', // Zers.io
    '0xdc8fa3fab8421ff44cc6ca7f966673ff6c0b3b58', // Draf.io
  ],
  [ChainId.DAI]: [
    '0x0f1b956128ac17407c29c5600983c6cedf3b2820', // softbalanced.com
  ],
}
