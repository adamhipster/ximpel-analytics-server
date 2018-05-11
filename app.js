const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = parseInt(process.argv[2]) || 3333;
const db = require('./db');
const session = require('express-session');

//enable CORS
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", 'http://localhost:8000');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

app.use(session({
	name: "ximpel.session.cookie",
	secret: process.env.SESSION_SECRET || "debug_test_value",
	rolling: true,
	saveUninitialized: true,
	resave: false,
	cookie: {
		httpOnly: true,
		path: '/',
		secure: false, //change to true if HTTPS
	}
}))

app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.post('/beginximpelsession', (req, res) => {
	db.models.users.findCreateFind({
		where: {
			sessionId: req.sessionID
		}
	})
	.catch( (error) => console.log("error occuring users.findCreateFind: " + error) )
  .spread((user, created) => {
		//more robust than getting it immediately from the session value
		db.query(`SELECT MAX(count) AS count FROM ximpelsessions WHERE "userId"=(SELECT id FROM users WHERE "sessionId"=:sessionId)`, 
		{ replacements: {
			sessionId: user.sessionId 
		}, 
		type: db.QueryTypes.SELECT })
		.then( (rows) => {
			//if user is created it is its first session in ximpel
			const count = created? 1: rows[0].count + 1;
			db.models.ximpelsessions.create({
				count: count,
				userId: user.id
			})
			.then( (ximpelSession) => {
				//save the ximpelsession count to the session as well
				req.session.count = count;
				req.session.ximpelsessionId = ximpelSession.id;
				console.log('/beginximpelsession', req.session.id, 'ximpel session count: ', count);
				res.send('beginximpelsession ACK');
			});
		});
  });
});

app.post('/savetodatabase', (req, res) => {
	const data = req.body.subject;
	if(data === undefined) return; //this route sometimes gets called without any data
	console.log('/savetodatabase', req.session.id, data.subjectId);
	const subject = {
		subjectId: data.subjectId,
		startTime: data.startTime,
		ximpelsessionId: req.session.ximpelsessionId
	};
	db.models.subjects.create(subject)
	.then( (subject) => {
		//warning using ternary operators in the conditional part of the for loops
		for (let i = 0; i < data.mouseMoves? data.mouseMoves.length : 0; i++) {
			const opts = undefined;
			db.models.mousemoves.create({
				x: data.mouseMoves[i].x,
				y: data.mouseMoves[i].y,
				appId: data.mouseMoves[i].appId,
				screenWidth: data.mouseMoves[i].screenWidth,
				screenHeight: data.mouseMoves[i].screenHeight,
				subjectId: subject.id
			}, opts);
		}
		for (let i = 0; i < data.mouseClicks? data.mouseClicks.length : 0; i++) {
			const opts = undefined;
			db.models.mouseclicks.create({
				x: data.mouseClicks[i].x,
				y: data.mouseClicks[i].y,
				appId: data.mouseClicks[i].appId,
				screenWidth: data.mouseClicks[i].screenWidth,
				screenHeight: data.mouseClicks[i].screenHeight,
				subjectId: subject.id
			}, opts);
		}
		for (let i = 0; i < data.facialExpressionsHistory? data.facialExpressionsHistory.length : 0; i++) {
			const opts = undefined;
			db.models.facialexpressions.create({
				anger: data.facialExpressionsHistory[i][0].value,
				sad: data.facialExpressionsHistory[i][1].value,
				surprised: data.facialExpressionsHistory[i][2].value,
				joy: data.facialExpressionsHistory[i][3].value,
				subjectId: subject.id
			}, opts);
		}
		res.send('/savetodatabase ACK');
		return;
	})
	.catch( (error) => {
		console.log("error occuring: " + error);
		return error;
	});
});

const server = app.listen(port, () => {
	console.log(`listening on ${server.address().port}`);
	console.log(db.models);
});
