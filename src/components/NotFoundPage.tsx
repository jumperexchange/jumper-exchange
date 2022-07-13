import { Typography } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'

import { useMetatags } from '../hooks/useMetatags'
import { useStomt } from '../services/stomt'

function NotFoundPage() {
  useMetatags({
    title: 'LI.FI - Not Found',
    status: 404,
  })
  useStomt('lifi')
  return (
    <Content style={{ width: '100vw', height: 'calc(100vh - 64px)' }} className="site-layout">
      <Typography.Title
        disabled
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
        Not Found
      </Typography.Title>
    </Content>
  )
}

export default NotFoundPage
