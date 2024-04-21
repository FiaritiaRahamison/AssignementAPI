let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    title: String,
    creationDate: Date,
    description: String,
    subject: { type: Schema.Types.ObjectId, ref: 'Subject' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    isDone: Boolean,
    dateDone: Date,
    isMark: Boolean,
    mark: Number,
    remark: String,
    deadline: Date,
    link: String
});

AssignmentSchema.plugin(mongoosePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// assignment est le nom de la collection dans la base de données
// Mongoose tolère certaines erreurs dans le nom (ex: Assignent au lieu de assignments)
module.exports = mongoose.model('assignment', AssignmentSchema);
