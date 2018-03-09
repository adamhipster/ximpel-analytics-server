const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const port = parseInt(process.argv[2]) || 3333;
const db = require('./db')

app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));


app.post('/savetodatabase', (req, res) => {
	const data = req.body.subject;
	if(data === undefined) return; //this route sometimes gets called without any data
	const subject = {
			subjectId: data.subjectId,
			startTime: data.startTime,
		};
	db.models.subject.create(subject)
	.then( (subject) => {
		for (let i = 0; i < data.mouseMoves.length; i++) {
			const maybeMouseMove = data.mouseMoves !== undefined? {
				x: data.mouseMoves[i].x,
				y: data.mouseMoves[i].y,
				appId: data.mouseMoves[i].appId,
				screenWidth: data.mouseMoves[i].screenWidth,
				screenHeight: data.mouseMoves[i].screenHeight,
				subjectId: subject.id
			} : null;
			const opts = undefined;
			db.models.mousemove.create(maybeMouseMove, opts);
		}
		for (let i = 0; i < data.mouseClicks.length; i++) {
			const maybeMouseClick = data.mouseClicks !== undefined? {
				x: data.mouseClicks[i].x,
				y: data.mouseClicks[i].y,
				appId: data.mouseClicks[i].appId,
				screenWidth: data.mouseClicks[i].screenWidth,
				screenHeight: data.mouseClicks[i].screenHeight,
				subjectId: subject.id
			} : null;
			const opts = undefined;
			db.models.mouseclick.create(maybeMouseClick, opts);
		}
		for (let i = 0; i < data.facialExpressionsHistory.length; i++) {
			const mabyeFacialExpressions = data.facialExpressionsHistory !== undefined? {
				anger: data.facialExpressionsHistory[i][0].value,
				sad: data.facialExpressionsHistory[i][1].value,
				surprised: data.facialExpressionsHistory[i][2].value,
				happy: data.facialExpressionsHistory[i][3].value,
				subjectId: subject.id
			} : null;
			const opts = undefined;
			db.models.facialexpression.create(mabyeFacialExpressions, opts);
		}
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
