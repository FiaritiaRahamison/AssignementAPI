let User = require('../model/user');

function getUsers(req, res) {
    let aggregateQuery = User.aggregate();

    User.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        },
        (err, data) => {
            if(err){
                res.send(err)
            }
    
            res.send(data);
        }
    );
}

function getUser(req, res) {
    let userId = req.params.id;
    User.findById(userId, (err, user) => {
        if(err){res.send(err)}
        res.json(user);
    })
}

function postUser(req, res) {
    let user = new User();
    user.login = req.body.login;
    user.password = req.body.password;

    console.log("POST user reçu :");
    console.log(user);

    user.save((err) => {
        if(err) {
            res.send('User non enregistrée ', err);
        }
        res.json({message: `${user.login} enregistrée!`})
    })
}

module.exports = { getUsers, getUser, postUser };
