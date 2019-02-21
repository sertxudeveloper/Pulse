<p align="center">
<img width="65%" src="./.github/pulse.png">
</p>
<h3 align="center">A web-based music player</h3>

---

[![Build Status](https://travis-ci.com/sertxudeveloper/Pulse.svg?branch=master)](https://travis-ci.com/sertxudeveloper/Pulse) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Dependency Status](https://david-dm.org/sertxudeveloper/Pulse.svg)](https://david-dm.org/sertxudeveloper/Pulse) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity) [![GitHub release](https://img.shields.io/github/release/sertxudeveloper/Pulse.svg)](https://github.com/sertxudeveloper/Pulse/releases/) [![Github all releases](https://img.shields.io/github/downloads/sertxudeveloper/Pulse/total.svg)](https://GitHub.com/sertxudeveloper/Pulse/releases/)

[![GitHub issues](https://img.shields.io/github/issues/sertxudeveloper/Pulse.svg)](https://github.com/sertxudeveloper/Pulse/issues/) [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/sertxudeveloper/Pulse.svg)](http://isitmaintained.com/project/sertxudeveloper/Pulse "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/sertxudeveloper/Pulse.svg)](http://isitmaintained.com/project/sertxudeveloper/Pulse "Percentage of issues still open")





Basic Overview
------
**Pulse** is a web-based music player so you'll be able to play all the songs on your hard drive like you're in the cloud, it's an open source project so you can adapt, extend overwrite and to your needs. It's connected to MongoDB to generate your own Big Data while you're listening to music.
<br>

Installation
------
Before installing Pulse, you should know it requires a [MongoDB](https://www.mongodb.com/download-center/community) server with version 4.0 or above. The server should be at the address ``localhost:27017``, actually if you want to change this address you should fork this project and build your own executable.

Once you've got MongoDB installed, you're able to install Pulse in your computer. To download it go to the [Releases](https://github.com/sertxudeveloper/Pulse/releases) section or click [here](https://github.com/sertxudeveloper/Pulse/archive/release.zip) to download the latest version available.
<br>

Clone, Run and Build
------
To clone and run this application, you'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/download/) (which comes with npm) installed on your computer. From your command line:

```shell
# Clone this repository
$ git clone https://github.com/sertxudeveloper/Pulse

# Go into the repository
$ cd Pulse

# Install dependencies
$ npm install

# Run the app in development mode
$ npm run dev

# Build the app for your computer
$ npm run build
```

#### Additional information
If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use ``node `` from the command prompt.

If the error **Node Sass could not find a binding for your current environment** occurs, you should execute the command 
```shell
$ npm rebuild node-sass
```
<br>

Contributing
------
Pulse is a free and open source project, and we appreciate any help whether it's fixing bugs, improving documentation, or suggesting new features. Check out our [contributing guidelines](https://github.com/sertxudeveloper/Pulse/blob/master/CONTRIBUTING.md) if you're interested in helping!
<br>

Thanks to
------
<a href="https://github.com/SimulatedGREG/electron-vue" title="electron-vue">
<img width="60%" src="https://github.com/SimulatedGREG/electron-vue/raw/master/docs/images/logo.png">
</a>
<br>
<br>
<a href="https://developer.spotify.com/" title="Spotify for Developers">
<img src="https://developer.spotify.com/images/logos/s4d/black.svg" width="75%" />
</a>
