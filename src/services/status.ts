import { emptyExecution, Execution, Process } from '../types'
import { deepClone } from './utils'


export const initStatus = (updateStatus?: Function, initialStatus?: Execution) => {
  const status = initialStatus || deepClone(emptyExecution)
  const update = updateStatus || console.log
  update(status)
  return { status, update }
}

export const createAndPushProcess = (updateStatus: Function, status: Execution, message: string, params?: object) => {
  const newProcess: Process = {
    startedAt: Date.now(),
    message: message,
    status: 'PENDING',
  }
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      newProcess[key] = value
    }
  }

  status.status = 'PENDING'
  status.process.push(newProcess)
  updateStatus(status)
  return newProcess
}

export const setStatusFailed = (updateStatus: Function, status: Execution, currentProcess: Process, params?: object) => {
  status.status = 'FAILED'
  currentProcess.status = 'FAILED'
  currentProcess.failedAt = Date.now()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      currentProcess[key] = value
    }
  }

  updateStatus(status)
}

export const setStatusDone = (updateStatus: Function, status: Execution, currentProcess: Process, params?: object) => {
  currentProcess.status = 'DONE'
  currentProcess.doneAt = Date.now()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      currentProcess[key] = value
    }
  }
  console.log(status)
  updateStatus(status)
}
