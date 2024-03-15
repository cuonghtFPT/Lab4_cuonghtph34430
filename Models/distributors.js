const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const Distributors = new Scheme({
   name: {
      type:String,
      unique:true,
      maxlength:255
   },
},{
   timestamps:true
})

module.exports=mongoose.model('distributor',Distributors)