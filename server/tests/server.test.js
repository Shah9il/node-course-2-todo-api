const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {todos, populateTodos,users,populateUsers} = require('./seed/seed');
const {User} = require('../models/user');
const user = require('../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
    it('Should create a new Todo',(done)=>{
        var text = "Test Todo text";
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('Should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=>done(e));
        });
    });

});

describe('GET /todos',()=>{
    it('Should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done);
    });
});


describe('GET /todos/:id',()=>{
    it('Should return todo doc',(done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return a 404',(done)=>{
        var hexString = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexString}`)
        .expect(404)
        .end(done);
    });

    it('Should return a 404 for non Object IDs',(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });

});


describe('DELETE /todos/:id',()=>{
    it('Should remove a todo',(done)=>{
        var hexID=todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexID}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(hexID);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.findById(hexID).then((todo)=>{
                expect(todo).toBe(null);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('Should return a 404',(done)=>{
        var hexString = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${hexString}`)
        .expect(404)
        .end(done);
    });

    it('Should return a 404 for non Object IDs',(done)=>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .end(done);
    });

});



describe('PATCH /todos/:id',()=>{
    it('Should update the todo',(done)=>{
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be new text';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).not.toBeNull();
        })
        .end(done);
    });

    it('Should clear completedAt when todo is not completed',(done)=>{
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be a new text!!';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeNull();
        })
        .end(done);
    });
});

describe('GET /users/me',() => {
    it('Should return a user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });
    it('Should a return 401 if not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toStrictEqual({});
        })
        .end(done);
    });
});


describe('POST /users',()=>{
    it('Should create a user',(done)=>{
        var email = 'example@example.com';
        var password = '1234mnb!';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.header['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err){
                done(err);
            }
            User.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('Should return validation errors if request invalid',(done)=>{
        var email = "asdf@asdf.asd";
        var password = "asdf";
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end(done);
    });

    it('Should not create user if email in user',(done)=>{
        var email = users[1].email;
        var password = users[1].password;

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end((err)=>{
            if(err){
                done(err);
            }else{
                done();
            }
        });
    });
});


describe('POST /users/login',()=>{
    it('Should login user and return auth token',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err,res)=>{
            if(err){
                done(err);
            };
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens[0]).toMatchObject({
                    access:'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e)=>done(e));
        });
    });
    it('Should login user and return auth token',(done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + '1'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).not.toBeTruthy();
        })
        .end((err,res)=>{
            if(err){
                done(err);
            };
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    });
});


describe('DELETE /users/me/token',()=>{
    it('Should remove Auth token on logout',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    });
});