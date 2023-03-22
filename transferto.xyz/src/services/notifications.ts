import lifiIcon from '../assets/icon192.png'

export enum NotificationType {
  SWAP_SUCCESSFUL,
  CROSS_SUCCESSFUL,
  SWAP_ERROR,
  CROSS_ERROR,
  TRANSACTION_SUCCESSFULL,
  TRANSACTION_ERROR,
}

const notificationsSupported = (): boolean => {
  if (!('Notification' in window)) {
    // eslint-disable-next-line no-console
    console.log('This browser does not support desktop notification')
    return false
  }
  return true
}

const activateNotifications = async (): Promise<NotificationPermission> => {
  // if(Notification.permission === "granted") return
  if (notificationsSupported()) {
    await Notification.requestPermission()
    return Notification.permission
  }
  return 'denied'
}

const getNotificationContents = (
  type: NotificationType,
): { title: string; options: NotificationOptions; alwaysShow: boolean } => {
  let title: string = ''
  let options: NotificationOptions = {
    dir: 'auto',
    // icon: lifiIcon,
    badge: lifiIcon,
  }
  let alwaysShow = false
  switch (type) {
    case NotificationType.SWAP_SUCCESSFUL:
      title = 'Swap Successful!'
      break
    case NotificationType.SWAP_ERROR:
      title = 'Swap Failed!'
      alwaysShow = true
      break
    case NotificationType.CROSS_SUCCESSFUL:
      title = 'Cross Chain Transfer Successful!'
      break
    case NotificationType.CROSS_ERROR:
      title = 'Cross Chain Transfer Failed!'
      alwaysShow = true
      break
    case NotificationType.TRANSACTION_SUCCESSFULL:
      title = 'Transaction Successful!'
      alwaysShow = true // intended for entire transaction containing multiple swaps / crosses. It makes sense to always inform user about this, no matter the page visibility
      break
    case NotificationType.TRANSACTION_ERROR:
      title = 'Transaction Failed!'
      alwaysShow = true
      break
    default:
      break
  }

  return { title, options, alwaysShow }
}

const showNotification = (type: NotificationType, visibilityOverride = false) => {
  if (!notificationsSupported()) return
  if (Notification.permission === 'denied') return
  const { title, options, alwaysShow } = getNotificationContents(type)
  if (document.hidden || alwaysShow || visibilityOverride) {
    new Notification(title, options)
  }
}

const serviceExport = {
  activateNotifications,
  showNotification,
}
export default serviceExport
