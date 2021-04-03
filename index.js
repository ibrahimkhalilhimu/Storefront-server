const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.huwqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors())
const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("storeFront").collection("products");
  const orderCollection = client.db("storeFront").collection("order");
  const adminCollection = client.db("storeFront").collection("admin");
  app.post('/addProduct',(req,res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products)
    .then(result => {
    console.log(result.insertedCount);
    res.send(result.insertedCount);
    })
  })

  app.get('/products',(req,res) => {
    productsCollection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  app.get('/product/:id',(req,res)=>{
    const id = ObjectId( req.params.id);
    console.log(id);
    productsCollection.find({_id: id})
    .toArray((err,documents)=>{
      res.send(documents[0])
      console.log(documents)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const orders = req.body;
    orderCollection.insertOne(orders)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })

app.get('/orders',(req,res)=>{
  console.log(req.query.email);
  orderCollection.find({email: req.query.email})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.delete('/delete/:id',(req,res)=>{
  orderCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result)=>{
     res.send(result.deletedCount > 0);
  })
  
})

app.get('/order', (req, res) => {
  orderCollection.find({})
  .toArray( (err, documents) => {
      res.send(documents);
  })
})

app.post('/makeAdmin',(req, res)=>{
  const admin = req.body;
  adminCollection.insertOne(admin)
  .then((result)=>{
    res.send(result.insertCount > 0);
  })
})

// app.post('/isAdmin', (req, res) => {
//   const email = req.body.email
//   adminCollection.find({email:email})
//   .toArray( (err, admin) => {
//       res.send(admin.length>0);
//   })
// })

});



app.listen(port)