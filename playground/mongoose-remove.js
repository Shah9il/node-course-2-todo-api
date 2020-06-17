const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

/* Todo.remove({}).then((result)=>{
    console.log(result);
});
 */

 Todo.findByIdAndRemove('5eea1c1c8f106102ace97c98').then((todo)=>{
    console.log(todo);
 });