import './ipc'
import { app, BrowserWindow } from 'electron'

import { join } from 'path'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // win.removeMenu()
    mainWindow.loadURL(join(MAIN_WINDOW_VITE_DEV_SERVER_URL))
    mainWindow.webContents.openDevTools()
  } else {
    // Vite's dev server
    mainWindow.loadFile(join(__dirname, 'index.html'))
    mainWindow.webContents.openDevTools()
  }

  // mainWindow.webContents.on('did-finish-load', () => {
  //   mainWindow.webContents.executeJavaScript(`
  //     const stream = navigator.mediaDevices.getUserMedia({ video: true });
  //   `)
  // })
}

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
