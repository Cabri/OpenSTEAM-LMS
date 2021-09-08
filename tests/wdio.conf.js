exports.config = {
    runner: 'local',
    specs: [
        './integration/specs/**/switch.mode.js'
    ],
    exclude: [
    ],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
/*        'goog:chromeOptions': {
            args: ["--headless", "--disable-gpu", '--no-sandbox', "--verbose","--window-size=1440,735"]
        },*/
        acceptInsecureCerts: true
    }],
    logLevel: 'silent',
    bail: 0,
    baseUrl: 'http://steamlms:7080',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
