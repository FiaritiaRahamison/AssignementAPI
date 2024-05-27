const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const ROLES = require('../utils/enums');

const UserSchema = Schema({
    name: {type:String ,required : true},
    firstname: {type:String ,required : true},
    login: {type:String ,required : true},
    password: {type:String ,required : true},
    role: {
        type :Number, 
        enum :[ROLES.admin,ROLES.student,ROLES.teacher],
        required : true
    }, //1: student, 2: teacher, 3: admin
    photo: String
});

UserSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model('user', UserSchema);


module.exports = { UserModel,UserSchema};