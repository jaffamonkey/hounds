'use strict'

const hounds = require('../')
const quarry = hounds.writers.error()
const logTo = hounds.writers.url()

let i = 1000

const hunt = hounds.release({
    url: 'http://localhost:8111',
    maxFollows: 25,
    waitAfterLoadedFor: 5000,

    before: nightmare => {
        return nightmare
            .viewport(1200, 800)
            .goto('http://localhost:8111/user/login')
            .type('input[name=name]', process.env.HOUNDS_EXAMPLE_AUTH_USER)
            .type('input[name=pass]', process.env.HOUNDS_EXAMPLE_AUTH_PASS)
            .click('input[name=op]')
            .wait(2000)
    },
    after: nightmare => {
        return nightmare
            .goto('http://localhost:8111/user/logout')
    },
    screenshot: (url) => {
        return `${process.cwd()}/${i++}_${url.replace(/[^\w]/g, '-')}.png`
    },
    keepAlive: true,
    logTo,
    urlFilter: (url, domainFiltered) => {
        return /\#./.test(url) && domainFiltered
    },
    nightmare: {
        show: true, openDevTools: true
    }
})
.on('error', err => {
    console.error(err)
    process.exit()
})
.on('end', process.exit)

hunt.pipe(quarry)
