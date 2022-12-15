import './DiscordPopup.css'

import WidgetBot from '@widgetbot/react-embed'
import { Modal } from 'antd'

interface DiscordPopupProps {
  show: boolean
  handleClose: Function
}
export const DiscordPopup = ({ show, handleClose }: DiscordPopupProps) => {
  return (
    <Modal
      open={show}
      onOk={() => handleClose()}
      onCancel={() => handleClose()}
      footer={null}
      centered
      closable={false}
      className="lifi-discord-support-modal">
      <WidgetBot
        server="849912621360218112" // LI.FI / TransferTo.xyz
        channel="1048071264352337951" // #🩹︱web-support
        shard="https://emerald.widgetbot.io"
        style={{ width: '100%', height: '500px' }}
      />
    </Modal>
  )
}
