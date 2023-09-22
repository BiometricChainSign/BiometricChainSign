import { ipcMain } from 'electron'
import { spawn } from 'child_process'
import { join } from 'path'
import fs from 'fs/promises'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
import 'dotenv/config'

const web3storage = new Web3Storage({ token: process.env.WEB3_STORAGE_API_TOKEN! })
const pythonDir = join(__dirname, 'python') // Path of python script folder

async function callPython(scriptName: string, argv: { [key: string]: unknown }) {
  const python = join(pythonDir, '.venv', 'bin', 'python')

  return new Promise(function (resolve, reject) {
    const script = join(pythonDir, scriptName)
    const pyArgs = [script, JSON.stringify(argv)]

    const pyprog = spawn(python, pyArgs)
    let result = ''
    let resultError = ''

    pyprog.stdout.on('data', function (data) {
      result = data.toString()
    })

    pyprog.stderr.on('data', data => {
      resultError = data.toString()
    })

    pyprog.stdout.on('end', function () {
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

ipcMain.on('pythonScript', async (event, argv) => {
  try {
    const output = await callPython('fisherface.py', argv)
    event.reply('pythonScript', output)
  } catch (error) {
    event.reply('pythonScript', error)
  }
})

ipcMain.handle('storeFaceImage', async (event, address: string, fileName: string, imageFile: Buffer) => {
  const dirPath = join(pythonDir, 'dataset', 'new_class', address)
  await fs.mkdir(dirPath, { recursive: true })
  await fs.writeFile(join(dirPath, fileName), imageFile)
})

ipcMain.handle('uploadModelToFilecoin', async (event, address: string) => {
  const files = await getFilesFromPath(join(pythonDir, `${address}.xml`))
  return web3storage.put(files)
})

ipcMain.handle('cleanUpNewClass', async (event, address: string) => {
  const dirPath = join(pythonDir, 'dataset', 'new_class', address)
  await fs.rm(dirPath, { recursive: true, force: true })
})
