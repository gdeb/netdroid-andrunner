netdroid-andrunner
==================

Netdroid Andrunner is a javascript implementation of a board game.  This is a nice excuse to learn various technologies.


Getting started
---------------
* clone the repository
* install node.js, gulp.js
* type 'npm init' to download dependencies
* type 'gulp serve' in command prompt
* open a (recent) browser at http://localhost:3000

Working on the code
-------------------
Look at gulpfile.js for more details on each task.  The two most important tasks are 'develop' and 'test'.
'gulp develop' will start the server in develop mode: watch the files, run tests when updated, ... 'gulp test' just runs the test suite.  Both of those tasks require the mocha test runner.

Technologies
------------
The client and server are written in javascript (server is run by node.js).  The javascript code is actually ES6 (mostly for classes and nice syntax), translated to regular JS by traceur.  The test runner is mocha.  Task handling is done by gulp.  Also, an important point is that the client code is modularized by browserify, so it is actually node-compatible (excellent for running tests)

Note that since this is quite a mix of new technologies, and since this is a personal project, support for older browser is not really a concern.  Especially since I try to use vanilla JS without jquery on the client side.


Documentation
-------------

More details on the source code architecture should be in the <a href="doc">documentation folder</a>
