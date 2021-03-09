var loginservices = require('../services/loginservices.js')
const { signUpCoach } = require('../services/signup.js')
const { signUpExecutive } = require('../services/signup.js')
var loginservices = require('../services/signup.js')
var expect = require('chai').expect;
var mysql = require("../services/sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

describe('Sign Up Coach', function() {
    //used for the MySQL connection for the duration of these tests
    var con = null;


    // before running these tests, remove any accounts with email@email.com
    before(function(done) {
        con = mysql.connect;
        con.execute("DELETE FROM coaches WHERE email = ?", ["email@email.com"]);

        done();
    });

    //after each test, remove the account we created so it does not interfere with other tests
    afterEach(function(done) {
        con.execute("DELETE FROM coaches WHERE email = ?", ["email@email.com"]);
        
        done();
    });

    //after everything is done, disconnect from MySQL so the tests don't hang
    after(function(done){
        con.end();
        done();
    })


    context('with valid arguments', function(){
        it('should create the user an account in the DB', function(done){
            var signUpResponse = signUpCoach("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null)
            done();

            expect(signUpResponse).to.be.object();
            expect(signUpResponse.username).to.be.a('string').and.equal("email@email.com")
        })
    })

    context('with duplicate email', function(){
        it('should throw an error', function(done){
            var signUpResponse = signUpCoach("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null)
            var signUpResponse = signUpCoach("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null)
            done();

            expect(signUpResponse).to.be.a('int').and.equals(-2)
        })
    })

    context('with non matching passwords', function(){
        it('should throw an error', function(done){
            var signUpResponse = signUpCoach("fname", "lname", "email@email.com", "2066968408", "passord", "password", "bio", null)
            done();

            expect(signUpResponse).to.be.a('int').and.equals(-1)
        })
    })
})

describe('Sign Up Executive', function() {
    //used for the MySQL connection for the duration of these tests
    var con = null;
    var coachId = null;

    // before running these tests, remove any accounts with email@email.com
    before(function(done) {
        con = mysql.connect;
        con.execute("DELETE FROM executives WHERE email = ?", ["email@email.com"]);
        var coach = signUpCoach("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null)
        done();

        coachId = coach.coach_id_val();
    });

    //after each test, remove the account we created so it does not interfere with other tests
    afterEach(function(done) {
        con.execute("DELETE FROM executives WHERE email = ?", ["email@email.com"]);
        
        done();
    });

    //after everything is done, disconnect from MySQL so the tests don't hang
    after(function(done){
        con.end();
        done();
    })


    context('with valid arguments', function(){
        it('should create the user an account in the DB', function(done){
            var signUpResponse = signUpExecutive("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null, coachId)
            done();

            expect(signUpResponse).to.be.object();
            expect(signUpResponse.username).to.be.a('string').and.equal("email@email.com")
        })
    })

    context('with duplicate email', function(){
        it('should throw an error', function(done){
            var signUpResponse = signUpExecutive("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null, coachId)
            var signUpResponse = signUpExecutive("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null, coachId)
            done();

            expect(signUpResponse).to.be.a('int').and.equals(-3)
        })
    })

    context('with non matching passwords', function(){
        it('should throw an error', function(done){
            var signUpResponse = signUpExecutive("fname", "lname", "email@email.com", "2066968408", "passord", "password", "bio", null, coachId)
            done();

            expect(signUpResponse).to.be.a('int').and.equals(-1)
        })
    })

    context('with an invalid coach', function(){
        it('should throw an error', function(done){
            var signUpResponse = signUpExecutive("fname", "lname", "email@email.com", "2066968408", "passord", "password", "bio", null, 8888888)
            done();

            expect(signUpResponse).to.be.a('int').and.equals(-2)
        })
    })
})
