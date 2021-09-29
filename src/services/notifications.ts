import lifiIcon from '../assets/icon192.png'

export enum NotificationType {
  SWAP_SUCCESSFUL,
  CROSS_SUCCESSFUL,
  SWAP_ERROR,
  CROSS_ERROR
}


const notificationsSupported = ():boolean =>{
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false
  }
  return true
}

const activateNotifications = async (): Promise<NotificationPermission>  => {
  // if(Notification.permission === "granted") return
  if (notificationsSupported()){
    await Notification.requestPermission();
    return Notification.permission
  }
  return "denied"
}

const getNotificationContents = (type: NotificationType):{title: string, options: NotificationOptions, alwaysShow: boolean} => {
  let title: string = "";
  let options: NotificationOptions = {
    dir: "auto",
    // icon: lifiIcon,
    badge: lifiIcon
  }
  let alwaysShow = false
  switch(type){
    case NotificationType.SWAP_SUCCESSFUL:
      title = "Swap Successful!"
      break;
    case NotificationType.SWAP_ERROR:
      title = "Swap Failed!"
      alwaysShow = true
      break;
      case NotificationType.CROSS_SUCCESSFUL:
        title = "Cross Chain Transfer Successful!"
        break;
      case NotificationType.CROSS_ERROR:
        title = "Cross Chain Transfer Failed!"
        alwaysShow = true
        break;
    default:
      break;
  }

  return {title, options, alwaysShow}
}

const showNotification = (type: NotificationType) => {
  if(Notification.permission === "denied") return
  const {title, options, alwaysShow} = getNotificationContents(type)
  if(document.hidden || alwaysShow){
    new Notification(title, options)
  }

}

const serviceExport = {
  activateNotifications,
  showNotification
}
export default  serviceExport
