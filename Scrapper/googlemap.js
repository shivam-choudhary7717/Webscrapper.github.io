'use strict'

function extractItems() {
    const extractedElements = document.querySelectorAll('a.hfpxzc');
    const items = [];
    for (let element of extractedElements) {
        let ariaLabel = element.getAttribute('aria-label');
        let href = element.getAttribute('href');
        items.push({ ele: ariaLabel, url: href });
    }
    return items;
}

async function scrapeItems(
    page,
    extractItems,
    itemCount,
    scrollDelay = 2000,
) {
    let items = [];
    try {
        let previousHeight;
        while (items.length < itemCount) {
            items = await page.evaluate(extractItems);
            previousHeight = await page.evaluate(() => {
                const scroller = document.querySelector('div.m6QErb .DxyBCb .kA9KIf');
                return scroller.scrollHeight
            })

            await page.evaluate(`document.querySelector("div.m6QErb .DxyBCb .kA9KIf").scrollTo(0, ${previousHeight})`)
            await page.waitForFunction(`document.querySelector("div.m6QErb .DxyBCb .kA9KIf").scrollHeight > ${previousHeight}`);
            await page.waitForTimeout(scrollDelay);
        }

    } catch (e) { }
    return items;
}

async function goto_links(page, LinkArr) {
    await page.waitForTimeout(2000);
    let NewItems = [];
    for (let i = 0; i < LinkArr.length; i++) {
        let Result;
        let ResultObj = {};
        await page.waitForTimeout(3000);
        await page.goto(LinkArr[i].url);
        await page.waitForTimeout(2000);
        let title = await page.title();
        ResultObj["url"] = await page.url();
        ResultObj["title"] = title.replace("- Google Maps" , " ");
        Result = await page.evaluate(() => {
            let resultSelector = document.querySelectorAll('.CsEnBe');
            let FieldObj = {}
            for (let element of resultSelector) {
                let ariaLabel = element.getAttribute("aria-label");
                if (!(ariaLabel === null)) {
                    if (ariaLabel.startsWith('Address')) {
                        FieldObj["Address"] = element.querySelector('.AeaXub .rogA2c').textContent;
                        FieldObj["Pincode"] = FieldObj["Address"].split(',')
                            .slice(-1)[0]
                            .match(/\d/g)
                            .join("");
                    } else if (ariaLabel.startsWith('Phone')) {
                        FieldObj["PhoneNo"] = element.querySelector('.AeaXub .rogA2c').textContent;
                    } else if (ariaLabel.startsWith('Plus code')) {
                        FieldObj["Plus_code"] = element.querySelector('.AeaXub .rogA2c').textContent;
                    }
                    else if (ariaLabel.startsWith('Website')) {
                        FieldObj["Website"] = element.getAttribute("href");
                    }
                }
            }
            return FieldObj;
        })

        ResultObj["Address"] = Result.Address;
        ResultObj["Pincode"] = Result.Pincode;
        ResultObj["PhoneNumber"] = Result.PhoneNo;
        ResultObj["PlusCode"] = Result.Plus_code;
        ResultObj["WebLink"] = Result.Website;

        NewItems.push(
            ResultObj
        )
        await page.goBack()
    }
    return NewItems;
}

module.exports = {
    extractItems , 
    scrapeItems ,
    goto_links
}