const db = require('./models');

//PRODUCTION DB START
// db.sync()
// .catch( (error) => console.log("error occuring: " + error) );

//DEVELOPMENT DB START

db.sync({force:true})

// =============
// DATA CREATION
// =============

//first test user
.then( () => {
  return db.models.users.create({
    sessionId: "1337_session"
  });
})
.catch( (error) => console.log("error occuring first test user: " + error) )
//first session
.then( (user) => {
  return db.models.ximpelsessions.create({
    count: 1,
    userId: user.id
  });
})
.catch( (error) => console.log("error occuring first session: " + error) )
.then( (ximpelSession) => {
  return db.models.subjects.bulkCreate([
    {
      subjectId: "lesson 1",
      startTime: 0,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 2",
      startTime: 1,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 3",
      startTime: 2,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 4",
      startTime: 3,
      ximpelsessionId: ximpelSession.count
    },
  ], {returning: true}); //returning: true is needed for automatic id generation
})
.catch( (error) => console.log("error occuring subjects bulkcreate: " + error) )
.then( (subjects) => {
  for(let i = 0; i < subjects.length; i++){

    //between 5 to 10 clicks per subject
    const mouseClickLength = 5 + i;
    for(let j = 0; j < mouseClickLength; j++){
      db.models.mouseclicks.create({
        x: 10 * j,
        y: ~~(2 * j + (j * j)), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //between 100 to 250 mouse moves per subject
    const mouseMoveLength = 100 + 50 * i;
    for(let j = 0; j < mouseMoveLength; j++){
      db.models.mousemoves.create({
        x: 4 * j,
        y: ~~(2 * j + (j * j) * 0.01), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //about the same for facial expressions
    const facialExpressionLength = 150 + 65 * i;
    for(let j = 0; j < facialExpressionLength; j++){
      db.models.facialexpressions.create({
        anger: 0.25 + j * 0.0015,
        sad: 0.50 + j * 0.00115,
        surprised: 0.75 - j * 0.0015,
        joy: 1.00 - j * 0.0015,
        subjectId: subjects[i].id
      });
    }
  }
})
.catch( (error) => console.log("error occuring creating behavioral data: " + error) )

//second session
.then( () => {
  return db.models.users.findOne({
    where: {
      sessionId: "1337_session"
    }
  })
})
.catch( (error) => console.log("error occuring 2nd session finding users: " + error) )
.then( (user) => {
  return db.models.ximpelsessions.create({
    count: 2,
    userId: user.id
  });
})
.catch( (error) => console.log("error occuring 2nd session creating session: " + error) )
.then( (ximpelSession) => {
  return db.models.subjects.bulkCreate([
    {
      subjectId: "lesson 1",
      startTime: 0,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 2",
      startTime: 1,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 3",
      startTime: 2,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 4",
      startTime: 3,
      ximpelsessionId: ximpelSession.count
    },
  ], {returning: true}); //returning: true is needed for automatic id generation
})
.catch( (error) => console.log("error occuring 2nd session subjects bulkcreate: " + error) )
.then( (subjects) => {
  for(let i = 0; i < subjects.length; i++){

    //between 5 to 10 clicks per subject
    const mouseClickLength = 5 + i;
    for(let j = 0; j < mouseClickLength; j++){
      db.models.mouseclicks.create({
        x: 10 * j,
        y: ~~(2 * j + (j * j)), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //between 100 to 250 mouse moves per subject
    const mouseMoveLength = 100 + 50 * i;
    for(let j = 0; j < mouseMoveLength; j++){
      db.models.mousemoves.create({
        x: 4 * j,
        y: ~~(2 * j + (j * j) * 0.01), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //about the same for facial expressions
    const facialExpressionLength = 150 + 65 * i;
    for(let j = 0; j < facialExpressionLength; j++){
      db.models.facialexpressions.create({
        anger: 0.25 + j * 0.0015,
        sad: 0.50 + j * 0.00115,
        surprised: 0.75 - j * 0.0015,
        joy: 1.00 - j * 0.0015,
        subjectId: subjects[i].id
      });
    }
  }
})

//second test user
.then( () => {
  return db.models.users.create({
    sessionId: "42_session"
  });
})
.catch( (error) => console.log("error occuring second test user: " + error) )
.then( (user) => {
  return db.models.ximpelsessions.create({
    count: 1,
    userId: user.id
  });
})
.catch( (error) => console.log("error occuring first session, second test user: " + error) )
.then( (ximpelSession) => {
  return db.models.subjects.bulkCreate([
    {
      subjectId: "lesson 1",
      startTime: 0,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 2",
      startTime: 3,
      ximpelsessionId: ximpelSession.count
    },
    {
      subjectId: "lesson 3",
      startTime: 8,
      ximpelsessionId: ximpelSession.count
    }
  ], {returning: true}); //returning: true is needed for automatic id generation
})
.catch( (error) => console.log("error occuring subjects bulkcreate, second test user: " + error) )
.then( (subjects) => {
  for(let i = 0; i < subjects.length; i++){

    //between 5 to 10 clicks per subject
    const mouseClickLength = 1 + i;
    for(let j = 0; j < mouseClickLength; j++){
      db.models.mouseclicks.create({
        x: 30 * j,
        y: ~~(20 * j + (j * j)), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //between 10 to 50 mouse moves per subject
    const mouseMoveLength = 10 + 5 * i;
    for(let j = 0; j < mouseMoveLength; j++){
      db.models.mousemoves.create({
        x: 30 * j,
        y: ~~(20 * j + (j * j)), //~~ inverses the 32 bits and then again! Casts implicitly to an int
        appId: "XIMPEL_TEST",
        screenWidth: 1920,
        screenHeight: 1080,
        subjectId: subjects[i].id
      });
    }

    //about the same for facial expressions
    const facialExpressionLength = 150 + 65 * i;
    for(let j = 0; j < facialExpressionLength; j++){
      db.models.facialexpressions.create({
        anger: 0.1 + j * 0.0015,
        sad: 0.15 + j * 0.00115,
        surprised: 0.45 + j * 0.0015,
        joy: Math.min(1, 0.9 + j * 0.0075),
        subjectId: subjects[i].id
      });
    }
  }
})

.catch( (error) => console.log("error occuring: " + error) );

setTimeout( () => {
  process.exit();
}, 5000)