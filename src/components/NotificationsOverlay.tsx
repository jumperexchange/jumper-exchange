import './NotificationsOverlay.css';
import { Button, Typography } from 'antd';

import notifications  from '../services/localNotifications'
import { useState } from 'react';

// reset permissions on chrome://settings/content/siteDetails
function NotificationOverlay() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(Notification.permission)

  const activateNotifications = async () => {
    const status: NotificationPermission = await notifications.activateNotifications()
    console.log(status)
    setPermissionStatus(status)
  }

  //only show when user has not decided yet
  if (permissionStatus !== "default") return null
  return (
    <div id="notification-overlay">
      <div>
      <Typography.Title level={5}>Enable Notifications</Typography.Title>
      <Typography.Text>
        Swaps and cross-chain transfers might take a while to complete.
        Enable notifications to stay informed about the state of your transaction.
      </Typography.Text>
      </div>

      <div>
      <Button type="link" style={{padding: 0}} onClick={activateNotifications}>
        Enable Notifications
      </Button>
      <Button type="link" danger onClick={() => setPermissionStatus("denied")}> Dismiss</Button>
      </div>
    </div>
  )
}


export default NotificationOverlay
