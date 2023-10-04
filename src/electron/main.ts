import { app, BrowserWindow } from 'electron'
import { join } from 'path'

import './ipc'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: join(__dirname, 'static', 'imgs', 'icon.png'),
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // dev server
    mainWindow.loadURL(join(MAIN_WINDOW_VITE_DEV_SERVER_URL))
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, 'index.html'))
    mainWindow.removeMenu()
  }
}

if (require('electron-squirrel-startup')) app.quit()

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
