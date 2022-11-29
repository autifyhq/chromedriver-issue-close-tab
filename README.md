# chromedriver-issue-close-tab

This is a repository to demonstrate a chromedriver's bug that it crashes while executing a command.

## Issue Description

When the tab the webdriver focuses on is closed in the middle of executing a command, chromedriver unexpectedly terminates.

In the example this repository shows we send a Screenshot command, but you can reproduce it with other commands.

Environment

- chromedriver 107.0.5304.62
- reproduced on Mac

## How to reproduce it

Reproducible scenario in [main.js](./main.js):

1. webdriver visits https://autifyhq.github.io/chromedriver-issue-close-tab/
1. open a new tab by clicking the link
1. switch window to the new tab
1. click the "Close tab" button, which close the tab after 1 second
1. send many Screenshot commands so that the tab is closed while executing one of them

You can try it on the following instructions:

1. clone the repository
1. run `npm install`
1. run `npx chromedriver` to launch chromedriver
   - or you can run it with docker: `docker run --rm -it -p 9515:9515 selenium/standalone-chrome:4.6.0-20221104 chromedriver --allowed-ips=""`
1. run `node main.js`
1. you will see the script fails because chromedriver terminates during the script

https://user-images.githubusercontent.com/16313897/204481620-f1275ba9-4a0f-4e22-9c28-08b0a9ccf260.mov

If you run chromedriver with docker, you will see the error message `Segmentation fault` on terminating chromedriver.
