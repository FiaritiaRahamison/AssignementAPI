let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/

async function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
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

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res){
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.status(400).json({message: err})}
        res.status(201).json(assignment);
    })

    /*
    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
    */
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    const newAssignment = new Assignment({
      title: req.body.title,
      creationDate: req.body.creationDate,
      description: req.body.description,
      subject: req.body.subject,
      author: req.body.author,
      isDone: req.body.isDone,
      dateDone: req.body.dateDone,
      isMark: req.body.isMark,
      mark: req.body.mark,
      remark: req.body.remark,
      deadline: req.body.deadline,
      link: req.body.link
    });
  
    try {
      const savedAssignment = await newAssignment.save();
      res.status(201).json(savedAssignment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            res.status(400).send(err)
        } else {
          res.status(201).json({message: `${assignment.title} updated`, assignment: assignment})
        }
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
async function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.status(400).send(err);
        }
        res.status(201).json({message: `${assignment.title} deleted`});
    })
}


async function getAssignmentWhereAuthor(req, res) {
    let name = req.query.name;
    let firstname = req.query.firstname;

    res.status(200).json({reponse: `${name} ${firstname}`})
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, getAssignmentWhereAuthor };