const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/product", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = mongoose.Schema({
  product: String,
  price: Number,
});
const Item = mongoose.model("Item", productSchema);
//Get a Document
app.get("/", function (req, res) {
  Item.find(function (err, item) {
    if (!err) {
      res.send(item)
    } else {
      res.send(err);
    }
  });
});
//post a Document
app.post("/", function (req, res) {
  const newItem = new Item({
    product: req.body.product,
    price: req.body.price,
  });
  
  newItem.save(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Successfully data Added");
      
    }
  });
});

app.put("/:product", function (req, res) {
  Item.updateOne(
    { product :req.params.product },
   {$set: { product: req.body.product, price: req.body.price }},
    { overwrite: true },
    function (err) {
      if (!err) {
        res.send("Successfully update");
        
      } else {
        res.send(err);
      }
    }
  );
});
//Delete Single Document
app.delete("/delete/:product", function (req, res) {
  Item.findOneAndDelete(
    { product: req.params.product },
    function (err) {
      if (!err) {
        res.send("Deleted successfully!");
      } else {
        res.send(err);
      }
    }
  );
});

//Delete Many
app.delete("/all", (req, res) => {
  Item.deleteMany(function (err) {
    if (!err) {
      res.send("Documents are Deleted successfully!");
    } else {
      res.send(err);
    }
  });
});

app.listen(port, function () {
  console.log("listening on port");
});
