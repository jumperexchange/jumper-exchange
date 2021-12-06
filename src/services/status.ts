/* eslint-disable max-params */
import { emptyExecution, Execution, Process, ProcessMessage } from '../types'
import { UpdateExecution } from './LIFI/types'
import { deepClone } from './utils'

export const initStatus = (updateStatus?: UpdateExecution, initialStatus?: Execution) => {
  const status = initialStatus || (deepClone(emptyExecution) as Execution)
  // eslint-disable-next-line no-console
  const update = updateStatus || console.log
  if (!initialStatus) {
    update(status)
  }
  return { status, update }
}

export const createAndPushProcess = (
  id: string,
  updateStatus: UpdateExecution,
  status: Execution,
  message: ProcessMessage,
  params?: object,
) => {
  const process = status.process.find((p) => p.id === id)
  if (process) {
    status.status = 'PENDING'
    updateStatus(status)
    return process
  }
  const newProcess: Process = {
    id: id,
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

export const setStatusFailed = (
  updateStatus: Function,
  status: Execution,
  currentProcess: Process,
  params?: object,
) => {
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

export const setStatusDone = (
  updateStatus: Function,
  status: Execution,
  currentProcess: Process,
  params?: object,
) => {
  currentProcess.status = 'DONE'
  currentProcess.doneAt = Date.now()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      currentProcess[key] = value
    }
  }
  updateStatus(status)
}
