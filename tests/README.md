# OpenSTEAM integration tests

the tests are based on [webrdriverio](https://webdriver.io) and aim at covering all functions through selenium-based browser tests connected to a functioning opensteam.

## Prerequisite :
- Make sure your modules are install for that execute `npm intall` in `/tests` folder
- Make sure `steamlms` is in your host file
- Make sure OpenSTEAM is running on your device
- adjust e.g. URL in wdio.conf.js or user-names in .env



## How launch all integration tests ?

Step 1 : In terminal go to `/tests` of this project.

Step 2 : Execute `npx wdio`

Step 3 : Check result


## How to launch a single integration test?

e.g. 

`npx wdio run wdio.conf.js --spec integration/specs/update.classroom.js`



## Enhancements

* Auto-detect the environment and decide to run headless or not
* Bring back registration to work!
* Activity tests all fail currently: they need to be updated for the Cabri-Express and Cabri-Express-Genius type of activities, the other having disappeared for now.
* ..