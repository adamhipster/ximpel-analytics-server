const db = require('./models');
const expect = require('chai').expect;

//works in conjunction with fill_db_with_data.js, which needs to be run first.

describe('start testing', () => {
  before( (done) => {
    db.sync()
    .then( () => {
      return db.models.users.destroy({
        where: {
          sessionId: "13_session"
        }
      });
    })
    .then( () => {
      done();
    })
  });

  describe('/beginximpelsession', () => {

    it('should find users in the database that exist', (done) => {
      db.models.users.findCreateFind({
        where: {
          sessionId: "1337_session"
        }
      })
      .spread( (user, created) => {
        expect(created).to.equal(false);
        done();
      })
      .catch( (error) => console.log("error occuring 1: " + error) );
    });
  
    it('should find new users in the database that do not exist', (done) => {
      db.models.users.findCreateFind({
        where: {
          sessionId: "13_session"
        }
      })
      .spread( (user, created) => {
        expect(created).to.equal(true);
        done();
      })
      .catch( (error) => console.log("error occuring 2: " + error) );
    });

    it('should be able to retrieve the highest user session count and create a new session', (done) => {
      db.models.users.findCreateFind({
        where: {
          sessionId: "1337_session"
        }
      })
      .spread((user, created) => {

        expect(created).to.equal(false);

        db.query(`SELECT MAX(count) AS count FROM ximpelsessions WHERE "userId"=(SELECT id FROM users WHERE "sessionId"=:sessionId)`, 
        { replacements: {
          sessionId: user.sessionId 
        }, 
        type: db.QueryTypes.SELECT })
        .then( (rows) => {

          expect(rows[0].count).to.equal(2);

          db.models.ximpelsessions.create({
            count: rows[0].count + 1,
            userId: user.id
          })
          .then( (ximpelSession) => {
            expect(ximpelSession.constructor.name).to.equal('ximpelsessions');
            expect(ximpelSession.dataValues.count).to.equal(3);
            expect(ximpelSession.dataValues.userId).to.not.equal(undefined);
            expect(ximpelSession.dataValues.userId).to.equal(1);
            done();
          })
        })
      });
    });
  });

});