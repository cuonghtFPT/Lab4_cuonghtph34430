var express = require('express');
var router = express.Router();


const Distributors = require('../Models/distributors')
const Fruits = require('../Models/fruits')
const Uploads = require('../config/common/upload')
const Users = require('../models/users');

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
router.get('/get-list-fruit', async (req, res, next) => {
    const authHeader = req.headers.authorization; // Sử dụng headers thay vì header
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // Kiểm tra nếu token không tồn tại

    try {
        // Thực hiện xác thực token
        let payload;
        JWT.verify(token, SECRETKEY, (err, _payload) => {
            if (err instanceof JWT.TokenExpiredError) return res.sendStatus(401);
            if (err) return res.sendStatus(403);
            payload = _payload;
        });

        console.log(payload); // In ra payload để kiểm tra

        // Nếu xác thực thành công, tiếp tục thực hiện yêu cầu lấy danh sách fruit
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "Danh sách fruit",
            "data": data
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500); // Trả về lỗi 500 nếu có lỗi xảy ra
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

router.delete('/destroy-fruit-by-id/:id',async(req,res)=> {
    try{
        const {id} = req.params
        const result = await Fruits.findByIdAndDelete(id);
        if(result) {
            res.json({
                "status":200,
                "messenger":"Xóa thành công",
                "data" : result
            })
        }else{
            res.json({
                "status":400,
                "messenger":"Lỗi,Xóa không thành công",
                "data" : []
            })
        }
    }catch(error) {
        console.log(error);
    }
});

router.post('/add-fruit-with-file-image', Uploads.array('image', 5), async (req, res) => {
    try {
        const data = req.body;
        const { files } = req;
        const urlsImage = files.map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        const newFruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: urlsImage,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newFruit.save();

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 404,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            "status": 500,
            "messenger": "Lỗi, hệ thống gặp sự cố",
            "data": []
        });
    }
});

router.post('/register-send-email',Uploads.single('avatar'),async(req,res) =>{ 
    try {
    const data = req.body;
    const { file } = req;
    const newUser = Users({
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      avatar: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      // URL avatar http://localhost:3000/uploads/filename
    });
    const result = await newUser.save();
    if (result) {
      // Gửi mail
      const mailOptions = {
        from: "huy612739@gmail.com", // Email gửi đi
        to: result.email, // Email nhận
        subject: "Đăng ký thành công", // Chủ đề
        text: "Cảm ơn bạn đã đăng ký", // Nội dung mail
      };
      // Nếu thêm thành công (result không null), trả về dữ liệu
      await Transporter.sendMail(mailOptions); // Gửi mail
      res.json({
        status: 200,
        message: "Thêm thành công",
        data: result,
      });
    } else {
      // Nếu thêm không thành công (result null), thông báo lỗi
      res.json({
        status: 400,
        message: "Lỗi, thêm không thành công",
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
});
const JWT = require('jsonwebtoken');
const SECRETKEY = "FPTPOLYTECHNIC";

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username, password });

    if (user) {
      // Tạo token cho người dùng với expiresIn là 1 giờ
      const token = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1h' });

      // Tạo refreshToken cho người dùng với expiresIn là 1 ngày
      const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, { expiresIn: '1d' });

      res.json({
        status: 200,
        messenger: "Đăng nhập thành công",
        data: user,
        token: token,
        refreshToken: refreshToken
      });
    } else {
      res.json({
        status: 400,
        messenger: "Lỗi, đăng nhập không thành công",
        data: []
      });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;