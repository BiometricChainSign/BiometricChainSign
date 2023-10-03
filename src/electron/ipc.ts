import 'dotenv/config'

import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

let web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_API_TOKEN! })
const dir = join(__dirname, 'static')

async function callScript(scriptName: string, argv: { [key: string]: unknown }) {
  if (/^win/i.test(process.platform)) {
    return new Promise((resolve, reject) => {
      const script = join(dir, `${scriptName}.exe`)
      const args = [`${JSON.stringify(argv)}`]

      const exe = spawn(script, args)
      let result = ''
      let resultError = ''

      exe.stdout.on('data', data => {
        result = data.toString()
      })

      exe.stderr.on('data', data => {
        resultError = data.toString()
      })

      exe.stdout.on('end', () => {
        console.log(resultError, result)
        if (resultError == '') {
          resolve(JSON.parse(result))
        } else {
          const error = new Error(resultError)
          console.error(error)

          reject(resultError)
        }
      })
    })
  } else {
    const python = join(dir, '.venv', 'bin', 'python')

    return new Promise((resolve, reject) => {
      const script = join(dir, `${scriptName}.py`)
      const pyArgs = [script, `${JSON.stringify(argv)}`]

      const pyprog = spawn(python, pyArgs)
      let result = ''
      let resultError = ''

      pyprog.stdout.on('data', data => {
        result = data.toString()
      })

      pyprog.stderr.on('data', data => {
        resultError = data.toString()
      })

      pyprog.stdout.on('end', () => {
        console.log(result)
        if (resultError == '') {
          resolve(JSON.parse(result))
        } else {
          const error = new Error(resultError)
          console.error(error)
          reject(resultError)
        }
      })
    })
  }
}

ipcMain.on('script', async (event, argv) => {
  try {
    const output = await callScript('fisherface', argv)
    event.reply('script', output)
  } catch (error) {
    event.reply('script', error)
  }
})

ipcMain.handle('storeFaceImage', async (event, address: string, fileName: string, imageFile: Buffer) => {
  const dirPath = join(dir, 'dataset', 'new_class', address)
  await fs.mkdir(dirPath, { recursive: true })
  await fs.writeFile(join(dirPath, fileName), imageFile)
})

ipcMain.handle('setWeb3StorageToken', async (event, token: string) => {
  web3Storage = new Web3Storage({ token })
})

ipcMain.handle('uploadModelToFilecoin', async (event, address: string) => {
  const files = await getFilesFromPath(join(dir, `${address}.xml`))
  return web3Storage.put(files)
})

ipcMain.handle('downloadModelFromFilecoin', async (event, cid: string, address: string) => {
  const res = await web3Storage.get(cid)
  const files = (await res?.files())!
  const modelFilePath = join(dir, `${address}.xml`)
  const writer = createWriteStream(modelFilePath)
  const reader = files[0].stream().getReader()

  async function writeNextChunk() {
    const { done, value } = await reader.read()

    if (done) {
      writer.end()
      return
    }

    writer.write(Buffer.from(value))
    return writeNextChunk()
  }

  await writeNextChunk()
})

ipcMain.handle('cleanupModelFiles', async (event, address: string) => {
  const imagesFolderPath = join(dir, 'dataset', 'new_class', address)
  const modelFilePath = join(dir, `${address}.xml`)
  await fs.rm(imagesFolderPath, { recursive: true, force: true })
  await fs.rm(modelFilePath, { recursive: true, force: true })
})
