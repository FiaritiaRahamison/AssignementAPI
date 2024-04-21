let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let SubjectSchema = Schema({
    name: String,
    photo: String,
    teacher: { type: Schema.Types.ObjectId, ref: 'User' }
});

SubjectSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('subject', SubjectSchema);