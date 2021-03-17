const express = require("express");
const app = express();
const day = require(__dirname + "/date.js");
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

var items = ["Buy Food","Read Book","Play CODM"];
let workItems = [];
app.get("/",(req,res)=>{
    let getDate = day();
    res.render("list",{listTitle: getDate, newListItems:items });
});
app.post("/",(req,res)=>{

    item = req.body.newItem;
    if(req.body.list === "Work-List"){
        workItems.push(item);
        res.redirect("/work")
    }else{
        items.push(item);
        res.redirect("/");
    }
});
app.get("/work",(req,res)=>{
    res.render("list",{listTitle:"Work-List",newListItems: workItems})
});
app.get("/about",(req,res)=>{
    res.render("about");
});

app.listen(8000,()=>{
    console.log("server started at 8000");
});