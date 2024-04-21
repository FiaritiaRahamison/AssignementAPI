let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let UserSchema = Schema({
    name: String,
    firstname: String,
    login: String,
    password: String,
    role: Number, //1: student, 2: teacher, 3: admin
    photo: String
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('user', UserSchema);