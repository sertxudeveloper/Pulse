<template>
  <div class="modal fade text-dark" id="artistModal" tabindex="-1" role="dialog" aria-labelledby="artistModal"
       aria-hidden="true" v-if="artist">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit Artist</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" placeholder="Name" v-model="artist.name">
              <small id="nameHelp" class="form-text text-muted">The name must be unique.</small>
            </div>
            <div class="form-group">
              <label>Picture</label>
              <input type="file" class="form-control-file" @change="onFileChange">
              <small id="fileHelp" class="form-text text-muted">
                <a href="#" v-on:click="openFolder">The file will be stored in {{folderPath}}</a>
              </small>
              <img :src="artist.picture" width="35%" class="mt-4 mx-auto d-block">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const path = require('path')
  const remote = require('electron').remote

  export default {
    data () {
      return {
        artist: null
      }
    },
    methods: {
      openModal (artist) {
        this.artist = JSON.parse(JSON.stringify(artist))
        this.$nextTick(() => {
          $('#artistModal').modal('show')
          $('#artistModal').on('hidden.bs.modal', () => $('#artistModal form')[0].reset())
        })
      },
      onFileChange (e) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        console.log(files)
        this.artist.picture = files[0].path
      },
      openFolder () {
        remote.shell.openItem(this.folderPath)
      }
    },
    computed: {
      folderPath () {
        return path.join(remote.app.getPath('userData'), 'pictures')
      }
    }
  }
</script>

<style scoped>

</style>
