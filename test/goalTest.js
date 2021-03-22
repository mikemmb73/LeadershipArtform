var loginservices = require('../services/loginservices.js')
const { signUpExecutive } = require('../services/signup.js')
const { signUpCoach } = require('../services/signup.js')
const { addGoalCoach } = require('../services/addGoalServices.js')
var loginservices = require('../services/signup.js')
var expect = require('chai').expect;
var mysql = require("../services/sqlconnect.js");
var ExecutiveCoach = require('../model/executiveCoach');
var Executive = require('../model/executive');


describe('Add Executive Goal', function() {
    var con = null;
    var email = "email@email.com"
    var pass = "password"
    var execSignUpResp = null
    var execId = null
    var coach = null
    var coachId = null

    before(async function(){
        con = mysql.connect;
        await con.execute("DELETE FROM executives WHERE email = ?", [email]);
        await con.execute("DELETE FROM coaches WHERE email = ?", [email]);
        coach = await signUpCoach("fname", "lname", email, "2066968408", pass, pass, "bio", null)

        coachId = coach.coach_id_val
        execSignUpResp = await signUpExecutive("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null, coachId)
    })

    beforeEach(async function(){
        await con.execute("DELETE FROM goals WHERE coach_id = ?", [coachId]);
    })

    after(function(done){
        con.end();
        done();
    })

    context("The user tries to add a goal", function(){
        it("should create the goal", async function(){
            //create the goal object
            execId = execSignUpResp.execId
            goalObejct = {
                addCoachGoal: 'addCoachGoal',
                clientForm: 'Michael Baldwin',
                frequency: '0',
                goalTitle: 'Goal',
                goalDescription: 'this is a goal',
                'mcQuestions[0][0]': 'Multiple choice',
                'mcQuestions[0][1]': 'Choice 1',
                'mcQuestions[0][2]': 'Choice 2',
                'frQuestions[0]': 'Games games games',
                'likertQuestions[0][0]': 'Likert',
                'likertQuestions[0][1]': 'bad',
                'likertQuestions[0][2]': 'good'
              }

            addGoalResp = await addGoalCoach(goalObejct, coach, execSignUpResp)
            
            response = await con.execute("SELECT * FROM goals WHERE coach_id = ?", [coachId])

            expect(response.length).to.be.at.least(1);
        })
    })
})