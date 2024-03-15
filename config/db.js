// Trong tệp ./config/db

const mongoose = require('mongoose');

const local = "mongodb://127.0.0.1:27017/md18306";
const atlat ="mongodb+srv://cuonght:zIIHCwGGoWwfw4N9@cluster0.nejpn4f.mongodb.net/md18306"
const connect = async () => {
    try {
        await mongoose.connect(local);
        console.log('Connect success');
    } catch (error) {
        console.log(error);
        console.log('Connect fail');
    }
};

module.exports = { connect };
