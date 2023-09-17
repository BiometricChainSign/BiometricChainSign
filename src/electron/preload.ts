enum Action {
  ADD_CLASS = 'ADD_CLASS',
  TEST_IMG = 'TEST_IMG',
}

export async function runPythonScript<T>(argv: { action: keyof typeof Action; data: any }): Promise<T> {
  const result = (await new Promise(resolve => {
    ipcRenderer.once('pythonScript', (event, args) => {
      resolve(args)
    })

    ipcRenderer.send('pythonScript', argv)
  })) as Promise<T> | Error
  if (result instanceof Error) throw new Error(result.message)

  return result
}

import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  runPythonScript,
})
