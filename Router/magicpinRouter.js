const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const magicPinScrapper = require('../Scrapper/magicPin');

router.post("/magicpin", async (req, res) => {
    try {
        async function run() {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const [page] = await browser.pages();
            await page.setViewport({ width: 1280, height: 926 });
            await page.goto(
                `https://magicpin.in/india/New-Delhi/home`
            );
            let result = await magicPinScrapper(page , req.body.Url);
            await browser.close();
            return result;
        };
        let data = await run();
        res.send(data);
    } catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router;