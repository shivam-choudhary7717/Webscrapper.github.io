const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const zomatoScrapper = require('../Scrapper/zomato');

router.post("/zomato", async (req, res) => {
    try {
        async function run() {
            const browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            });
            const [page] = await browser.pages();
            await page.setViewport({ width: 1280, height: 926 });
            await page.goto(
                `https://www.zomato.com`
            );
            let result = await zomatoScrapper(page, req.body.Url);
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