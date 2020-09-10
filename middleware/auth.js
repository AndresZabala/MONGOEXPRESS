const jwt = require('jsonwebtoken')
const SECRET_KEY_JWT_CAR_API = 1234

function auth(req, res, next){
    const jwtToken = req.header('Authorization')
    if(!jwtToken) return res.status(401).send('Acceso Denegado. Necesitamos un token valido.')

    try{
        const payload = jwt.verify(jwtToken, SECRET_KEY_JWT_CAR_API)
        req.user = payload
        next()
    }catch(e){
        res.status(400).send('Acceso Denegado. Token no Valido.')
    }  
} 

module.exports = auth