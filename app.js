var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var documentation = require('./routes/documentation');
var evolution = require('./routes/evolution');
var startup = require('./routes/startup');
var validation = require('./routes/validation');
var client = require('./routes/clientServices');
var login = require('./routes/login');
var adminLogin = require('./routes/adminLogin');
var referenceRoutes = require('./routes/referenceRoutes');
var listener = require('./routes/listener');
var config = require('./routes/config');
var fs = require('fs');
var jsonfile = require('jsonfile');
var app = express();
// var watch = require('node-watch');
var shell = require('shelljs');
var router = express.Router();
var proxy = require('express-http-proxy');
var shell = require('shelljs');
var session = require('express-session');
var escapeHtml = require('escape-html');

const apiMetrics = require('prometheus-api-metrics');
app.use(apiMetrics());

var url = process.argv[4]+":" + (process.argv[3] || 3030) + "/connectorData/sparql"

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
console.log(url)
app.locals.fusekiURL = process.argv[4];
app.locals.fusekiPortNumber = process.argv[3] || 3030;

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

var auth = 'Basic ' + new Buffer('admin:indasp123!').toString('base64')
var sparqlServer = require('./routes/sparqlServer');

global.FusekiURL = process.argv[4];
global.fusekiPortNumber = process.argv[3];


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// no caching
app.use(function(req, res, next) {
  res.header('Cache-Control',
    'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});


app.locals.isExistSyntaxError = "false";
var ErrorsFilePath = __dirname + '/jsonDataFiles/syntaxErrors.json';

function readSyntaxErrorsFile() {
  if (fs.existsSync(ErrorsFilePath)) {
    var data = fs.readFileSync(ErrorsFilePath);
    if (data.toString().includes('1')) {
      app.locals.isExistSyntaxError = "true";
    } else {
      app.locals.isExistSyntaxError = "false";
    }
  }
}
readSyntaxErrorsFile();
// check if the userConfigurations file is exist
// for the first time of app running
var userConfigurationsFile = __dirname +
  '/conf/config.json';
var repositoryURL = "";
app.locals.projectTitle = "MobiVoc";
app.locals.userConfigurations = Array(7).fill(true);
app.locals.isExistAdminAccount = false;
app.locals.repositoryURL = "";
app.locals.repoParam = Array(3).fill("");

function readUserConfigurationFile() {
    if (fs.existsSync(userConfigurationsFile)) {
	var data = fs.readFileSync(userConfigurationsFile);
	if (data.includes('vocabularyName')) {
	    obj = jsonfile.readFileSync(userConfigurationsFile);
	    var menu = Array(7).fill(false);
	    var repoParam = Array(3).fill("");
	    var loginUserName = "";
	    var adminAccount = "";
	    for (const [k, dummy] of Object.entries(obj)) {
		if (k === "vocabularyName") {
		    // store projectTitle to be used by header.ejs
		    app.locals.projectTitle = obj[k];
		} else if (k === "repositoryURL") {
		    // store repositoryURL to be checked if it was uploaded
		    // for first time or was changed to another repository
		    repositoryURL = obj[k];
		    app.locals.repositoryURL = obj[k];
		} else if (k === "repositoryOwner") { //repoParam[0]
		    repoParam[0] = obj[k];
		} else if (k === "repositoryName") { //repoParam[1]
		    repoParam[1] = obj[k];
		} else if (k === "branchName") { //repoParam[2]
		    repoParam[2] = obj[k];
		} else if (k === "turtleEditor" && obj[k] === "true") { //menu[0]
		    menu[0] = true;
		} else if (k === "documentationGeneration" && obj[k] === "true") { //menu[1]
		    menu[1] = true;
		} else if (k === "visualization" && obj[k] === "true") { //menu[2]
		    menu[2] = true;
		} else if (k === "sparqlEndPoint" && obj[k] === "true") { //menu[3]
		    menu[3] = true;
		} else if (k === "evolutionReport" && obj[k] === "true") { //menu[4]
		    menu[4] = true;
		} else if (k === "analytics" && obj[k] === "true") { //menu[5]
		    menu[5] = true;
		} else if (k === "infomationProtectionAgreement") {
		    if (obj['text2'] != "") {
			var dataProtectionHtmlPage = '<% include header.ejs %><div style="margin-top: 3% !important;"></div><div class="ui grid"><div class="ui container">'
			dataProtectionHtmlPage += obj['text2'];
			dataProtectionHtmlPage += '</div></div><% include footer .ejs%>';
			fs.writeFileSync(__dirname + '/views/dataProtection.ejs',
					 dataProtectionHtmlPage, {
					     encoding: 'utf8',
					     flag: 'w'
					 });
		    }
		    if (obj['text3'] != "") {
			menu[6] = true;
			fs.writeFileSync(__dirname +
					 '/views/dataProtectionScript.ejs', obj['text3'], {
					     encoding: 'utf8',
					     flag: 'w'
					 });
		    }
		} else if (k === "loginUserName") {
		    loginUserName = obj[k];
		} else if (k === "adminUserName") {
		    adminAccount = obj[k];
		}
	    }
	    app.locals.userConfigurations = menu;
	    app.locals.repoParam = repoParam;
	    // check if the admin select private mode access of instace
	    if (loginUserName)
		app.locals.authRequired = true;
	    else
		app.locals.authRequired = false;
	    // save local variable about existing of admin account
	    if (adminAccount)
		app.locals.isExistAdminAccount = true;
	    else
		app.locals.isExistAdminAccount = false;
	}
    }
}

readUserConfigurationFile();

// check if the user has an error and this was for first time or
// when user has changed to another repositoryURL
// currentrepositoryURL === "" means it is the first time
var currentrepositoryURL = "";
var repoFolderPath = "../repoFolder";
if (fs.existsSync(repoFolderPath)) {
  currentrepositoryURL = shell.exec('git ls-remote --get-url', {
    silent: true
  }).stdout;
  shell.cd('../vocol', {
    silent: false
  }).stdout;
}

app.use(session({
  secret: 'secretC44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    maxAge: 10 * 30 * 1000
  }
}));


// redirect to /config for first time if userConfigurations.json does not exsit
app.get('*', function(req, res, next) {
  var userConfigurationsFile2 = __dirname +
    '/conf/config.json';
  var data = fs.readFileSync(userConfigurationsFile2, "utf8");
  if (!data.includes("adminUserName"))
    res.render('config', {
      title: 'Configuration Page',
      inputComponentsValues: "",
      data: {},
      errors: {}
    });
  else {
    next();
  }
});

// routing to the available routes on the app
app.use(['\/\/', '/'], routes);
app.use(['\/\/documentation', '/documentation'], documentation);
app.use(['\/\/webvowlLink', '/webvowlLink'], express.static(path.join(__dirname,
  "views/webvowl")));
app.use(['\/\/turtleEditorLink', '/turtleEditorLink'], express.static(path.join(
  __dirname, "views/editor")));
// app.use(['\/\/analyticsLink', '/analyticsLink'], express.static(path.join(
//   __dirname, "views/d3sparql")));
app.use(['\/\/evolution', '/evolution'], evolution);
app.use(['\/\/startup', '/startup'], startup);
app.use(['\/\/validation', '/validation'], validation);
app.use(['\/\/client', '/client'], client);
app.use(['\/\/listener', '/listener'], listener);
app.use(['\/\/login', '/login'], login);
app.use(['\/\/adminLogin', '/adminLogin'], adminLogin);
app.use(['\/\/config', '/config'], config);
app.use(['\/\/sparqlServer', '/sparqlServer'], sparqlServer);


app.use(['\/\/fuseki/', '/fuseki/'], proxy(app.locals.fusekiURL + ':' + app.locals.fusekiPortNumber + '/', {
    proxyReqPathResolver: function(req) {
      if (req.method === 'POST')
        return require('url').parse(req.url).path + "?query=" + escape(
            req.body.query);
      else
        return require('url').parse(req.url).path;
    }
  }));

app.get(['\/\/analytics', '/analytics'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('analytics', {
      title: 'Analytics'
    });
})

app.get(['\/\/editor', '/editor'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('editor', {
      title: 'Editing'
    });
})

app.get(['\/\/visualization', '/visualization'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('visualization', {
      title: 'Visualization'
    });
})

app.get(['\/\/querying', '/querying'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('querying', {
      title: 'Querying'
    });
});


app.get(['\/\/Imprint', '/Imprint'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('Imprint', {
      title: 'Imprint'
    });
});


app.get(['\/\/dataProtection', '/dataProtection'], function(req, res) {
  if (!req.session.isAuthenticated && req.app.locals.authRequired)
    res.render('login', {
      title: 'login',
      hash: ""
    });
  else
    res.render('dataProtection', {
      title: 'dataProtection'
    });
});


app.get(['\/\/checkErrors', '/checkErrors'], function(req, res, next) {
  readSyntaxErrorsFile();
  res.send(app.locals.isExistSyntaxError);
  res.end();
});

app.get(['\/\/getRepoInfo', '/getRepoInfo'], function(req, res, next) {
  readUserConfigurationFile();
  res.send(app.locals.repoParam);
  res.end();
});

// catch something else
app.use(['//*', '*'], referenceRoutes);

// monitor ErrorsFilePath
//TODO: stop monitor of jsonfiles changes
// watch(ErrorsFilePath, {
//   recursive: true
// }, function(evt, name) {
//   if (evt == 'update') {
//     // call if SyntaxErrors file was changed
//     readSyntaxErrorsFile();
//   }
// });

// monitor change of userConfigurationsFile
// watch(userConfigurationsFile, {
//   recursive: true
// }, function(evt, name) {
//   if (evt == 'update') {
//     // call if userConfigurations file was changed
//     readUserConfigurationFile();
//   }
// });


function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});


module.exports = app;
