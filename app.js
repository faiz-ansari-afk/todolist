const express = require("express");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
const day = require(__dirname + "/date.js");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true,useUnifiedTopology: true }));
app.use(express.static("public"));
// connecting to mongodb
// mongodb+srv://admin:admin@cluster0.vmdiy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://admin:admin@cluster0.vmdiy.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});
// items collection ka schema banaya hai idhar.....eg: item collection me ek field name ki hogi jiski value string me hogi
const listItemSchema = {
  name: String
};
// Item is a collection......yaha pe Item likha hai singular me ...mongoose usko convert karega plurals me eg: Item ---> items
const Item = mongoose.model("Item", listItemSchema);
// hard coded data
const task1 = new Item({
  name: "Welcome to your to-do list",
});
const task2 = new Item({
  name: "Click on + button to add your task",
});
const task3 = new Item({
  name: "<-- click here to checked",
});
const defaultItems = [task1, task2, task3];
const listSchema = {
  name : String,
  items: [listItemSchema]
}
const List = mongoose.model("List",listSchema);

// let items=["work 1","work 2"];
// let workItems = [];
app.get("/", (req, res) => {

  let getDate = day();
  Item.find({},(err,foundItem)=>{
    if(foundItem.length === 0){
      Item.insertMany(defaultItems, (err) => {
          if (err) console.log(err);
          // else console.log("successfully created into database");
        });
        res.redirect("/")
    }
    else
    res.render("list", { 
      // listTitle: getDate,
      listTitle:"Today",
       newListItems: foundItem});
  })
});
app.get("/:customListName",(req,res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},(err,foundList)=>{
    if(!err){
      if(!foundList){
          // console.log(" doesnt exist")
          // create a new list
          const list = new List({
            name: customListName,
            item:defaultItems
          });
          list.save();
          res.redirect("/" + customListName)
      }
      else{
        // something goes missing here
        res.render("list",{ listTitle: foundList.name , newListItems: foundList.items})
      }
  }
})
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  })
  
  if(listName === "Today"){
    item.save();
    res.redirect("/");
  }else{
    // something is missing here.....
    List.findOne({name:listName},(err,foundList)=>{
      // made some changes in push 
      foundList.items.push(item );
      foundList.save();
      res.redirect(`/${listName}`)
    })
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.post("/delete",(req,res)=>{
  const deleteItemID = req.body.delete;
  const listName = req.body.listName;
  if(listName === "Today"){
    Item.findByIdAndRemove(deleteItemID,(err)=>{
      if(err)
      console.log(err)
      else{
        res.redirect("/");
        // console.log("Successfully Deleted Item")
      }
      
    })
  }else{
     Item.findOneAndUpdate({name:listName}, {$pull:{items: {_id : deleteItemID} }} , (err,foundList)=>{
       if(!err){
         res.redirect("/"+listName);
       }
     })
  }
  
  // console.log(deleteItemID)
})
app.listen(process.env.PORT || 8000, () => {
  console.log("server started successfully");
});
