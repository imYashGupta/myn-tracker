const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios').default;
const qs = require('qs');
var convert = require('xml-js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const puppeteer =  require('puppeteer');

let PORT = process.env.PORT || 8000;

const app = express();
app.use(bodyParser.json());
app.use("/",(request,res,next) => {
    (async () => {
        const {style} = request.query;
        console.log(style);
        if(style){
            const browser = await puppeteer.launch({
                headless: true,
                executablePath: '/usr/bin/chromium',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            // await page.goto('https://github.com/');
            await page.goto('https://www.myntra.com');
            await page.goto('https://www.myntra.com/gateway/v2/product/'+style);
            const data = await page.evaluate(() => document.querySelector('*').outerHTML);
            // await browser.close();         
            const dom = new JSDOM(data);
            const viewState=dom.window.document.getElementsByTagName("pre")[0].innerHTML;
            
            const product=JSON.parse(viewState);
            
            console.log(product);
            res.send(viewState);
        }
        console.log("INVALID")
        return res.json({message:"Invalid."}); 
      })();

});


app.listen(PORT);
