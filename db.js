const Sequelize = require('sequelize');

db = new Sequelize( 
  process.env.XIMPEL_DB_NAME || 'default_debug_test_database_name', 
  process.env.POSTGRES_USER || 'default_debug_user', 
  process.env.POSTGRES_PASSWORD || 'default_debug_password', {
  dialect: 'postgres',
  logging: false //set to true if you want to see all the queries
});

db.authenticate().catch(x => console.log(x)).then(x => console.log('>> database connection established'));

//Data model layout
// {subjectId: "lesson1", startTime: 1511181193650, mouseMoves: Array(11), mouseClicks: Array(0), facialExpressionsHistory: Array(0)}
// {x: 542, y: 127, appId: "ximpel1", screenWidth: 640, screenHeight: 360}
// FacialExpression
// 0:{emotion: "angry", value: 0.08495773461377512}
// 1:{emotion: "sad", value: 0.05993173506165729}
// 2:{emotion: "surprised", value: 0.054032595527500206}
// 3:{emotion: "happy", value: 0.18562819815754616}

//SubjectId - string
//StartTime - integer
//mouseClick (and same for mouseMove)
	// x - integer
	// y - integer
	// appId - string
	// screenWidth - integer
	// screenHeight - integer
//facialExpression
	//anger value
	//sad value
	//surprised value
	//happy value

//Models / Tables
//subjects
//mouseclicks
//mouse moves
//facialexpressions

const globalOptions = 	{
  paranoid: true,
  // from the Sequelize documentation -- http://docs.sequelizejs.com/manual/tutorial/models-definition.html
  // disable the modification of table names; By default, sequelize will automatically
  // transform all passed model names (first argument of define) into plural.
  freezeTableName: true,
}

//DEFINITIONS
const XimpelSession = db.define('ximpelsessions', {
  count: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
globalOptions);

const User = db.define('users', {
  sessionId: {
    type: Sequelize.STRING,
    allowNull: false,
  }
},
globalOptions);

const Subject = db.define('subjects', {
	subjectId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	startTime: {
		type: Sequelize.BIGINT,
		allowNull: false,	
	},
},
globalOptions);

const MouseClick = db.define('mouseclicks', {
  x: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  y: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  appId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  screenWidth: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  screenHeight: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
},
globalOptions);

const MouseMove = db.define('mousemoves', {
  x: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  y: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  appId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  screenWidth: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  screenHeight: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
},
globalOptions);

const FacialExpression = db.define('facialexpressions', {
  anger: {
    type: Sequelize.DOUBLE,
    allowNull: true,
  },
  sad: {
    type: Sequelize.DOUBLE,
    allowNull: true,
  },
  surprised: {
    type: Sequelize.DOUBLE,
    allowNull: true,
  },
  joy: {
    type: Sequelize.DOUBLE,
    allowNull: true,
  },
},
globalOptions);

//RELATIONS
//User ownership
User.hasMany(XimpelSession);
XimpelSession.belongsTo(User);

//XimpelSession ownership
XimpelSession.hasMany(Subject);
Subject.belongsTo(XimpelSession);

//Subject ownership
Subject.hasMany(MouseClick);
Subject.hasMany(MouseMove);
Subject.hasMany(FacialExpression);

MouseClick.belongsTo(Subject);
MouseMove.belongsTo(Subject);
FacialExpression.belongsTo(Subject);

//PRODUCTION DB START
// db.sync()
// .catch( (error) => console.log("error occuring: " + error) );

//DEVELOPMENT DB START
db.sync({force:true})
.catch( (error) => console.log("error occuring: " + error) );

module.exports = db;