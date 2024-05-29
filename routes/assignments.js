const mongoose = require('mongoose');
const {AssignmentModel:Assignment,AssignmentResultModel:Result} = require('../model/assignment');
const {SubjectModel:Subject} = require('../model/subject');
const {UserModel:User} = require('../model/user');
const ROLES = require('../utils/enums');
const responde = require('../utils/generalResponse');

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

const getSubject = async (id)=> {
    try {
        const subject = await Subject.findById(id);
        if(!subject){
            throw new Error("Subject not found");
        }
        return subject;
    } catch (error) {
        throw error;
    }
}

const getStudentNewAssignments = async (userId,page,limit)=> {
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $match :{
                    results: {
                        $not: {
                            $elemMatch: {
                                'author._id': userId
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    creationDate: -1 // Sort by creationDate in descending order
                }
            },
            {
                $project:{
                    _id: 1,
                    title: 1,
                    creationDate: 1,
                    description: 1,
                    subject: 1,
                    deadline: 1,
                    link: 1,
                    results :{$literal: undefined}
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: page,
                limit: limit
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}

const getStudentDoneAssignments = async (userId,page,limit)=> {
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    'results.author._id': userId,
                    'results.isMarked': false
                }
            },
            {
                $sort: {
                    'results.dateDone': -1, // Sort by creationDate in descending order
                    creationDate : -1
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: page,
                limit: limit
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}

const getTeacherDoneAssignments = async (userId,page,limit)=> {
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    'subject.teacher._id': userId,
                    'results.isMarked': false
                }
            },
            {
                $sort: {
                    'results.dateDone': -1, // Sort by creationDate in descending order
                    creationDate : -1
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: page,
                limit: limit
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}

const getStudentMarkedAssignments = async (userId,page,limit)=> {
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    'results.author._id': userId,
                    'results.isMarked': true
                }
            },
            {
                $sort: {
                    'results.dateDone': -1, // Sort by creationDate in descending order
                    creationDate : -1
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: page,
                limit: limit
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}

const getTeacherMarkedAssignments = async (userId,page,limit)=> {
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    'subject.teacher._id': userId,
                    'results.isMarked': true
                }
            },
            {
                $sort: {
                    'results.dateDone': -1, // Sort by creationDate in descending order
                    creationDate : -1
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: page,
                limit: limit
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}

const checkResult = async (assignmentId,userId) =>{
    try {
        const aggregateQuery = Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    _id: assignmentId,
                    'results.author._id': userId,
                }
            },
            {
                $sort: {
                    'results.dateDone': -1, // Sort by creationDate in descending order
                    creationDate : -1
                }
            }
        ]); 
        const results = await Assignment.aggregatePaginate(
            aggregateQuery, 
            {
                page: 1,
                limit: 10
            }
        );
        return results;
    } catch (error) {
        throw error;
    }
}


const addResult = async (req,res) =>{
    let session = null;
    try {
        let session = await mongoose.startSession();
        session.startTransaction();
        const {
            link
        } = req.body;

        const assignmentId = req.params.id;

        const verif = await checkResult(assignmentId,req.user._id);
        if(verif.docslength){
            throw new Error(`${user._id} : ${user.name} already submited his result`);
        } 
        
        const resultToInsert ={
            assignmentId,
            link,
            author : req.user
        }
        
        const rs = new Result(resultToInsert);
        const resultat = await rs.save({ session });

        const newAssignment = await Assignment.findOneAndUpdate(
            { _id: assignmentId },
            {
                $push: { results: resultat } 
            },
            { new: true, session } // Return the updated document
        );
        await session.commitTransaction();
        res.status(201).json(responde(newAssignment));
    } catch (error) {
        console.log(error);
        if(session){
            await session.abortTransaction();
        }
        res.status(400).json( responde({},error.message) );
    }finally{
        if(session){
            session.endSession();
        }
    }
}

const addNote = async (req,res) =>{
    let session = null;
    try {    
        const session = await mongoose.startSession();
        session.startTransaction();
        const {
            mark,
            remark
        } = req.body;

        const resultId = req.params.id;

        const exist = await Result.findOne({
            _id : resultId 
        });       

        if(!exist){
            throw new Error(`${resultId} result does not exists `);
        }else{
            if(exist.isMarked===true){
                throw new Error(`${resultId} result already marked`);
            }
        }

        const newResult = await Result.findByIdAndUpdate(
            resultId,
            {
                mark : mark,
                isMarked : true,
                remark : remark,
                dateMarked : new Date()
            },{
                new: true,
                session
            }
        );

        const newAssignment = await Assignment.findOneAndUpdate(
            { _id: newResult.assignmentId },
            {
                'results.$[elem].mark': mark,
                'results.$[elem].isMarked': true,
                'results.$[elem].remark': remark,
                'results.$[elem].dateMarked': newResult.dateMarked,
            },
            {
                new: true,
                session,
                arrayFilters: [{ 'elem._id': newResult._id }]
            }
        );
        
        await session.commitTransaction();
        res.status(201).json(responde(newAssignment));
    } catch (error) {
        console.log(error);
        if(session){
            await session.abortTransaction();
        }
        res.status(400).json( responde({},error.message) );
    }finally{
        if(session){
            session.endSession();
        }
    }
}


const getAssignmentsToDo =  async (req,res) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const results = await getStudentNewAssignments(req.user._id,page,limit);
        res.status(200).json(responde(results));    
    } catch (error) {
        console.log(error);
        res.status(400).json(responde({},error.message));    
    }
}

const getAssignmentsDone =  async (req,res) =>{
    try {
        const {user} = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let results ={} 
        if(user.role == ROLES.student){
            results = await getStudentDoneAssignments(user._id,page,limit);
        }else if(user.role == ROLES.teacher){
            results = await getTeacherDoneAssignments(user._id,page,limit);
        }
        res.status(200).json(responde(results));    
    } catch (error) {
        console.log(error);
        res.status(400).json(responde({},error.message));    
    }
}

const getAssignmentsMarked =  async (req,res) =>{
    try {
        const {user} = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let results ={} 
        if(user.role == ROLES.student){
            results = await getStudentMarkedAssignments(user._id,page,limit);
        }else if(user.role == ROLES.teacher){
            results = await getTeacherMarkedAssignments(user._id,page,limit);
        }   
        res.status(200).json(responde(results));
    } catch (error) {
        console.log(error);
        res.status(400).json(responde({},error.message));    
    }
}

const getStudentResultAssignment = async (resultId)=> {
    try {
        const results = await Assignment.aggregate([
            {
                $unwind : {
                    path: '$results'
                }
            },
            {
                $match :{
                    'results._id': mongoose.Types.ObjectId(resultId)
                }
            },
        ]);
        if (results && results.length > 0) {
            return results[0];
        }

        return null;
    } catch (error) {
        throw error;
    }
}

async function getAssignments(req, res){
    let aggregateQuery = Assignment.aggregate([
    ]);

    Assignment.aggregatePaginate(
        aggregateQuery, 
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 100
        },
        (err, data) => {
            if(err){
                res.status(400).json(responde({}, err.message));
            } else {
                res.status(200).json(responde(data, "Liste assignments OK"));
            }
        }
    );
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res){
    let assignmentId = req.params.id;
    try {
        const assignment = await Assignment.findById(assignmentId);
    
        if (!assignment) {
            res.status(400).json(responde({}, 'Assignment not found'));
        } else {
            res.status(200).json(responde(assignment));
        }
    
    } catch (err) {
        console.log(err)
        res.status(400).json(responde({}, err.message));
    }
}


// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    
    try {
        const subject = await getSubject(req.body.subject);
        const newAssignment = new Assignment({
          title: req.body.title,
          creationDate: new Date(),
          description: req.body.description,
          subject: subject,
          deadline: new Date(req.body.deadline),
          link: req.body.link
        });
        const savedAssignment = await newAssignment.save();
        res.status(201).json(responde(savedAssignment));
    } catch (err) {
        console.log(err)
        res.status(400).json( responde({},err.message) );
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
          res.status(201).json({message: `assignment updated`, assignment: assignment})
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

// Récupérer un assignmentResult par son id (GET)
async function getAssignmentResult(req, res){
    let assignmentId = req.params.id;
    try {
        const assignmentResult = await getStudentResultAssignment(assignmentId);
    
        if (!assignmentResult) {
            res.status(400).json(responde({}, 'AssignmentResult not found'));
        } else {
            res.status(200).json(responde(assignmentResult));
        }
    
    } catch (err) {
        console.log(err)
        res.status(400).json(responde({}, err.message));
    }
}

const getStudentAverageMarksBySubject = async (userId, page, limit) => {
    try {
      const aggregateQuery = Assignment.aggregate([
        { $unwind: { path: '$results' } },
        { $match: { 'results.author._id': userId, 'results.isMarked': true } },
        {
          $group: {
            _id: '$subject',
            averageMark: { $avg: '$results.mark' },
            assignments: { $push: '$$ROOT' }
          }
        },
        { $project: { _id: 0, subject: '$_id', averageMark: 1, assignments: 1 } },
        { $sort: { averageMark: -1 } }
      ]);
  
      const results = await Assignment.aggregatePaginate(
        aggregateQuery,
        { page: page, limit: limit }
      );
  
      return results;
    } catch (error) {
      throw error;
    }
}

const getTeacherAverageMarksByStudent = async (userId, page, limit) => {
    try {
      const aggregateQuery = Assignment.aggregate([
        { $unwind: { path: '$results' } },
        { $match: { 'results.isMarked': true, 'subject.teacher._id': userId } },
        {
          $group: {
            _id: { student: '$results.author', teacher: '$subject.teacher', subject: '$subject' },
            averageMark: { $avg: '$results.mark' },
            assignments: { $push: '$$ROOT' }
          }
        },
        {
          $project: {
            _id: 0,
            student: '$_id.student',
            subject: '$_id.subject',
            averageMark: 1,
            assignments: 1
          }
        },
        { $sort: { averageMark: -1 } }
      ]);
  
      const results = await Assignment.aggregatePaginate(
        aggregateQuery,
        { page: page, limit: limit }
      );
  
      return results;
    } catch (error) {
      throw error;
    }
}

const getAverageMark = async (req,res) => {
    try {
        const {user} = req;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let results ={}
        if(user.role == ROLES.student) {
            results = await getStudentAverageMarksBySubject(user._id,page,limit);
        }else if(user.role == ROLES.teacher) {
            results = await getTeacherAverageMarksByStudent(user._id,page,limit);
        }
        res.status(200).json(responde(results));    
    } catch(error) {
        console.log(error);
        res.status(400).json(responde({},error.message));
    }
}


module.exports = { 
    addNote,
    addResult,
    getAssignmentsMarked,
    getAssignmentsDone,
    getAssignmentsToDo,
    getAssignments,
    postAssignment, 
    getAssignment,
    getAssignmentResult,
    updateAssignment, 
    deleteAssignment,
    getAverageMark,
 };