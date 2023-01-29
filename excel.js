const  xlsx = require('xlsx');
// var isJson = require

module.exports = function JsonToExcel(ScrapedData , Name){
    let ExcelName = Date.now() + `${Name}.xlsx`;
    const worksheet = xlsx.utils.json_to_sheet(ScrapedData);
    const workBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workBook , worksheet , Name)
    xlsx.write(workBook,{bookType:'xlsx', type:'buffer'})
    xlsx.write(workBook , {bookType:'xlsx' , type:'binary'})
    xlsx.writeFile(workBook , ExcelName);
    return ExcelName;
}