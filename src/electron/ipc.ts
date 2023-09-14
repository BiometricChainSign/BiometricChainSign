import { ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { join } from 'path'

const pythonDir = join(__dirname, 'python') // Path of python script folder

function getPythonInterpreterPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('python -c "import sys; print(sys.executable)"', (error, stdout, stderr) => {
      if (error || stderr) {
        exec('python3 -c "import sys; print(sys.executable)"', (error, stdout, stderr) => {
          if (error || stderr) {
            reject(error)
          }

          return resolve(stdout.trim())
        })
      } else {
        return resolve(stdout.trim())
      }
    })
  })
}

const callPython = async (scriptName: string, argv: { [key: string]: unknown }) => {
  const python = await getPythonInterpreterPath()

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
