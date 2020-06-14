//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log(`Connected to MongoDB server`);
    const db = client.db('TodoApp');
     /* 
    db.collection('Todos').insertOne({
        text:'Something to do',
        completed: false
    },(err,result)=>{
        if(err){
            return console.log(`Unable to insert Todo`);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
 */
/* 
    db.collection('Users').insertOne({
        name: 'Mirza Golam Abbas Shahneel',
        age: 31,
        location: '18/5, Hossaini Dalan Road, Dhaka - 1211'
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert user data',err);
        }
        console.log(JSON.stringify(result.ops,undefined,2));
    });
 */
    client.close();
});