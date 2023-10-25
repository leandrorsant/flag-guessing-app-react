const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const User = require = require('../models/user')



// Getting all users
router.get('/', async (req, res) => {
    try{
        const Users = await User.find().sort({highscore: -1}).limit(10)
        res.header("Access-Control-Allow-Origin", "*");
        res.json(Users);
    }catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one User
router.get('/:id', getUser ,(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.json(res.user)
})

// Getting User by name
router.get('/name/:name', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    
    try{
        const user = await User.find({name : req.params.name})
        res.status(201).json(user);
    }catch(err){
        res.status(404).json({ message: err.message })
    }
})

// Getting User by session_id
router.post('/session/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body)
    try{
        if(req.body.session_id){
            const user = await User.find({session_id : req.body.session_id})
            if(user.length > 0)
                res.status(201).json(user);
            else
                res.status(404).json({ message: "Invalid session_id"})
        }else{
            res.status(404).json({ message: "Invalid session_id"})
        }
    }catch(err){
        res.status(404).json({ message: err.message })
    }
})


// Creating one User
router.post('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const newUserObject = new User({
        name: req.body.name,
        password: req.body.password,
        highscore: req.body.highscore,
    })
    
    try{
        const newUser = await newUserObject.save()
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({ message: err.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    //res.send("ok")
    const username = req.body.name
    const password = req.body.password
    console.log(JSON.stringify(req.body))
    
    
    let sessionId = new mongoose.Types.ObjectId;
    sessionId = sha256(sessionId)

    
    try{
        if(req.body.password != null){
        await User.find({name : username}).find({password: password}).updateOne({name : username}, {session_id: sessionId})
        const user = await User.find({name : username}).find({password: password})
        if(user.length == 0){
            res.status(404).json({message: 'Username or password incorrect'});    
        }else{
            res.status(200).json(user);
        }
    }else if(req.body.session_id != null){
        const userBySessionId = await User.findOne({session_id : req.body.session_id});
        console.log(userBySessionId);
        if(userBySessionId.length == 0){
            res.status(404).json({message: 'Username or password incorrect'});     
        }else{
            res.status(200).json(userBySessionId); 
        }
    }
    }catch(err){
        res.status(404).json({ message: err.message })
    }
})


// Updating User
router.patch('/:id', getUser, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(res.user.highscore)
    console.log(res.user._id)

    // if(req.body.name != null){
    //     res.user.name = req.body.name
    // }
    // if(req.body.password != null){
    //     res.user.password = req.body.password
    // }
    if(req.body.highscore != null){
        res.user.highscore = req.body.highscore
    }
    try{
        if(req.body.password != null && req.body.password == res.user.password){
            const updatedUser = await res.user.save()
            res.json(updatedUser)
        }else res.status(404).json({message:"Incorrect password"})
    }catch(error){
        res.status(400).json({message: error.message})
    }

})

// Deleting User
router.delete('/:id', getUser, async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try{
        console.log(JSON.stringify(res.user) )
        await User.deleteOne(res.user)
        res.json({message: 'Deleted User'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

async function getUser(req, res, next){
    let user
    try{
      user = await User.findById(req.params.id)
      if(user == null){
        return res.status(404).json({message: 'Cannot find user'})
      }
    }catch(error){
        res.status(500).json({ message: err.message })
    }
    res.user = user
    next()
}

module.exports = router

