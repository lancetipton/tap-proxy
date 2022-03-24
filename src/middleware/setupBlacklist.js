const path = require('path')
const { getApp } = require('PRApp')
const blacklist = require('express-blacklist')
const expressDefend = require('express-defend')

const tempDir = path.join(__dirname, `../../temp`)

const setupBlacklist = () => {
  const app = getApp()

  app.use(blacklist.blockRequests(path.join(tempDir, `blacklist.txt`)))

  app.use(expressDefend.protect({
    maxAttempts: 5,
    dropSuspiciousRequest: true,
    logFile: path.join(tempDir, `suspicious.log`),
    onMaxAttemptsReached: (ipAddress, url) => {
      blacklist.addAddress(ipAddress)
    }
  }))

}

module.exports = {
  setupBlacklist
}