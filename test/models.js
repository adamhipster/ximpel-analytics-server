const Sequelize = require('sequelize');
db = new Sequelize( 
  process.env.XIMPEL_TEST_DB_NAME || 'default_debug_test_database_name', 
  process.env.POSTGRES_USER || 'default_debug_user', 
  process.env.POSTGRES_PASSWORD || 'default_debug_password', {
  dialect: 'postgres',
  // logging: false //disable logging (1000s of SQL statements)
});

db.authenticate().catch(x => console.log(x)).then(x => console.log('>> database connection established'));

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

module.exports = db;