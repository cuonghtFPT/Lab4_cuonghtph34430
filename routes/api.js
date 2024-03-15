var express = require('express');
var router = express.Router();


const Distributors = require('../Models/distributors')
const Fruits = require('../Models/fruits')
//Thêm Distributor
router.post('/add-distributor', async (req, res) => {
    try{
        const data = req.body;
        const newDistributors = new Distributors({
name: data.name
        })
        const result = await newDistributors.save();
        if(result){
            res.json({
                "status":200,
                "messenger":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"Lỗi,Thêm không thành công",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});
//*Thêm fruits.js
router.post('/add-fruit', async (req, res) => {
    try{
        const data = req.body;
        const newFruits = new Fruits({
name: data.name,
quantity: data.quantity,
price:data.price,
status: data.status,
image: data.image,
description:data.description,
id_distributor:data.id_distributor
        })
        const result = await newFruits.save();
        if(result){
            res.json({
                "status":200,
                "messenger":"Thêm thành công",
                "data": result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"Lỗi,Thêm không thành công",
                "data": []
            })
        }
    }catch(error){
        console.log(error);
    }
});
//*Get danh sách Fruits
router.get('/get-list-fruit',async (req, res) => {
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status":200,
            "messenger":"Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
});
//*Get chi tiết Fruits (truyền param id)
router.get('/get-fruit-by-id/:id',async (req, res) => {
    try {
        const{id}= req.params
        
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status":200,
            "messenger":"Danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
});
//Get danh sách Fruits
router.get('/get-fruit-in-price/:price_start/:price_end', async (req, res) => {
   try {
       const { price_start, price_end } = req.params; // Trích xuất các tham số từ đường dẫn

       // Tạo một đối tượng truy vấn để tìm các Fruits có giá trong khoảng đã cho
       const query = { price: { $gte: price_start, $lte: price_end } };

       // Tìm các Fruits theo truy vấn, chỉ trả về các trường cần thiết và populate id_distributor
       const data = await Fruits.find(query, 'name quantity price id_distributor')
           .populate('id_distributor')
           .sort({ quantity: -1 }); // Sắp xếp theo số lượng giảm dần, bạn có thể thay đổi nếu cần

       // Trả về dữ liệu cho client
       res.json({
           status: 200,
           message: 'Danh sách Fruit trong khoảng giá đã cho',
           data: data
       });
   } catch (error) {
       // Xử lý lỗi nếu có
       console.log(error);
       res.status(500).json({
           status: 500,
           message: 'Có lỗi xảy ra khi lấy danh sách Fruit trong khoảng giá',
           data: null
       });
   }
});

// Xuất router để sử dụng ở nơi khác
router.get('/get-fruits-have-name-a-or-x', async (req, res) => {
    try {
        const query = {$or:[
            {name: {$regex:'T'}},
            {name: {$regex:'X'}}
        ]}
        const data = await Fruits.find(query, 'name quantity price id_distributor')
        .populate('id_distributor');

        res.json({
            status: 200,
            messenger: 'Danh sách Fruits',
            data: data
        });
    } catch (error) {
        console.log(error);
    }
});
router.put('/update-fruit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedfruit = await Fruits.findById(id);
        let result = null;
        if (updatedfruit) {
            updatedfruit.name = data
            .name || updatedfruit.name;
            updatedfruit.quantity = data.quantity || updatedfruit.quantity;
            updatedfruit.price = data.price || updatedfruit.price;
            updatedfruit.status = data.status || updatedfruit.status;
            updatedfruit.image = data.image || updatedfruit.image;
            updatedfruit.description = data.description || updatedfruit.description;
            updatedfruit.id_distributor = data.id_distributor || updatedfruit.id_distributor;
            result = await updatedfruit.save();
        }

        if (result) {
            res.json({
                status: 200,
                messenger: 'Cập nhật thành công',
                data: result
            });
        } else {
            res.json({
                status: 404,
                messenger: 'Không tìm thấy mục Fruits',
                data: null
            });
        }
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;