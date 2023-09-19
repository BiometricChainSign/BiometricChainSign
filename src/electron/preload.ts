enum Action {
  ADD_CLASS = 'ADD_CLASS',
  TEST_IMG = 'TEST_IMG',
}

type AddClassData = {
  modelFile: string
  classPath: string
}

type Argv = { action: keyof typeof Action; data: AddClassData }

/**
 * @example
 * // data.modelFile person.xml
 * // data.classPath path to face imgs dataset/new_class/person -> "dataset/new_class/"
 */
export async function runPythonScript<T>(argv: Argv): Promise<T> {
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
