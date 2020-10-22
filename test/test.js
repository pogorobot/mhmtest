const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);
const fs = require('fs');

const app = require('../app');
const databaseAccess = require('../db/database-access');

//Since we'll be modifying the "database",
//this hook resets to seed values after execution
afterEach(function() {
  const seedData = fs.readFileSync(__dirname + '/seed-data.json');
  fs.writeFileSync(__dirname + '/../db/mock-data.json', seedData);
});


describe("API endpoints", function() {
  describe("GET /users", function() {
    it("fetches all users", function(done) {
      chai.request(app)
        .get("/users")
        .end((err, result) => {
          result.should.have.status(200);
          assert.equal(result.body.length, 2);
          done();
        });
    });
  });

  describe("GET /users/:id", function() {
    it("fetches the requested user", function(done) {
      chai.request(app)
        .get("/users/1")
        .end((err, result) => {
          result.should.have.status(200);
          assert.equal(result.body.name, "Jerry");
          done();
        });
    });
  });

  describe("GET /classes", function() {
    it("fetches all classes", function(done) {
      chai.request(app)
        .get("/classes")
        .end((err, result) => {
          result.should.have.status(200);
          assert.equal(result.body.length, 2);
          done();
        });
    });
  });

  describe("GET /classes/:id", function() {
    it("fetches the requested class", function(done) {
      chai.request(app)
        .get("/classes/2")
        .end((err, result) => {
          result.should.have.status(200);
          assert.equal(result.body.name, "Calculus");
          done();
        });
    });
  });
});


describe("Mock database functions", function() {
  describe("getUsers()", function() {
    it("fetches all users", async function() {
      const users = await databaseAccess.getUsers();
      assert.equal(users.length, 2);
    });
  });

  describe("getUser()", function() {
    it("fetches the requested user", async function() {
      const user = await databaseAccess.getUser(1);
      assert.equal(user.name, "Jerry");
    });
  });

  describe("createUser()", function() {
    it("adds a new user to the fake database", async function() {
      const userParams = { name: "Test", last: "User" };
      const priorUsers = await databaseAccess.getUsers();
      await databaseAccess.createUser(userParams);
      const newUsers = await databaseAccess.getUsers();
      assert.equal(newUsers.length, priorUsers.length + 1);
    });
  });

  describe("getClasses()", function() {
    it("fetches all classes", async function() {
      const classes = await databaseAccess.getClasses();
      assert.equal(classes.length, 2);
    });
  });

  describe("getClass()", function() {
    it("fetches the requested class", async function() {
      const thisClass = await databaseAccess.getClass(2);
      assert.equal(thisClass.name, "Calculus");
    });
  });

  describe("createClass()", function() {
    it("adds a new class to the fake database", async function() {
      const classParams = { name: "AP US Government" };
      const priorClasses = await databaseAccess.getClasses();
      await databaseAccess.createClass(classParams);
      const newClasses = await databaseAccess.getClasses();
      assert.equal(newClasses.length, priorClasses.length + 1);
    });
  });
});