netdroid-andrunner
==================

Netdroid Andrunner is a javascript implementation of a board game.  The game is great, but this is also a nice excuse to learn various technologies.


Getting started
---------------
* clone the repository
* install node.js, gulp.js
* type 'npm install' to download dependencies
* type 'gulp serve' in command prompt
* open a (recent) browser at http://localhost:3000

Working on the code
-------------------
Look at gulpfile.js for more details on each task.  The two most important tasks are 'develop' and 'test'.
'gulp develop' will start the server in develop mode: watch the files, run tests when updated, ... 'gulp test' just runs the test suite.  Both of those tasks require the mocha test runner.

Technologies
------------
* ES6 (javascript 6): the client and server are written in javascript (server is run by node.js).  It is actually ES6 (mostly for classes and nice syntax), 
* traceur: to translate ES6 to regular JS,
* mocha: test runner. 
* gulp: to handle various tasks. I tried grunt, but gulp philosophy is easier for me.
* browserify:  the client code is modularized by browserify, so it is actually node-compatible (excellent for running tests, and to share code betweet client/server).  

Note that since this is quite a mix of new technologies, and since this is a personal project, support for older browser is not really a concern.  Especially since I try to use vanilla JS without jquery on the client side.


Documentation
-------------

More details on the source code architecture should be in the <a href="doc">documentation folder</a>
