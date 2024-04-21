const subject = require('../model/subject');
let Subject = require('../model/subject');

async function getSubjects(req, res){
    let aggregateQuery = Subject.aggregate();

    Subject.aggregatePaginate(
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

async function getSubject(req, res){
    let subjectId = req.params.id;
    Subject.findById(subjectId, (err, subject) =>{
        if(err){res.status(400).send(err)}
        res.status(201).json(subject);
    })
}

async function postSubject(req, res) {
    const newSubject = new Subject({
        name: req.body.name,
        photo: req.body.photo,
        teacher: req.body.teacher
    });

    try {
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
}

async function updateSubject(req, res) {
    console.log("UPDATE recu subject : ");
    console.log(req.body);
    Subject.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, subject) => {
        if(err) {
            res.status(400).send(err);
        }
        res.status(201).json({message: `${subject.name} updated`, subject: subject})
    })
}

async function deleteSubject(req, res) {
    Subject.findByIdAndRemove(re.params.id, (err, subject) => {
        if(err) res.status(400).send(err);
        res.status(201).json({message: `${subject.name} deleted`})
    })
}

module.exports = { getSubjects, getSubject, postSubject, updateSubject, deleteSubject };