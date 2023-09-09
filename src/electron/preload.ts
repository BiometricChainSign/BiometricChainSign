export async function runPythonScript<T>(argv: string[]): Promise<T> {
  const output = (await new Promise(resolve => {
    ipcRenderer.once('pythonScript', (event, args) => {
      resolve(args)
    })

    ipcRenderer.send('pythonScript', argv)
  })) as Promise<T> | Error
  if (output instanceof Error) throw new Error(output.message)

  return output
}

import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  runPythonScript,
})
