import { ipcMain } from 'electron'
import { exec, spawn } from 'child_process'
import { join } from 'path'

const pythonDir = join(__dirname, 'python') // Path of python script folder

function getPythonInterpreterPath(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('python -c "import sys; print(sys.executable)"', (error, stdout, stderr) => {
      if (error) {
        exec('python3 -c "import sys; print(sys.executable)"', (error, stdout, stderr) => {
          if (error) {
            return reject(error)
          }

          return resolve(stdout.trim())
        })
      }

      return resolve(stdout.trim())
    })
  })
}

function cleanWarning(error: string) {
  return error.replace(/Detector is not able to detect the language reliably.\n/g, '')
}

const callPython = async (scriptName: string, argv: string[] = []) => {
  // const python = await getPythonInterpreterPath()
  const python = 'python3'

  return new Promise(function (resolve, reject) {
    const script = join(pythonDir, scriptName)
    const pyArgs = [script, argv.join(' ')]

    const pyprog = spawn(python, pyArgs)
    let result = ''
    let resultError = ''

    pyprog.stdout.on('data', function (data) {
      result += data.toString()
    })

    pyprog.stderr.on('data', data => {
      resultError += cleanWarning(data.toString())
    })

    pyprog.stdout.on('end', function () {
      if (resultError == '') {
        resolve(JSON.parse(result))
      } else {
        console.error(`Python error, you can reproduce the error with: \n${python} ${script} ${pyArgs.join(' ')}`)
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
