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

function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
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

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;
    Assignment.findById(assignmentId, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
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
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: `${assignment.nom} updated`, assignment: assignment})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
// l'id est bien le _id de mongoDB
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
