const { expect } = require('chai');
const { Builder, By, Key, until } = require('selenium-webdriver');
var mysql = require("../services/sqlconnect.js");

describe('Sign up a coach', function(){
    const driver = new Builder().forBrowser('chrome').build();
    this.timeout(9000);

    before(function(done) {
        con = mysql.connect;
        con.execute("DELETE FROM coaches WHERE email = ?", ["email@email.com"]);
        done();
    });

    context('with valid arguments', function(){
        it("should allow the user to login", async function(){
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
            
        })
    })

})