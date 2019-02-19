const axios = require('axios')
const qs = require('qs')
// const SPOTIFY_CLIENT_ID = ''
// const SPOTIFY_SECRET_ID = ''

class Spotify {

  async search (query, type) {
    const access_token = await this.authenticate()
    const headers = {'Authorization': 'Bearer ' + access_token}
    const baseURL = 'https://api.spotify.com/v1/search?q='
    let response

    switch (type) {
      case 'tracks':
        response = await axios({method: 'get', url: baseURL + query + '&type=track&market=US&limit=1', headers})
          .then(res => res.data)
          .catch(err => console.error(err.response))
        return response.tracks.items[0].uri
        break

      case 'artists':
        response = await axios({method: 'get', url: baseURL + query + '&type=artist&market=US&limit=1', headers})
          .then(res => res.data)
          .catch(err => console.error(err.response))
        return response.artists.items[0].uri
        break
    }
  }

  async getRecommendation (uri, type) {
    const access_token = await this.authenticate()
    const headers = {'Authorization': 'Bearer ' + access_token}
    const baseURL = 'https://api.spotify.com/v1/recommendations?limit=2&market=US'
    let response

    switch (type) {
      case 'tracks':
        response = await axios({method: 'get', url: baseURL + '&seed_tracks=' + uri, headers})
          .then(res => res.data)
          .catch(err => console.error(err.response))
        return response.tracks
        break

      case 'artists':
        response = await axios({method: 'get', url: baseURL + '&seed_artists=' + uri, headers})
          .then(res => res.data)
          .catch(err => console.error(err.response))
        return response.artists.items[0].uri
        break
    }
  }

  async authenticate () {
    let data = {grant_type: 'client_credentials'}
    let options = {
      auth: {username: SPOTIFY_CLIENT_ID, password: SPOTIFY_SECRET_ID},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }

    let response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), options)
      .then(res => res.data)
      .catch(error => console.error(error))

    return response.access_token
  }
}

export default Spotify
