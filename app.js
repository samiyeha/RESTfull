var express = require('express');
//express - This one is quite obvious. It imports the framework into your app
var path = require('path');
//is a core Node module for working with and handling paths.
/*
A good example is the path.join() method. This will normalise all the arguments into a path string. This can come in really handy using the __dirname global and a folder / file.

app.set('views', path.join(__dirname, 'views'));  
This will set your apps view folder to something like: 
/Users/jilles/Project/myApp/views

The path module won't actually check if it's an existing path. It's mainly used to transform path strings.
*/
var favicon = require('serve-favicon');
/*
serve-favicon is Express middleware for serving a 
favicon. The advantage over just a normal favicon.ico on 
your public/ directory is that this module also deals with
 cache control. You can remove this module if you like because Express doesn't depend on it.
*/
var logger = require('morgan');
/*
morgan is Express middleware for logging requests and 
responses. I like to use it during development and only 
during development so you can see what requests are being 
made. You can also remove this module without any consequences.
*/
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
/*
cookie-parser is Express middleware that helps you 
with handling cookies. Your request object will have a 
cookies object which you can acces use in your app. If 
your app doesn't use cookies you can leave it out.

body-parser is Express middleware you probably want to use if you're doing anything with forms. It will add a body object to your request so that you can access POST parameters.
*/
var index = require('./routes/index');
var users = require('./routes/users');
var videos = require('./routes/videos');

/*
routes / users /videios are two dummy pages to show you 
how routing works. You could do all the routing 
in app.js but it will get messy as your application gets bigger.

That's it for the requires! You can always add 
more yourself or leave out some that you don't like or need.
*/
var app = express();




/*A View Engine
*/
// view engine setup

/*A View Engine
These 2 lines set the views folder and the view engine.

We've already discussed the path.join() part so by now you now 
that it tells Express to use the /views folder in your app 
directory.

The second app.set() tells Express to use the Jade 
templating engine. To give you an idea how Jade looks
 take a look at the image below taken from the Jade website.

It simplifies your HTML files and gives you conditionals which 
are really handy. You can choose not to render the login section 
when a user is already logged in for example.

Instead of saving your files as .html, you'll now have 
to save them as .jade in your /views folder.
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

/*
app.use()
This method tells the app to use 
the parameters you're giving it. This can 
be a function or a path and a function. The 
capabilities are beyond the scope of this blog post. 
If you're really curious check out the documentation.

I'll go over the default app.use() calls in app.js. 
You can probably tell what they do by now because we 
went over the requires.
*/
app.use(logger('dev'));
/*
logger('dev') logs the requests to the console as seen 
above. The dev parameter means it will log a lot of 
information about the request such as the method, status 
code and response time.
*/
app.use(bodyParser.json());
/*
bodyParser.json() gives your app the ability 
to parse JSON. This is necessary for when you're 
sending data (which you probably will with a 
JavaScript application) in JSON format.

A common use of JSON is to exchange data to/from a web server.

When receiving data from a web server, the data is always a string.

Parse the data with JSON.parse(), and the data becomes a 
JavaScript object.

Example - Parsing JSON
Imagine we received this text from a web server:

'{ "name":"John", "age":30, "city":"New York"}'
Use the JavaScript function JSON.parse() to convert 
text into a JavaScript object:

var obj = JSON.parse('{ "name":"John", "age":30, "city":"New York"}');
*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//cookieParser() adds an cookie object to all the requests you get.
app.use(express.static(path.join(__dirname, 'public')));
/*
express.static(path.join(__dirname, 'public')) 
tells your app to use the /public directory where 
you store images, stylesheets and scripts.
*/







/*
Next up are two routing methods. 
You can see that they're different from the 
ones above because they have 2 parameters instead of one.

The first parameter is the path, 
the second one is the function to execute. 
We separate the routes from the app.js because 
we don't want our app to be one big mess. Separating 
files in Node makes use of module.exports. I'll get to 
that in a bit.
*/
app.use('/', index);
app.use('/users', users);
app.use('/api/videos', videos);
// catch 404 and forward to error handler
/*
In Express a 404 is not the 
result of an error but rather the app 
running out of options. Once the request 
doesn't match any of the routes, it will
 reach the following function.
 This will throw a new error (404) and
  pass it on the the app using next().
*/

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

/*
Error handlers
When you're developing an Express app, you're
 going to make a few mistakes. Just like in any 
 other programming language / framework. However 
 some errors are really useful to you because you're
  a developer but might also be useful to someone with
   bad intentions. That's why we don't want to print a "stack 
   trace" error when we're in production.
*/
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



/*module.exports
Remember that require function?
 That makes use of the module.exports! 
 When you want to use some variables or 
 functions from another file, you attach them 
 to the module.exports.

*/

module.exports = app;
