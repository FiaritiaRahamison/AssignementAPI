const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const { UserSchema } = require('./user');

const SubjectSchema = Schema({
    name: {type : String, required : true},
    photo: String,
    teacher: { type : UserSchema, required :true }
});

SubjectSchema.plugin(mongoosePaginate);

const SubjectModel =  mongoose.model('subject', SubjectSchema); 

module.exports = { SubjectModel, SubjectSchema }