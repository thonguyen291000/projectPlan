# COMP1682 Project

# Application description
This is a hybrid app used as a platform allowing users to commnunicate with each other. There are two part in this source client-side and server-side. In briefly, I use ReactJS to build the app front-end, NodeJS to develop the back-end, and the Ionic flatform to make it become a hybrid app.

## Prerequisite
Here are some technical requirments that you must have to run the app successfully.
1. Package mananger (yarn v1.22.5)
2. Nodejs  v14.15.1
3. Command line interface (Git v2.29.2)
4. Docker platform
## Installation
#### To sure that everything is clear, I give you some tips to prepare all prerequistes as good as possible.
1. YARN package manager and Nodejs:
  > To set up both, you need to download NodeJS installer at [NodeJS Website](https://nodejs.org/en/) and install it normally.
  > After that, you visit [Yarn Page](https://classic.yarnpkg.com/en/docs/install#debian-stable) to see the instructions for installing YARN package manager.
2. Git CLI:
  > To install Git CLI, you will visit [Git Pages](https://git-scm.com/downloads). Then, you download with suitable operating system and install it.
3. Docker platform:
  > For the Docker, you can visit [Docker Page](https://docs.docker.com/get-docker) to get the instructions for each operating system.
 ## How to run
 #### After preparing prerequisites completely, I show you steps to run my app on your workplace. 
 ###### Server-side
  - After clone the source code, you open the extracted folder, open the Git CLI in it, and type the following statement:
  ```
  docker-compose up
  ```
 ###### Client-side
  - After running up the server-side, in the Git CLI, you type two below statements: 
  ```
  cd web-ui
  yarn
  ```
  - Secondly, you continue typing the below statement:
  ```
  yarn start
  ```
  - Finally, you go to [the link](http://localhost:3000) to load the application.

