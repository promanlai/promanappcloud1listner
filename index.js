//npm install express mongoose cors body-parser
//npm install express mongoose dotenv
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT;

// 中介軟體
app.use(cors());
app.use(bodyParser.json());

// 連接MongoDB
    const URI = process.env.MONGODB_URI
    mongoose.connect(URI)
    .then(() => console.log('MongoDB已連接'))
    .catch(err => console.error(err));

// 創建用戶模型
const userSchema = new mongoose.Schema({
    username: String,
    createDate: { type: Date, default: Date.now },
    integerValue: Number,
    booleanValue: Boolean,
});

const User = mongoose.model('User', userSchema);

// CRUD路由
app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
});

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
});

app.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(user);
});

app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// 啟動服務器
app.listen(PORT, () => {
    console.log(`服務器運行在 http://localhost:${PORT}`);
});