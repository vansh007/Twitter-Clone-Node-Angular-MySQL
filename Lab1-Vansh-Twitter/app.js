
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions');

var index = require('./routes/index');
var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/signUp', routes.signUp);
app.post('/login', routes.login);
app.get('/home', routes.home);
app.get('/about', routes.about);
app.get('/getProfile', routes.getProfile);
app.post('/logout', routes.logout);
app.post('/search', routes.searchUser);
app.post('/followUs', routes.followUser);
app.post('/postFeed', routes.newsFeed);
app.post('/retweet1', routes.retweet);
app.get('/wallPost', routes.wall);
app.get('/getFollowing', routes.getFollowing);
app.get('/getFollowers', routes.getFollowers);
app.get('/workedu', routes.workedu);
app.post('/saveWorkEdu', routes.saveWorkEdu);
app.get('/contactInfo', routes.contactInfo);
app.post('/saveContactInfo', routes.saveContactInfo);
app.get('/overview', routes.overview);
app.get('/follower_count', routes.follower_count);
app.get('/tweet_count', routes.tweet_count);
app.get('/following_count', routes.following_count);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Twitter server listening on port " + app.get('port'));
});
