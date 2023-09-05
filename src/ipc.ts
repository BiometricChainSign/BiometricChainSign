import { ipcMain } from 'electron'

ipcMain.on('pythonScript', async (event, data) => {
  try {
    event.reply('pythonScript', 'reply IPC')

    // const python = require('child_process').spawn('python', ['./python/fisherface.py', 'input.value'])

    // python.stdout.on('data', function (output: any) {
    //   event.reply('pythonScript', output.toString('utf8'))
    // })
  } catch (error) {
    event.reply('pythonScript', error)
  }
})
