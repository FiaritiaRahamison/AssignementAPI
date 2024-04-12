let Matiere = require('../model/matiere');

function getMatieres(req, res){
    let aggregateQuery = Matiere.aggregate();

    Matiere.aggregatePaginate(
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

function getMatiere(req, res){
    let matiereId = req.params.id;
    Matiere.findById(matiereId, (err, matiere) =>{
        if(err){res.send(err)}
        res.json(matiere);
    })
}