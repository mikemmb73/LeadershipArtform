const { signUpCoach } = require('../services/signup.js')
const { signUpExecutive } = require('../services/signup.js')
const { getCoachAuthent } = require('../services/loginservices.js')
var expect = require('chai').expect;
var mysql = require("../services/sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');

describe('Login Coach', function() {
    var con = null;
    var email = "email@email.com"
    var pass = "password"

    before(async function(){
        con = mysql.connect;
        await con.execute("DELETE FROM executives WHERE email = ?", [email]);
        var coach = await signUpCoach("fname", "lname", email, "2066968408", pass, pass, "bio", null)
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