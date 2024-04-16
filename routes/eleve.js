let Eleve = require('../model/eleve');

function getEleves(req, res) {
    let aggregateQuery = Eleve.aggregate();

    Eleve.aggregatePaginate(
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

function getEleve(req, res) {
    let eleveId = req.params.id;
    Eleve.findById(eleveId, (err, eleve) => {
        if(err){res.send(err)}
        res.json(eleve);
    })
}

function postEleve(req, res) {
    let eleve = new Eleve();
    eleve.nom = req.body.nom;
    eleve.photo = req.body.photo;

    console.log("POST eleve reçu :");
    console.log(eleve);

    eleve.save((err) => {
        if(err) {
            res.send('Eleve non enregistrée ', err);
        }
        res.json({message: `${eleve.nom} enregistrée!`})
    })
}

module.exports = { getEleves, getEleve, postEleve };
