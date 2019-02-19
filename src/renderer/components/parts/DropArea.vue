<template>
  <div id="droparea">
    <div class="d-flex justify-content-center h-100 align-items-center">
      <div class="align-items-center d-flex flex-column justify-content-center shadow">
        <h1 class="display-1"><i class="fas fa-file-upload"></i></h1>
        <h3>Drop your files here</h3>
      </div>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer

  export default {
    data () {
      return {
        counter: 0
      }
    },
    methods: {
      processDrop (route) {
        ipc.send('songs', {method: 'process', data: {route}})
      }
    },
    created () {
      document.addEventListener('dragenter', (e) => {
        this.counter++
        $('#droparea').fadeIn('fast')
      })

      document.addEventListener('dragleave', (e) => {
        this.counter--
        if (this.counter === 0) $('#droparea').fadeOut('fast')
      })

      document.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.counter = 0
        $('#droparea').addClass('success')

        setTimeout(() => {
          $('#droparea').fadeOut('fast')
          $('#droparea').removeClass('success')
        }, 500)

        for (let f of e.dataTransfer.files) {
          this.processDrop(f.path)
        }
        return false
      })

      document.addEventListener('dragover', function (e) {
        e.preventDefault()
        e.stopPropagation()
      })

      ipc.on('songs-processed', (event, response) => {
        new Noty(response).show()
      })
    }
  }
</script>

<style scoped>

</style>
