const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");

// Admin Routes
router.post('/signup', async(req, res) => {
    username = req.body.username;
    password = req.body.password;
    
    await Admin.create({
        username,
        password
    })
    res.json({message: 'Admin created successfully'})
});

router.post('/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await Admin.findOne({
        username,
        password
    })
    if(user){
        const token = jwt.sign({username},JWT_SECRET);
        res.json({token})
    }
    else{
        res.json({msg: "Incorrect email or password"})
    }
});

router.post('/courses', adminMiddleware, async(req, res) => {
    const newCourse = await Course.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageLink: req.body.imageLink
    })
    res.json({ message: 'Course created successfully', courseId: newCourse._id})
});

router.get('/courses', adminMiddleware, async(req, res) => {
    const response = await Course.find({})
    res.json({course: response});
});

module.exports = router;