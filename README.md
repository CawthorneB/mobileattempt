# mobileattempt - sorry I am github noob and dont have much time. This is proof of concept but don't use it for anything bad.
trying to solve mobile as a github noob

This includes a nodeJS server and basic nginx template (hardcoded - probably investigate ngx-lua or similar). 
The only thing of value is the use of puppeteer to scrape input fields then pass the coordinates of said fields to the nodeJS server which then relays the dimensions and X/Y offsets so they can be displayed over the vnc so it iOS reads it as a "real button click". Which makes buttons toggel the keyboard show on iOS - a problem I couldn't solve.
