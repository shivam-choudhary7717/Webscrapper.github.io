'use strict'
const  JsonToExcel = require("../excel");

module.exports = async function swiggyScrapper(page , Url) {
    let Excel ;
    await page.waitForTimeout(3000);
    await page.goto(`${Url}`);
    await page.waitForTimeout(10000);
    let BusinessData = await page.evaluate(()=> {
        let FieldObj = {};
        FieldObj["Name"] = document.querySelector(".OEfxz h1").textContent;
        // FieldObj["Phone"] = document.querySelector(".merchant-call span");
        // FieldObj["Phone"]
        // document.querySelector(".merchant-address a").click();
        // FieldObj["longitude"] = document.querySelector(".tAiQdd span").textContent;
        return FieldObj;
    })
    await page.waitForTimeout(3000);
    let result = await page.$$eval(
          '.styles_container__-kShr',
        (Products => Products.map(product => {
            let imgData , productN , productP , Descript;
            product.scrollIntoView(false);
            const imglink = product.querySelectorAll('.styles_itemImageContainer__3Czsd button');
            if(imglink.length > 0) {
                imgData = imglink[0].querySelector('img').getAttribute('src');
            }
            const productName = product.querySelectorAll('.styles_itemName__hLfgz h3');
            if(productName.length > 0) {
                productN = productName[0].textContent;
            }
            const productprice = product.querySelectorAll('.styles_itemPortionContainer__1u_tj span');
            if(productprice.length > 0) {
                productP = productprice[0].textContent;
            }
            const description = product.querySelectorAll('.styles_itemDesc__3vhM0');
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
    let ExcelSheetName ;
    if(BusinessData.Name.length > 31) {
        ExcelSheetName = BusinessData.Name.split(" ")[0];
    } else {
        ExcelSheetName = BusinessData.Name;
    }
    Excel = JsonToExcel(result , ExcelSheetName);
    return Excel ;
}