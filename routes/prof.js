let Prof = require('../model/prof');

function getProfs(req, res) {
    let aggregateQuery = Prof.aggregate();

    Prof.aggregatePaginate(
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
    )
}

function getProf(req, res) {
    let profId = req.params.id;
    Prof.findById(profId, (err, prof) => {
        if(err){res.send(err)}
        res.json(prof);
    })
}

function postProf(req, res) {
    let prof = new Prof();
    prof.nom = req.body.nom;
    prof.photo = req.body.photo;

    console.log("POST prof reçu :");
    console.log(prof);

    prof.save((err) => {
        if(err) {
            res.send('Prof non enregistrée ', err);
        }
        res.json({message: `${prof.nom} enregistrée!`})
    })
}

module.exports = { getProfs, getProf, postProf };
