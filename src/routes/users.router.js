import {Router} from 'express';
import {userModel} from '../dao/models/user.model.js';


const userRouter = Router();

//Leer documentos
userRouter.get('/' , async (req,res)=>{
    try{
        const users = await userModel.find()
        res.send({result:"Ok",payload:users})
    }
    catch(error){
        console.log("No se puede leer los usuarios"+error)
    }
});

//Crear documentos
userRouter.post('/' , async (req,res)=>{
    try{
        let {nombre, apellido, email} = req.body;

        if(!nombre || !apellido || !email)
        return res.status(400).send({status:"Error", message:"Complete todos los campos!"});

        const resultado = await userModel.create(req.body);
        res.send({status:"Usuario creado", payload:resultado})
    }
    catch(error){
        console.log("No se puede crear el usuario"+error);
    }
});

// Actualizar documentos
userRouter.put('/:id' , async (req,res)=>{
    try{
        let{id} = req.params;
        let {nombre, apellido, email} = req.body;

        if(!nombre || !apellido || !email)
        return res.status(400).send({status:"Error", message:"Complete todos los campos!"});

        const resultado = await userModel.updateOne({_id:id}, req.body);
        res.send({status:"Usuario actualizado", payload:resultado})
    }
    catch(error){
        console.log("No se puede actualizar el usuario"+error);
    }
});

//Eliminar documentos
userRouter.delete('/:id' , async (req,res)=>{
    try{
        let{id} = req.params;
        const resultado = await userModel.deleteOne({_id:id});
        res.send({status:"Eliminado", payload:resultado})
    }
    catch(error){
        console.log("No se puede eliminar el usuario"+error);
    }
});

export default userRouter;