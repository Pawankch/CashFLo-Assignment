"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
const jimp = require('jimp');
const path = require('path');
const auth = require('./auth');

//Providing Port number to be used on Cloud/Localhost
const port = process.env.PORT || 3000

app.use(bodyParser.json())

//Public Endpoint to login with any Email and Password
app.post('/login', (req, res) => {
    const { body } = req;
    const { username} = body;
    const { password } = body;
    jwt.sign({username, password}, 'secretkey', { expiresIn: '1h' },(err, token) => {
        if(err){
            return console.log(err) 
        }    
        res.send(token);
    });
})


//Private Endpoint it can be accessed only after providing jwt token returned after login
app.get('/login/image', auth,  (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, 'secretkey',  (err, token) => {
        if(err){
            //If error send Forbidden (403)
            console.log('Token is invalid');
            res.sendStatus(403);
        } else {
            console.log('Success : Connected to protected route');
            const imgUrl = req.body.url;
            jimp.read(imgUrl, async (err,img)=>{
                if(err) throw new Error
                await img.resize(50,50)
                await img.writeAsync('./images/Resized.jpg')
                await res.sendFile(path.join(__dirname, '/images/Resized.jpg'))
            })

        }
    })
})


app.listen(port, ()=>{
    console.log('Server started on port no. '+port);
} )