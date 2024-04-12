let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let UserSchema = Schema({
    login: String,
    password: String
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('user', UserSchema);