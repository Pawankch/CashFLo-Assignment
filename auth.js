const auth = async (req, res, next)=>{
    try{
     const token = req.header('Authorization').replace('Bearer ', '')
     req.token = token
     next()
    }catch(e){
     res.status(501).send({Error:'Please Authenticate'})
    }
}

module.exports = auth