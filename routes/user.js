const bcrypt = require('bcrypt')
const mongosee = require('mongoose')
const express = require('express')
const User = require('../models/user')
const router = express.Router()
const { check, validationResult } = require('express-validator');


//Obtener usuarios
router.get('/', async(req, res)=> {
    const users = await User.find()
    res.send(users)
})


//Obtener un usuario por ID
router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).send('No hemos encontrado un usuario con ese ID')
    res.send(user)
})


//Ingresar un usuario
router.post('/', [
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3}),
    check('password').isLength({min : 3}),
], async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let user = await User.findOne({email : req.body.email})
    if(user) return res.status(400).send('El usuario ingresado ya existe')

    //Se genera primero la Sal con 'bcrypt' y luego se hashea con la contraseña que se envia
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    //Si el usuario con ese correo no existe entonces se procede a realizar la siguiente operacion de guardado
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        isCustomer: false
    })

    const result = await user.save()
    const jwtToken = user.generateJWT();
    
    res.status(201).header('Authorization', jwtToken).send({
        _id: user._id,
        name: user.name, 
        email: user.email
    })
})


//Actualizar un usuario
router.put('/:id', [
    check('name').isLength({min: 3}),
    check('email').isLength({min: 3})
], async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        email: req.body.email,
        isCustomer: req.body.isCustomer
    },
    {
        new: true
    })

    if(!user){
        return res.status(404).send('El usuario con ese ID no esta')
    }
    
    res.status(204).send()
})


//Eliminar un usuario
router.delete('/:id', async(req, res)=>{

    const user = await User.findByIdAndDelete(req.params.id)

    if(!user){
        return res.status(404).send('El user con ese ID no esta, no se puede borrar')
    }

    res.status(200).send('usuario borrado')

})

//Se exporta la ruta
module.exports = router