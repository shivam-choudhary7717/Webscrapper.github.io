'use strict'
const  JsonToExcel = require("../excel");

module.exports = async function zomatoScrapper(page , Url) {
    await page.waitForTimeout(3000);
    await page.goto(`${Url}/order`);
    let BusinessData = await page.evaluate(()=> {
        let FieldObj = {};
        // document.querySelector(".merchant-name a").scrollIntoView(false);
        FieldObj["Name"] = document.querySelector(".sc-jeCdPy h1").textContent;
        // FieldObj["Phone"] = document.querySelector(".merchant-call span");
        // FieldObj["Phone"]
        // document.querySelector(".merchant-address a").click();
        // FieldObj["longitude"] = document.querySelector(".tAiQdd span").textContent;
        return FieldObj;
    })
    
    await page.waitForTimeout(20000);
    let result = await page.$$eval(
          '.bGrnCu',
        (Products => Products.map(product => {
            let imgData , productType ,  productN , productP , Descript;
            product.scrollIntoView(false);

            const imglink = product.querySelectorAll('img.fyZwWD');
            if(imglink.length > 0) {
                imgData = imglink[0].getAttribute('src');
            }
            const imgType = product.querySelectorAll(".kcsImg");
            if(imgType.length > 0) {
                productType = imgType[0].getAttribute('type');
            }
            const productName = product.querySelectorAll('.kQHKsO h4');
            if(productName.length > 0) {
                productN = productName[0].textContent;
            }
            const productprice = product.querySelectorAll('.kQHKsO .cCiQWA');
            if(productprice.length > 0) {
                productP = productprice[0].textContent;
            }
            const description = product.querySelectorAll('p');
            if(description.length > 0) {
                Descript = description[0].textContent;
            }

            return {
                imgData ,
                productType ,
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
    JsonToExcel(result , `${BusinessData.Name}`);
    return result ;
}