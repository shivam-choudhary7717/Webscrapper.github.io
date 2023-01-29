const express = require('express');
const path = require("path");
const app = express();
const hbs = require('hbs');
const port  = process.env.PORT || 5000;
const MapRouter = require("./Router/mapRouter");
const MagicpinRouter = require("./Router/magicpinRouter");
const ZomatoRouter = require("./Router/zomatoRouter");
const SwiggyRouter = require("./Router/swiggyRouter");

const static_path = path.join(__dirname , "/public");
const template_path = path.join(__dirname, "/templates/views")
const partials_path = path.join(__dirname, "/templates/partials");

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", ".hbs");
app.set("views" , template_path);
hbs.registerPartials(partials_path);


app.get("/", (req,res)=> {
    res.render("index");
})
app.use(MapRouter);
app.use(MagicpinRouter);
app.use(ZomatoRouter);
app.use(SwiggyRouter);


app.listen(port , ()=>{
    console.log(`server is listening on port ${port}`);
})