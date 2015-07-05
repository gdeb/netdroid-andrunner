WARNING: This project is abandoned.  I hope to restart it someday, using other hype technologies, such as reactjs, mercury, FRP, ...

netdroid-andrunner
==================

Netdroid Andrunner is a javascript implementation of a board game.  The game is great, but this project is also a nice excuse to learn various technologies and to experiment with various types of ideas.


Getting started
---------------
* clone the repository
* install node.js, gulp.js
* type 'npm install' to download dependencies
* type 'gulp prepare' in command prompt (will 'compile' the project in the _build folder)
* type 'gulp serve' 
* open a (recent) browser at http://localhost:8080 (or whatever port is displayed in terminal)

Working on the code
-------------------
Look at gulpfile.js for more details on each task.  The two most important tasks are 'watch' and 'serve'.  Later, a test suite will be added and integrated with the gulp tasks.

Technologies
------------
* ES6 (javascript 6): the client and server are written in javascript (server is run by node.js).  It is actually ES6 (mostly for classes and nice syntax), 
* es6-transpiler: to translate ES6 to regular JS,
* mocha: test runner. Not yet done...
* gulp: to handle various tasks. I tried grunt, but gulp philosophy seems more powerful.
* browserify:  the client code is modularized by browserify, so it is actually node-compatible (excellent for running tests, and to share code between client/server).
* angularjs: for the powerful framework (single page application, directive, ...)
* bootstrap: css stuff.

Note that since this is quite a mix of new technologies, and since this is a personal project, support for older browser is not really a concern. 


Documentation
-------------

More details on the source code architecture should be in the <a href="doc">documentation folder</a>
