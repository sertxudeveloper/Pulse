<template>
  <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="nalign-items-center d-flex h-100 justify-content-center mr-0 navbar-brand py-1" href="#">
      <img :src="logoRoute" alt="Pulse" class="h-100">
    </a>
    <div class="d-flex h-100 w-100">
      <input class="form-control form-control-dark w-100 h-100" type="text" placeholder="Search" v-model="search">
      <div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary rounded-0" v-on:click="$router.back()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button type="button" class="btn btn-secondary rounded-0" v-on:click="$router.forward()">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

    </div>
  </nav>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  const path = require('path')

  export default {
    data: function () {
      return {
        search: '',
        isTyping: null
      }
    },
    computed: {
      logoRoute() {
        return path.join(__static, '/logo.png')
      }
    },
    watch: {
      search: function () {
        clearTimeout(this.isTyping)
        this.isTyping = setTimeout(() => {
          if (!this.search || this.search.trim().length === 0) {
            this.search = ''
            this.$router.push({name: 'home-page'})
            return null
          }
          ipc.send('search', this.search)
          this.$router.push({name: 'search'})
        }, 700)
      }
    },
    created () {
      ipc.on('search', (event, response) => {
        this.$parent.searchResults = response
      })
    }
  }
</script>

<style>
  .navbar-brand {
    color: #ff3348 !important;
  }

  nav input:hover {
    cursor: text;
  }

  nav button {
    width: 60px;
  }
</style>
