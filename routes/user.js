let User = require('../model/user');

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
                res.status(400).send(err)
            }
    
            res.status(201).send(data);
        }
    );
}

//Récupérer un user par son id (GET)
async function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err){res.status(400).send(err)}
        res.status(201).json(user);
    })
}

//Ajout d'un user (POST)
async function postUser(req, res) {
    const newUser = new User({
        name: req.body.name,
        firstname: req.body.firstname,
        login: req.body.login,
        password: req.body.password,
        role: req.body.role,
        photo: req.body.photo,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

//Update un user (PUT)
async function updateUser(req, res) {
    console.log("UPDATE recu user : ");
    console.log(req.body);
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(201).json({message: `${user.name} updated`, user: user})
        }
    });
}

async function deteleUser(req, res) {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) {
            res.status(400).send(err);
        }
        res.status(201).json({message: `${user.name} deleted`});
    })
}

module.exports = { getUsers, getUser, postUser, updateUser, deteleUser };
