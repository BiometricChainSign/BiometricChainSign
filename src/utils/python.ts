import { ipcRenderer } from 'electron'

export async function runPythonScript<T>(argv: string[]): Promise<T[]> {
  const row = (await new Promise(resolve => {
    ipcRenderer.once('pythonScript', (event, arg) => {
      resolve(arg)
    })

    ipcRenderer.send('pythonScript', argv)
  })) as Promise<T[]> | Error
  if (row instanceof Error) throw new Error(row.message)

  return row
}
