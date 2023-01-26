'use strict'
const  JsonToExcel = require("../excel");

module.exports = async function magicPinScrapper(page , Url) {
    await page.waitForTimeout(3000);
    await page.goto(`${Url}`);
    let BusinessData = await page.evaluate(()=> {
        let FieldObj = {};
        document.querySelector(".merchant-name a").scrollIntoView(false);
        FieldObj["Name"] = document.querySelector(".merchant-name a").textContent;
        // FieldObj["Phone"] = document.querySelector(".merchant-call span");
        // FieldObj["Phone"]
        // document.querySelector(".merchant-address a").click();
        // FieldObj["longitude"] = document.querySelector(".tAiQdd span").textContent;
        return FieldObj;
    })
    await page.waitForTimeout(3000);
    await page.evaluate('document.querySelector(".order-cta").click()');
    await page.waitForTimeout(10000);
    let result = await page.$$eval(
          '.categoryItemHolder',
        (Products => Products.map(product => {
            let imgData , productN , productP , Descript;
            product.scrollIntoView(false);

            const imglink = product.querySelectorAll('.itemImage');
            if(imglink.length > 0) {
                imgData = imglink[0].getAttribute('src');
            }
            const productName = product.querySelectorAll('.itemInfo p');
            if(productName.length > 0) {
                productN = productName[0].textContent;
            }
            const productprice = product.querySelectorAll('.itemInfo p');
            if(productprice.length > 0) {
                productP = productprice[1].textContent;
            }
            const description = product.querySelectorAll('.description');
            if(description.length > 0) {
                Descript = description[0].textContent;
            }

            return {
                imgData ,
                productN ,
                productP ,
                Descript ,
            }
        }))
    );
    JsonToExcel(result , `${BusinessData.Name}`);
    return result ;
}