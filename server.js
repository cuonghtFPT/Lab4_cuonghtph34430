const express = require('express');
const app = express();

const port = 3000;

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});

const uri = 'mongodb+srv://cuonght:ckwirpCJYK3EpHyi@cluster0.nejpn4f.mongodb.net/md18306';

const mongoose = require('mongoose');
const carModel = require('./carsModel');
app.get('/', async(req,res) => {
   await mongoose.connect(uri);
   let cars = await carModel.find();
   console.log(cars);
   res.send(cars);

});

app.get('/add_xe', async(req,res) => {
   await mongoose.connect(uri);

   let car = {
      ten:'xe 3',
      namSX:2024,
      hang:'Mistubishi',
      gia:7500,
   }
   let kq = await carModel.create(car);
   console.log(kq);
   let cars = await carModel.find();
   res.send(cars);
})