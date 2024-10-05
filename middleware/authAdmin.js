const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('authentication invalid')
    }
    const token = authHeader.split(' ')[1]
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        const role  = payload.role
        if(role !== 'admin'){
            throw new UnauthenticatedError('authentication failed, you are not admin')
        }
        req.user = { adminId:payload.adminId, name:payload.name, role:payload.role }
        next()
    }
    catch(err){
        throw new UnauthenticatedError('authentication failed')
    }
}

module.exports = auth