Folder structure
============================

Here is what the folder structure looks like:

<pre>
app/
	views/
	assets/
		styles/
		images/
	src/
		client/
		controllers/
		logger/
		server/
_build/
	db/
	es5-src/
	es5-test/
	static/
	views/
test/
doc/
config/
</pre>

Some notes:

* app/ is where the application is developped.  Everything is there: assets, css, javascript(es6), ...
* _build/ is where the build system will copy/transform every file of the application.  This is the folder in which the application is run, and it should be pretty much standalone.
* test/ is for the tests, obviously (later, will contain unit_tests/ and functional_tests/)
* doc/ (not really any need of explanation)
* config/ will contain all the meta data necessary to properly run the app, such as paths, db settings, and more importantly, the routes
