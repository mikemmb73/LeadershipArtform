const { expect } = require('chai');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { signUpCoach } = require('../services/signup.js')
var mysql = require("../services/sqlconnect.js");


describe('Sign up a coach', function(){
    const driver = new Builder().forBrowser('chrome').build();
    

    before(function(done) {
        con = mysql.connect;
        con.execute("DELETE FROM coaches WHERE email = ?", ["email@email.com"]);
        con.execute("DELETE FROM coaches WHERE email = ?", ["email2@email.com"]);
        con.execute("DELETE FROM coaches WHERE email = ?", ["email3@email.com"]);
        done();
    });

    //this should pass as long as there is only one
    context('with valid arguments', function(){
        this.timeout(9000);
        it("should allow the user to sign up and navigate them to the home page", async function(){
            await driver.get("http://127.0.0.1:3000");
            await driver.sleep(1000);
            var url = "coachSignInSignUp"
            await driver.findElement(By.xpath('//a[@href="'+url+'"]')).click();
            await driver.wait(until.elementLocated(By.className("login-wrap")))

            await driver.findElement(By.xpath("//label[contains(text(),'Sign Up')]")).click()

            var formElement = await driver.findElement(By.className("sign-up-htm"))

            await formElement.findElement(By.id("fname")).sendKeys("mike")
            await formElement.findElement(By.id("lname")).sendKeys("mike")
            await formElement.findElement(By.id("email")).sendKeys("email@email.com")
            await formElement.findElement(By.id("phoneNumber")).sendKeys("2062062060")
            await formElement.findElement(By.id("pw")).sendKeys("Password!")
            await formElement.findElement(By.id("pw2")).sendKeys("Password!")
            await formElement.findElement(By.id("bio")).sendKeys("biography!")

            await formElement.findElement(By.className("button")).click()
            
            await driver.sleep(1000);

            // var loginElement = await driver.findElement(By.className("sign-in-htm"))
            // await loginElement.findElement(By.id("username2")).sendKeys("email@email.com")
            // await loginElement.findElement(By.id("password2")).sendKeys("Password!")
            // await loginElement.findElement(By.className("button")).click()
            var headerElement = await (await (await driver).findElement(By.className("navbar-brand"))).getAttribute('innerHTML')

            await expect(headerElement).equals("Art of Leadership")

            ;(await (await driver).findElement(By.className("btn btn-sm signOut_button"))).click()
            
        })
    })

    //this will likely timeout due to a current issue
    context('with two sign ups in a row', function(){
        this.timeout(9000);
        it("should allow the user to sign up and navigate them to the home page", async function(){
            await driver.get("http://127.0.0.1:3000");
            await driver.sleep(1000);
            var url = "coachSignInSignUp"
            await driver.findElement(By.xpath('//a[@href="'+url+'"]')).click();
            await driver.wait(until.elementLocated(By.className("login-wrap")))

            await driver.findElement(By.xpath("//label[contains(text(),'Sign Up')]")).click()

            var formElement = await driver.findElement(By.className("sign-up-htm"))

            await formElement.findElement(By.id("fname")).sendKeys("mike")
            await formElement.findElement(By.id("lname")).sendKeys("mike")
            await formElement.findElement(By.id("email")).sendKeys("email3@email.com")
            await formElement.findElement(By.id("phoneNumber")).sendKeys("2062062060")
            await formElement.findElement(By.id("pw")).sendKeys("Password!")
            await formElement.findElement(By.id("pw2")).sendKeys("Password!")
            await formElement.findElement(By.id("bio")).sendKeys("biography!")

            await formElement.findElement(By.className("button")).click()
            
            await driver.sleep(1000);

            // var loginElement = await driver.findElement(By.className("sign-in-htm"))
            // await loginElement.findElement(By.id("username2")).sendKeys("email@email.com")
            // await loginElement.findElement(By.id("password2")).sendKeys("Password!")
            // await loginElement.findElement(By.className("button")).click()
            var headerElement = await (await (await driver).findElement(By.className("navbar-brand"))).getAttribute('innerHTML')

            await expect(headerElement).equals("Art of Leadership")

            await driver.get("http://127.0.0.1:3000/coachSignInSignUp");
            await driver.sleep(1000);
            var url = "coachSignInSignUp"

            //this fails sometimes due to the way we reload after sign up, this is here to stop it from making other tests not run
            try{
                await driver.findElement(By.xpath('//a[@href="'+url+'"]')).click();
                await driver.wait(until.elementLocated(By.className("login-wrap")))

                await driver.findElement(By.xpath("//label[contains(text(),'Sign Up')]")).click()

                var formElement = await driver.findElement(By.className("sign-up-htm"))

                await formElement.findElement(By.id("fname")).sendKeys("mike")
                await formElement.findElement(By.id("lname")).sendKeys("mike")
                await formElement.findElement(By.id("email")).sendKeys("email2@email.com")
                await formElement.findElement(By.id("phoneNumber")).sendKeys("2062062060")
                await formElement.findElement(By.id("pw")).sendKeys("Password!")
                await formElement.findElement(By.id("pw2")).sendKeys("Password!")
                await formElement.findElement(By.id("bio")).sendKeys("biography!")

                await formElement.findElement(By.className("button")).click()
                
                await driver.sleep(1000);

                // var loginElement = await driver.findElement(By.className("sign-in-htm"))
                // await loginElement.findElement(By.id("username2")).sendKeys("email@email.com")
                // await loginElement.findElement(By.id("password2")).sendKeys("Password!")
                // await loginElement.findElement(By.className("button")).click()
                var headerElement = await (await (await driver).findElement(By.className("navbar-brand"))).getAttribute('innerHTML')

                await expect(headerElement).equals("Art of Leadership")
            }catch{
                expect("allows the user to sign up").equals("false")
            }
            
        })
    })

})

describe('Sign in a coach', function(){
    const driver = new Builder().forBrowser('chrome').build();

    before(function(done) {
        var signUpResponse = signUpCoach("fname", "lname", "email@email.com", "2066968408", "password", "password", "bio", null)
        done()
    })

    context('login the user with valid login', function(){
        it("should allow the user to login"), async function(){
            await driver.get("http://127.0.0.1:3000");
            await driver.sleep(1000);

            var url = "coachSignInSignUp"
            await driver.findElement(By.xpath('//a[@href="'+url+'"]')).click();
            await driver.wait(until.elementLocated(By.className("login-wrap")))

            var loginElement = await driver.findElement(By.className("sign-in-htm"))
            await loginElement.findElement(By.id("username2")).sendKeys("email@email.com")
            await loginElement.findElement(By.id("password2")).sendKeys("password")
            await loginElement.findElement(By.className("button")).click()

            var headerElement = await (await (await driver).findElement(By.className("navbar-brand"))).getAttribute('innerHTML')
            await expect(headerElement).equals("Art of Leadership")

            ;(await (await driver).findElement(By.className("btn btn-sm signOut_button"))).click()
        }
    })

    context('login the user with an invalid login', function(){
        it("should not allow the user to login"), async function(){
            await driver.get("http://127.0.0.1:3000");
            await driver.sleep(1000);

            var url = "coachSignInSignUp"
            await driver.findElement(By.xpath('//a[@href="'+url+'"]')).click();
            await driver.wait(until.elementLocated(By.className("login-wrap")))

            var loginElement = await driver.findElement(By.className("sign-in-htm"))
            await loginElement.findElement(By.id("username2")).sendKeys("email@email.com")
            await loginElement.findElement(By.id("password2")).sendKeys("passwordBBB")
            await loginElement.findElement(By.className("button")).click()

            var headerElement = await (await (await driver).findElement(By.className("navbar-brand"))).getAttribute('innerHTML')
            await expect(headerElement).does.not.equals("Art of Leadership")
        }
    })
})