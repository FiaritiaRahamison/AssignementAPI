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
    let aggregateQuery = Assignment.aggregate([
        { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subject' } },
        { $lookup: { from: 'users', localField: 'subject.teacher', foreignField: '_id', as: 'subject.teacher' } }
    ]);

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
    
            data.docs.forEach(doc => {
                if (doc.author && doc.author.length > 0) {
                    doc.author = doc.author[0];
                }
                if (doc.subject && doc.subject.length > 0) {
                    doc.subject = doc.subject[0];
                }
                if (doc.subject.teacher && doc.subject.teacher.length > 0) {
                    doc.subject.teacher = doc.subject.teacher[0];
                }
            });

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
      creationDate: new Date(),
      description: req.body.description,
      subject: req.body.subject,
      author: req.body.author,
      isDone: req.body.isDone,
      dateDone: req.body.dateDone,
      isMark: req.body.isMark,
      mark: req.body.mark,
      remark: req.body.remark,
      deadline: new Date(req.body.deadline),
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


async function getAssignmentWhereAuthorAndIsDoneFalse(req, res) {
    let name = req.query.name;
    let firstname = req.query.firstname;

    let aggregateQuery = Assignment.aggregate([
        { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subject' } },
        { $lookup: { from: 'users', localField: 'subject.teacher', foreignField: '_id', as: 'subject.teacher' } },
        { $match: { "author.name": name, "author.firstname": firstname, "isDone": false } }
    ]);

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
    
            data.docs.forEach(doc => {
                if (doc.author && doc.author.length > 0) {
                    doc.author = doc.author[0];
                }
                if (doc.subject && doc.subject.length > 0) {
                    doc.subject = doc.subject[0];
                }
                if (doc.subject.teacher && doc.subject.teacher.length > 0) {
                    doc.subject.teacher = doc.subject.teacher[0];
                }
            });

            res.status(201).send(data);
        }
    );
}

async function getAssignmentWhereAuthorAndIsMarkFalse(req, res) {
    let name = req.query.name;
    let firstname = req.query.firstname;

    let aggregateQuery = Assignment.aggregate([
        { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subject' } },
        { $lookup: { from: 'users', localField: 'subject.teacher', foreignField: '_id', as: 'subject.teacher' } },
        { $match: { "author.name": name, "author.firstname": firstname, "isDone": true, "isMark": false } }
    ]);

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
    
            data.docs.forEach(doc => {
                if (doc.author && doc.author.length > 0) {
                    doc.author = doc.author[0];
                }
                if (doc.subject && doc.subject.length > 0) {
                    doc.subject = doc.subject[0];
                }
                if (doc.subject.teacher && doc.subject.teacher.length > 0) {
                    doc.subject.teacher = doc.subject.teacher[0];
                }
            });

            res.status(201).send(data);
        }
    );
}

async function getAssignmentWhereAuthorAndIsMarkTrue(req, res) {
    let name = req.query.name;
    let firstname = req.query.firstname;

    let aggregateQuery = Assignment.aggregate([
        { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
        { $lookup: { from: 'subjects', localField: 'subject', foreignField: '_id', as: 'subject' } },
        { $lookup: { from: 'users', localField: 'subject.teacher', foreignField: '_id', as: 'subject.teacher' } },
        { $match: { "author.name": name, "author.firstname": firstname, "isMark": true } }
    ]);

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
    
            data.docs.forEach(doc => {
                if (doc.author && doc.author.length > 0) {
                    doc.author = doc.author[0];
                }
                if (doc.subject && doc.subject.length > 0) {
                    doc.subject = doc.subject[0];
                }
                if (doc.subject.teacher && doc.subject.teacher.length > 0) {
                    doc.subject.teacher = doc.subject.teacher[0];
                }
            });

            res.status(201).send(data);
        }
    );
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment,
                getAssignmentWhereAuthorAndIsDoneFalse, getAssignmentWhereAuthorAndIsMarkFalse, getAssignmentWhereAuthorAndIsMarkTrue };