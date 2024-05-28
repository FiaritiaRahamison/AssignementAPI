const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const { SubjectSchema } = require('./subject');
const { UserSchema } = require('./user');

const AssignmentResultSchema = Schema({
    assignmentId : {type : String , required : true},
    author : {type : UserSchema},
    link : {type : String , default : ''},
    dateDone : {type: Date , default : Date.now},
    mark :{type : Number , default : 0},
    remark : String,
    isMarked : {type : Boolean , default : false},
    dateMarked : Date
});

const AssignmentResultModel = mongoose.model('AssignmentResult',AssignmentResultSchema);

const AssignmentSchema = Schema({
    title: {type: String , required :true},
    creationDate: {type: Date , default: Date.now},
    description: String,
    subject: { type: SubjectSchema , required :true },
    deadline: {type :Date , required :true},
    link: String,
    results : { type : [AssignmentResultSchema] , default :[]}
});

AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)

const AssignmentModel = mongoose.model('assignment', AssignmentSchema); 

module.exports = {AssignmentResultModel,AssignmentResultSchema,AssignmentModel,AssignmentSchema};
