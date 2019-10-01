const {app, BrowserWindow, nativeImage, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const Mongo = require('./database').default

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

async function connectDatabase () {
  /**
   * Create connection to the database
   */
  const mongo = new Mongo()
  global.db = await mongo.connect()
  createWindow()
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  const thumbButtons = [
    {
      tooltip: 'Previous Song',
      icon: nativeImage.createFromPath(path.join(__static, '/previous.png')),
      click () {
        mainWindow.send('player-previous')
      }
    }, {
      tooltip: 'Play',
      icon: nativeImage.createFromPath(path.join(__static, '/play.png')),
      click () {
        mainWindow.send('player-playOrPause')
      }
    }, {
      tooltip: 'Next Song',
      icon: nativeImage.createFromPath(path.join(__static, '/next.png')),
      click () {
        mainWindow.send('player-next')
      }
    }, {
      tooltip: 'Repeat',
      icon: nativeImage.createFromPath(path.join(__static, '/repeat.png')),
      click () {
        mainWindow.send('player-repeat')
      }
    }, {
      tooltip: 'Shuffle',
      icon: nativeImage.createFromPath(path.join(__static, '/shuffle.png')),
      click () {
        mainWindow.send('player-shuffle')
      }
    }
  ]

  mainWindow.setThumbarButtons([])
  ipcMain.on('playing-status', (event, request) => {
    if (request.remove) {
      mainWindow.setThumbarButtons([])
    } else {
      if (request.playing) {
        thumbButtons[1].icon = nativeImage.createFromPath(path.join(__static, '/pause.png'))
        thumbButtons[1].tooltip = 'Pause'
      } else {
        thumbButtons[1].icon = nativeImage.createFromPath(path.join(__static, '/play.png'))
        thumbButtons[1].tooltip = 'Play'
      }

      if (request.shuffle) {
        thumbButtons[4].icon = nativeImage.createFromPath(path.join(__static, '/shuffle-active.png'))
      } else {
        thumbButtons[4].icon = nativeImage.createFromPath(path.join(__static, '/shuffle.png'))
      }

      if (request.repeat === 0) {
        thumbButtons[3].icon = nativeImage.createFromPath(path.join(__static, '/repeat.png'))
      } else if (request.repeat === 1) {
        thumbButtons[3].icon = nativeImage.createFromPath(path.join(__static, '/repeat-active.png'))
      } else if (request.repeat === 2) {
        thumbButtons[3].icon = nativeImage.createFromPath(path.join(__static, '/repeat-one-active.png'))
      }
      mainWindow.setThumbarButtons(thumbButtons)
    }
  })

  globalShortcut.register('MediaPreviousTrack', () => mainWindow.send('player-previous'))
  globalShortcut.register('MediaPlayPause', () => mainWindow.send('player-playOrPause'))
  globalShortcut.register('MediaNextTrack', () => mainWindow.send('player-next'))
  globalShortcut.register('MediaStop', () => mainWindow.send('player-clear'))

  mainWindow.maximize()
  mainWindow.on('closed', () => mainWindow = null)

  require('./ipcEvents').default()
}

app.setAppUserModelId('com.sertxudeveloper.pulse')

app.on('ready', connectDatabase)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) connectDatabase()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
const { autoUpdater } = require('electron-updater')

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
