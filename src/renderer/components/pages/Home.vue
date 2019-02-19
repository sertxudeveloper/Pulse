<template>
  <div>
    <div class="border-bottom d-flex mb-2 pb-2">
      <h3 class="mb-0">Last 7 days most listened</h3>
    </div>
    <div class="row" v-if="!most_listened_week.length">
      <div class="col-12 text-center">
        Data not available
      </div>
    </div>
    <div class="row" v-else>
      <song :song="song" v-for="(song, key) in most_listened_week" :key="key"></song>
    </div>

    <div class="border-bottom d-flex mb-2 mt-4 pb-2 justify-content-between">
      <h3 class="mb-0">Last 7 days recommendation</h3>
      <span class="align-self-end d-flex" v-on:click="clearCacheRecommendedWeek">Refresh</span>
    </div>
    <div class="row" v-if="!recommended_week.length">
      <div class="col-12 text-center">
        Recommendations not available
      </div>
    </div>
    <div class="row" v-else>
      <song :song="song" v-for="(song, key) in recommended_week" :key="key"></song>
    </div>

    <div class="border-bottom d-flex mb-2 mt-4 pb-2">
      <h3 class="mb-0">Last month most listened</h3>
    </div>
    <div class="row" v-if="!most_listened_month.length">
      <div class="col-12 text-center">
        Data not available
      </div>
    </div>
    <div class="row" v-else>
      <song :song="song" v-for="(song, key) in most_listened_month" :key="key"></song>
    </div>

    <div class="border-bottom d-flex mb-2 mt-4 pb-2 justify-content-between">
      <h3 class="mb-0">Last month recommendation</h3>
      <span class="align-self-end d-flex" v-on:click="clearCacheRecommendedMonth">Refresh</span>
    </div>
    <div class="row" v-if="!recommended_month.length">
      <div class="col-12 text-center">
        Recommendations not available
      </div>
    </div>
    <div class="row" v-else>
      <song :song="song" v-for="(song, key) in recommended_month" :key="key"></song>
    </div>

    <div class="border-bottom d-flex mb-2 mt-4 pb-2">
      <h3 class="mb-0">Last listened</h3>
    </div>
    <div class="row" v-if="!last_listened.length">
      <div class="col-12 text-center">
        Data not available
      </div>
    </div>
    <div class="row" v-else>
      <song :song="song" v-for="(song, key) in last_listened" :key="key"></song>
    </div>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer
  import Song from '../parts/Song'

  export default {
    components: {Song},
    data () {
      return {
        most_listened_week: [],
        most_listened_month: [],
        recommended_week: [],
        recommended_month: [],
        last_listened: []
      }
    },
    methods: {
      getListenedWeek: () => ipc.send('history', {method: 'listenedWeek'}),
      getListenedMonth: () => ipc.send('history', {method: 'listenedMonth'}),
      getRecommendedWeek: () => ipc.send('history', {method: 'recommendedWeek'}),
      getRecommendedMonth: () => ipc.send('history', {method: 'recommendedMonth'}),
      getLastListened: () => ipc.send('history', {method: 'lastListened'}),
      clearCacheRecommendedWeek () {
        this.recommended_week = []
        ipc.send('history', {method: 'clearCacheRecommendedWeek'})
      },
      clearCacheRecommendedMonth () {
        this.recommended_month = []
        ipc.send('history', {method: 'clearCacheRecommendedMonth'})
      }
    },
    created () {
      this.getListenedWeek()
      this.getListenedMonth()
      this.getRecommendedWeek()
      this.getRecommendedMonth()
      this.getLastListened()

      ipc.on('history-listenedWeek', (event, response) => this.most_listened_week = response)
      ipc.on('history-listenedMonth', (event, response) => this.most_listened_month = response)
      ipc.on('history-recommendedWeek', (event, response) => this.recommended_week = response)
      ipc.on('history-recommendedMonth', (event, response) => this.recommended_month = response)
      ipc.on('history-lastListened', (event, response) => this.last_listened = response)
    }
  }
</script>

<style>

</style>
