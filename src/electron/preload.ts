enum Action {
  ADD_CLASS = 'ADD_CLASS',
  TEST_IMG = 'TEST_IMG',
}

type AddClassData = {
  modelFile: string
  classPath: string
}

type TestImgData = {
  modelFile: string
  testImagePath: string
}

type Argv = { action: keyof typeof Action; data: AddClassData | TestImgData }

/**
 * @example
 * // data.modelFile person.xml
 * // data.classPath path to face imgs dataset/new_class/person -> "dataset/new_class/"
 */
async function runScript<T>(argv: Argv): Promise<T> {
  const result = (await new Promise(resolve => {
    ipcRenderer.once('script', (event, args) => {
      resolve(args)
    })

    ipcRenderer.send('script', argv)
  })) as Promise<T> | Error
  if (result instanceof Error) throw new Error(result.message)

  return result
}

async function storeFaceImage(address: string, fileName: string, imageFile: ArrayBuffer): Promise<void> {
  await ipcRenderer.invoke('storeFaceImage', address, fileName, imageFile)
}

async function setWeb3StorageToken(token: string): Promise<void> {
  return ipcRenderer.invoke('setWeb3StorageToken', token)
}

async function uploadModelToFilecoin(address: string): Promise<string> {
  return ipcRenderer.invoke('uploadModelToFilecoin', address)
}

async function downloadModelFromFilecoin(cid: string, address: string): Promise<void> {
  return ipcRenderer.invoke('downloadModelFromFilecoin', cid, address)
}

async function cleanupModelFiles(address: string): Promise<void> {
  await ipcRenderer.invoke('cleanupModelFiles', address)
}

import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  runScript,
  storeFaceImage,
  setWeb3StorageToken,
  uploadModelToFilecoin,
  downloadModelFromFilecoin,
  cleanupModelFiles,
})
