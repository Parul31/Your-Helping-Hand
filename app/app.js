var express = require('express'),
	app = express(),
	path = require('path'),
	mongo = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	multiparty = require('connect-multiparty'),
	session = require('express-session'),
	url = 'mongodb://localhost:27017/yourhelpinghand',
	Home = require('./controllers/Home')
	Login = require('./controllers/Login')
	Register = require('./controllers/Register')
	Profile = require('./controllers/Profile')
	Logout = require('./controllers/Logout')
	UploadPic = require('./controllers/UploadPic')
	Admin = require('./controllers/Admin'),
	CPanel = require('./controllers/CPanel'),
	AdminLogout = require('./controllers/AdminLogout'),
	Schedule = require('./controllers/Schedule'),
	AppointmentConf = require('./controllers/AppointmentConfirmation'),
	FinalizeSchedule = require('./controllers/FinalizeSchedule')

app.set('views', __dirname + '/templates/html')
app.set('view engine', 'hjs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
	secret: 'your-helping-hand',
	resave: true,
	saveUninitialized: true
	}))
app.use(multiparty())
app.use(express.static(path.join(__dirname, 'templates')))

mongo.connect(url, function (err, db) {
	if (err) {
		console.log('Sorry, there is no mongo db server running.')
		throw err
	} else {
		var attachDB = function (req, res, next) {
			req.db = db
			next()
		}
		app.all('/', function (req, res, next) {
			Home.run(req, res, next)
		})
		app.all('/login', attachDB, function (req, res, next) {
			Login.run(req, res, next)
		})
		app.all('/register', attachDB, function (req, res, next) {
			Register.run(req, res, next)
		})
		app.all('/profile/:id', attachDB, function (req, res, next) {
			Profile.run(req, res, next)
		})
		app.all('/edit', attachDB, function (req, res, next) {
			Profile.edit(req, res, next)
		})
		app.get('/logout', function (req, res, next) {
			Logout.run(req, res, next)
		})
		app.all('/:name/upload', function (req, res, next) {
			UploadPic.run(req, res, next)
		})
		app.all('/admin', attachDB, function (req, res, next) {
			Admin.run(req, res, next)
		})
		app.get('/cpanel', function (req, res, next) {
			CPanel.run(req, res, next)
		})
		app.post('/cpanel', attachDB, function (req, res, next) {
			CPanel.uploadEmployeeDetails(req, res, next)
		})
		app.get('/search', attachDB, function (req, res, next) {
			CPanel.getEmployeeDetails(req, res, next)
		})
		app.get('/employee', attachDB, function (req, res, next) {
			CPanel.renderEmployeeDetails(req, res, next)
		})
		app.get('/checkAvailability', attachDB, function (req, res, next) {
			CPanel.checkEmpAvailability(req, res, next)
		})
		app.get('/searchAll', attachDB, function (req, res, next) {
			CPanel.getAllEmployeeDetails(req, res, next)
		})
		app.all('/remove/:id', attachDB, function (req, res, next) {
			CPanel.removeServiceDetails(req, res, next)
		}, function (req, res, next) {
			CPanel.removeEmployeeDetails(req, res, next)
		})
		app.all('/adminLogout', function (req, res, next) {
			AdminLogout.run(req, res, next)
		})
		app.post('/schedule', attachDB, function (req, res, next) {
			Schedule.run(req, res, next)
		}, function (req, res, next) {
			FinalizeSchedule.run(req, res, next)
		}, function (req, res) {
			AppointmentConf.run(req, res)
		})
		app.get('/appConfirmation', attachDB, function (req, res, next) {
			AppointmentConf.displayConfirmation(req, res, next)
		})
		app.listen(3000, function() {
			console.log(
				'Successfully connected to mongodb://localhost:27017' +
				'\nExpress server listening on port 3000'
			)
		})
	}
})