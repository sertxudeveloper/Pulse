export default () => {
  require('./ipcEvents/songs').default()
  require('./ipcEvents/artists').default()
  require('./ipcEvents/albums').default()

  require('./ipcEvents/search').default()
  require('./ipcEvents/history').default()
}
