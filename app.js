"use strict"
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt  = require('jsonwebtoken');
const jimp = require('jimp');
const path = require('path');
const auth = require('./middleware/auth');

//Providing Port number to be used on Cloud/Localhost
const port = process.env.PORT || 3000

app.use(bodyParser.json())

//Public Endpoint to login with any Email and Password
app.post('/login', (req, res) => {
    const { body } = req;
    const { username} = body;
    const { password } = body;
    //Using jwt to generate the token based on the criteria such as username / password
    jwt.sign({username, password}, 'secretkey', { expiresIn: '1h' },(err, token) => {
        if(err){
            return console.log(err) 
        }    
        res.send(token); //Returning token after successfully logged in
    });
})


//Private Endpoint it can be accessed only after providing jwt token returned after login
app.get('/login/image/', auth,  (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, 'secretkey',  (err, token) => {  //Here, "secretkey" is a passphrase used for verifying user
        if(err){
            //If error send Forbidden (403)
            console.log('Token is invalid or not provided');
            res.sendStatus(403); //Forbidden message
        } else {
            console.log('Success : Connected to private route');
          //const imgUrl = req.body.url;         //Using this we can pass the url into request body
            const imgUrl = req.query.url         //Using this we can pass url into search query

            //Jimp package is used for downloading the image from url and then resize it to 50 * 50.
            jimp.read(imgUrl, async (err,img)=>{
                if(err) throw new Error
                await img.resize(50,50)         //Resizing image
                await img.writeAsync('./images/Resized.jpg') //Saving after resizing 
                //send the resized image back to response
                await res.sendFile(path.join(__dirname, '/images/Resized.jpg'))
            })

        }
    })
})


app.listen(port, ()=>{
    console.log('Server started on port no. '+port);
} )

//For detailed documentation refer to Readme.docx