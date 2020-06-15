const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('../server/models/user');

/* var id = '5ee795ab500ace104cddfdc311';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}
 */
/* 
Todo.find({
    _id: id
}).then((todos)=>{
    console.log('Todos',todos);
});

Todo.findOne({
    _id: id
}).then((todo)=>{
    console.log('Todo: ',todo);
});
 */

/* 
Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('ID not found');
    }
    console.log('Todo: ',todo)
}).catch((e)=>console.log(e)); 
*/
var id = "5ee664ce4a54a51418c2dee6";

User.findById(id).then((userID)=>{
    if(!userID){
        console.log('User ID not found');
    }
    console.log('User',userID);
}).catch((e)=>console.log(e));