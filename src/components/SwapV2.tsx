import './SwapV2.css'

import { LiFiWidget, WidgetConfig } from '@lifi/widget'

import { useMetatags } from '../hooks/useMetatags'
import { useStomt } from '../services/stomt'

const widgetConfig: WidgetConfig = {
  // disableInternalWalletManagement: true,
  // walletCallbacks: {

  // },
  containerStyle: {
    width: 392,
    height: 640,
    border: `1px solid ${
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'rgb(66, 66, 66)'
        : 'rgb(234, 234, 234)'
    }`,
    borderRadius: '16px',
    display: 'flex',
    maxWidth: 392,
  },
}

export const SwapV2 = () => {
  useMetatags({
    title: 'LI.FI - Swap',
  })
  useStomt('swap')
  return <LiFiWidget config={widgetConfig} />
}
