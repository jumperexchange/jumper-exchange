import { CaretDownOutlined } from '@ant-design/icons'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import WalletButtons from '../components/web3/WalletButtons'
import {
  REACT_APP_ENABLE_OFFSET_CARBON_SHOWCASE,
  REACT_APP_ENABLE_SWAP_V2,
} from '../constants/featureFlags'
import { useIsMobile } from './useIsMobile'

export const useNavConfig = () => {
  const isMobile = useIsMobile()

  const navConfig = useMemo(() => {
    return [
      { label: <Link to="/swap">Swap & Bridge</Link>, key: '/swap' },
      REACT_APP_ENABLE_SWAP_V2
        ? {
            label: (
              <>
                <Link to="/swap-v2">Swap & Bridge V2</Link>
                <span className="beta-badge">beta</span>
              </>
            ),
            key: '/swap-v2',
          }
        : null,
      { label: <Link to="/dashboard">Dashboard</Link>, key: '/dashboard' },
      {
        label: (
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe9fDY1zCV3vnaubD0740GHzUYcfZoiz2KK_5TIME-rnIA3sg/viewform"
            target="_blank"
            rel="nofollow noreferrer">
            Developers
          </a>
        ),
        key: 'dev-list',
      },
      {
        label: (
          <span className="lifi-more-submenu-title-wrapper">
            More <CaretDownOutlined className="lifi-more-submenu-title-icon" />
          </span>
        ),
        key: 'lifi-more-submenu',
        disabled: false,
        children: [
          {
            label: (
              <a href="https://blog.li.finance/" target="_blank" rel="nofollow noreferrer">
                Blog
              </a>
            ),
            key: 'blog',
          },
          {
            label: (
              <a href="https://docs.li.finance/" target="_blank" rel="nofollow noreferrer">
                Explore Docs
              </a>
            ),
            key: 'docs',
          },
          {
            label: (
              <a href="https://li.fi/" target="_blank" rel="nofollow noreferrer">
                About
              </a>
            ),
            key: 'about',
          },
          {
            label: 'Showcases',
            key: 'lifi-showcase-submenu',
            children: [
              {
                key: '/showcase/ukraine',
                label: (
                  <>
                    <span className="ukraine-flag">&#127482;&#127462;</span>
                    <Link to="/showcase/ukraine">Help Ukraine!</Link>
                  </>
                ),
              },
              {
                type: 'group',
                label: 'Showcases',
                key: '/showcase',
                children: [
                  {
                    key: '/showcase/etherspot-klima',
                    label: <Link to="/showcase/etherspot-klima">Cross-Chain Klima Staking</Link>,
                  },
                  REACT_APP_ENABLE_OFFSET_CARBON_SHOWCASE
                    ? {
                        key: '/showcase/carbon-offset',
                        label: (
                          <Link to="/showcase/carbon-offset">Cross-Chain Carbon Offsetting</Link>
                        ),
                      }
                    : null,
                ],
              },
            ],
          },
          {
            label: 'Legals',
            key: 'legals-submenu',
            children: [
              {
                label: (
                  <a href="https://li.fi/legal/privacy-policy/" target={'_blank'} rel="noreferrer">
                    Privacy Policy
                  </a>
                ),
                key: 'privacy',
              },
              {
                label: (
                  <a href="https://li.fi/legal/imprint/" target={'_blank'} rel="noreferrer">
                    Imprint
                  </a>
                ),
                key: 'imprint',
              },
              {
                label: (
                  <a
                    href="https://li.fi/legal/terms-and-conditions/"
                    target={'_blank'}
                    rel="noreferrer">
                    Terms & Conditions
                  </a>
                ),
                key: 'termsAndConditions',
              },
            ],
          },
        ],
      },
      isMobile
        ? {
            key: 'wallet-button',
            label: <WalletButtons></WalletButtons>,
          }
        : null,
    ]
  }, [isMobile])

  return navConfig
}
