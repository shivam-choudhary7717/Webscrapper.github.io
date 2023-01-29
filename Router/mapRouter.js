const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const {extractItems , scrapeItems , goto_links } = require("../Scrapper/googlemap");
const JsonTo_excel = require('../excel');
let fs = require('fs');

router.post("/googlemap", async (req, res) => {
    try {
        async function run (){
            let result , Excel;
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const [page] = await browser.pages();
            await page.setViewport({ width: 1280, height: 926 });
            await page.goto(
                `https://www.google.com/maps/search/${req.body.item } + ${req.body.pincode}`
            );
            const items = await scrapeItems(page, extractItems, req.body.Count);
            result = await goto_links(page, items);
            Excel = JsonTo_excel(result , req.body.item);
            await browser.close();
            return Excel;
        };
        let data = await run() ;
        res.download(data , (err)=>{
            if(err) {
                fs.unlinkSync(data);
                res.send('unable to download excel file');
            }
            fs.unlinkSync(data);
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;