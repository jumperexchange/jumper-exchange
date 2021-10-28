import { Badge, Tooltip } from "antd";
import { Process } from "../types";


const DEFAULT_TRANSACTIONS_TO_LOG = 10

export function renderProcessMessage(process: Process){
  if (process.txLink){
    if(process.message === 'Sign Message to Claim Funds'){
      return <>{process.message.toString()}</>
    }
    if (process.confirmations) {
      return <>{process.message} <a href={process.txLink} target="_blank" rel="nofollow noreferrer">Tx {renderConfirmations(process.confirmations, DEFAULT_TRANSACTIONS_TO_LOG)}</a></>
    }
    return <>{process.message} <a href={process.txLink} target="_blank" rel="nofollow noreferrer">Tx</a></>
  }
  return <>{process.message.toString()}</>
}


const renderConfirmations = (count: number, max: number) => {
  const text = count < max ? `${count}/${max}` : `${max}+`
  return (
    <Tooltip title={text + ' Confirmations'}>
      <Badge
        count={text}
        style={{ backgroundColor: '#52c41a', marginBottom: '2px'}}
      />
    </Tooltip>
  )
}
