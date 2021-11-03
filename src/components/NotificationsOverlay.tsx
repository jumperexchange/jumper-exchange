import './NotificationsOverlay.css'

import { Button, Typography } from 'antd'
import { animate } from 'motion'
import { useEffect, useState } from 'react'

import notifications from '../services/notifications'

const NOTIFICATION_OVERLAY_CSS_ID = 'notification-overlay'
const NOTIFICATION_OVERLAY_VERTICAL_START_POSITION = '-400px'
const NOTIFICATION_OVERLAY_VERTICAL_DISPLAY_POSITION = '50px'

// reset permissions on chrome://settings/content/siteDetails
function NotificationOverlay() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied',
  )

  const activateNotifications = async () => {
    const status: NotificationPermission = await notifications.activateNotifications()
    setPermissionStatus(status)
  }

  const dismissOverlay = async () => {
    await animate(
      `#${NOTIFICATION_OVERLAY_CSS_ID}`,
      {
        right: [
          NOTIFICATION_OVERLAY_VERTICAL_DISPLAY_POSITION,
          NOTIFICATION_OVERLAY_VERTICAL_START_POSITION,
        ],
        opacity: [1, 0],
      },
      {
        duration: 0.2,
        easing: 'ease-in',
      },
    ).finished
    setPermissionStatus('denied')
  }

  useEffect(() => {
    animate(
      `#${NOTIFICATION_OVERLAY_CSS_ID}`,
      {
        right: [null, NOTIFICATION_OVERLAY_VERTICAL_DISPLAY_POSITION],
      },
      {
        delay: 4,
        duration: 0.2,
        easing: 'ease-out',
      },
    )
  }, [])

  //only show when user has not decided yet
  if (permissionStatus !== 'default') return null
  return (
    <div
      id={NOTIFICATION_OVERLAY_CSS_ID}
      style={{ right: NOTIFICATION_OVERLAY_VERTICAL_START_POSITION }}>
      <div>
        <Typography.Title level={5}>Enable Notifications</Typography.Title>
        <Typography.Text>
          Swaps and cross-chain transfers might take a while to complete. Enable notifications to
          stay informed about the state of your transaction.
        </Typography.Text>
      </div>

      <div>
        <Button type="link" style={{ padding: 0 }} onClick={activateNotifications}>
          Enable Notifications
        </Button>
        <Button type="link" danger onClick={dismissOverlay}>
          {' '}
          Dismiss
        </Button>
      </div>
    </div>
  )
}

export default NotificationOverlay
