const { signUpCoach } = require('../services/signup.js')
const { signUpExecutive } = require('../services/signup.js')
const { getCoachAuthent } = require('../services/loginservices.js')
const { getExecutiveAuthent } = require('../services/loginservices.js')
var expect = require('chai').expect;
var mysql = require("../services/sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

describe('Login Coach', function() {
    var con = null;
    var email = "email@email.com"
    var pass = "password"

    before(function(done){
        con = mysql.connect;
        con.execute("DELETE FROM coaches WHERE email = ?", [email]);
        var coach = signUpCoach("fname", "lname", email, "2066968408", pass, pass, "bio", null)
        done()
    })

    afterEach(function(done){
        con.end()
        done()
    })

    beforeEach(function(done){
        con = mysql.connect;
        done()
    })

    context("The user attempts a valid login", function(){
        it("allows the user to login", function(done){
            var loginResponse = getCoachAuthent(email, pass)
            done();

            expect(loginResponse).to.be.object();
            expect(loginResponse.username).to.be.a('string').and.equal("email@email.com")
        })
    })

    context("The user attempts an invalid login", function(){

        it("it does not allow the user to login", async function(){
            var loginResponse = await getCoachAuthent(email, "incorrectPassword")

            expect(loginResponse).to.be.equal(null);
        })
    })
})


describe('Login Executive', function() {
    var con = null;
    var email = "email@email.com"
    var pass = "password"
    var coachId = null;

    before(function(done){
        con = mysql.connect;
        con.execute("DELETE FROM executives WHERE email = ?", [email]);
        con.execute("DELETE FROM coaches WHERE email = ?", [email]);
        var coach = signUpCoach("fname", "lname", email, "2066968408", pass, pass, "bio", null)
        done();

        coachId = coach.coach_id_val();
    });

    beforeEach(function(done){
        signUpExecutive("fname", "lname", email, "2066968408", pass, pass, "bio", null, coachId)
        done();
    });

    //after each test, remove the account we created so it does not interfere with other tests
    afterEach(function(done) {
        con.execute("DELETE FROM executives WHERE email = ?", ["email@email.com"]);
        
        done();
    });

    context("The user attempts a valid login", function(){
        it("allows the user to login", function(done){
            var loginResponse = getExecutiveAuthent(email, pass)
            done();

            expect(loginResponse).to.be.object();
            expect(loginResponse.username).to.be.a('string').and.equal("email@email.com")
        })
    })

    context("The user attempts an invalid login", function(){
        it("it does not allow the user to login", function(done){
            var loginResponse = getExecutiveAuthent(email, "incorrectPassword")
            done();
            
            expect(loginResponse).to.be.equal(null);
        })
    })
})