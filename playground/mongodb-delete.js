//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log(`Unable to connect to MongoDB server`);
    }
    console.log(`Connected to MongoDB server`);
    const db = client.db('TodoApp');
/* 
    db.collection('Todos').deleteMany({text: 'Watch movie'}).then((result)=>{
        console.log(result);
    },(err)=>{
        console.log(err);
    });
 *//* 
    db.collection('Todos').deleteOne({text: 'Take rest'}).then((result)=>{
        console.log(result);
    });
   */
  /* 
    db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
        console.log(result);
    });
   */

/*    db.collection('Users').find({name: 'Mirza Golam Abbas Shahneel'}).toArray().then((result)=>{
       console.log('Found following names');
       console.log(JSON.stringify(result,undefined,2));
       console.log('Going to delete above names');
       db.collection('Users').deleteMany({name: 'Mirza Golam Abbas Shahneel'}).then((result)=>{
           console.log(JSON.stringify(result.result,undefined,2));
       },(err)=>{
           console.log('1: Got error',err);
       });
   },(err)=>{
        console.log('2: Got error - ', err);
   });
 */   
/*    db.collection('Users').findOneAndDelete({
       _id: new ObjectID('5ee5d6658f106102ace95fe6')
   }).then((result)=>{
       console.log(JSON.stringify(result,undefined,2));
   },(err)=>{console.log(err)});
 */
    //client.close();
});