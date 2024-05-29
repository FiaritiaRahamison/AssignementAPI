const { UserModel:User } = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responde = require('../utils/generalResponse');
const {generateToken} = require('../utils/jwt');
const ROLES = require('../utils/enums');

const getTeachers = async (req,res) =>{
    let aggregateQuery = User.aggregate([{
        $match :{
            role : ROLES.teacher
        }
    }]);

    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 100
        },
        (err, data) => {
            if(err){
                console.log(err);
                res.status(400).json(responde({},err.message));
            }else{
                res.status(200).json(responde(data));
            }
        }
    );
}

const getStudents = async (req,res) =>{
    let aggregateQuery = User.aggregate([{
        $match :{
            role : ROLES.student
        }
    }]);

    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 100
        },
        (err, data) => {
            if(err){
                console.log(err);
                res.status(400).json(responde({},err.message));
            }else{
                res.status(200).json(responde(data));
            }
        }
    );
}

//Récupérer tous les users (GET)
async function getUsers(req, res) {
    let aggregateQuery = User.aggregate();

    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                console.log(err);
                res.status(400).json(responde({},err.message));
            }else{
                res.status(200).json(responde(data));
            }
        }
    );
}

//Récupérer un user par son id (GET)
async function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err){
            console.log(err)
            res.status(400).json(responde({},err.message))
        } 
        else res.status(200).json(responde(user));
    })
}

//Ajout d'un user (POST)
async function postUser(req, res) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        const dupUser = await User.findOne({login: req.body.login});
        if(dupUser){
            throw new Error("Login invalide");
        }

        const newUser = new User({
            name: req.body.name,
            firstname: req.body.firstname,
            login: req.body.login,
            password: hashedPassword,
            role: req.body.role,
            photo: req.body.photo,
        });

        const savedUser = await newUser.save();
        res.status(201).json(responde(savedUser));
    } catch (err) {
        console.log(err);
        res.status(400).json(responde({},err.message));
    }
};

//Update un user (PUT)
async function updateUser(req, res) {
    console.log("UPDATE recu user : ");
    console.log(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) {
            console.log(err)
            res.status(400).send(responde({},err.message));
        } else {
            res.status(201).json(responde(user,`${user.name} updated`));
        }
    });
}

async function deteleUser(req, res) {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) {
            console.log(err)
            res.status(400).send(err);
        }
        res.status(201).json({message: `${user.name} deleted`});
    })
}

async function loginUser(req, res) {
    const {login, password} = req.body;

    try {
        const user = await User.findOne({ login });
        if(!user) {
            res.status(400).json(responde({},'Utilisateur introuvable'));
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            res.status(400).json(responde({},'Mot de passe incorrect'));
        }

        const token = generateToken({id : user._id});


        res.json(responde({
            token,
            user: {
                id: user._id,
                name: user.name,
                firstname: user.firstname,
                login: user.login,
                role: user.role,
                photo: user.photo,
            },
        }));

    } catch (err) {
        console.log(err)
        res.status(400).json(responde({},err.message));
    }
}

module.exports = { getUsers, getUser, postUser, updateUser, deteleUser, loginUser , getTeachers, getStudents};
