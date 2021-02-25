const express = require('express'); //bring express
//init App
const app = express(); //express function
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodedb');

let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to mongo DB');
});

//Check for DB errors
db.on('error', function(err){
    console.log(err);
});

//Bring in models
let Employee = require('./models/employee');

//Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');


// Body Parser Middleware 
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
//parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//Home route
app.get('/', (req,res)=>{
   Employee.find({}, function(err,employees){
       if(err){
           console.log(err);
       } else{
           //console.log(employees);
        res.render('index', {
            title : 'Employees',
            employees: employees
        });
       }
        
   });

});

//add route
app.get('/employees/add', function(req,res){
    res.render('add', {
        title: 'Add Employee'
    });
})

//Add Submit POST Route
app.post('/employees/add-employee', function(req,res){
    let employee = new Employee();
    employee.name = req.body.name;
    employee.cell = req.body.cell;
    employee.address = req.body.address;

    employee.save(function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});


//get single employee
app.get('/employee/:id', function(req,res){
    Employee.findById(req.params.id, function(err, employee){
        res.render('employee', {
            employee : employee
        });
    });
});

//Edit employee
app.get('/employee/edit/:id', function(req,res){
    Employee.findById(req.params.id, function(err, employee){
        res.render('edit_employee', {
            title : 'Edit Employee',
            employee : employee
        });
    });
});

//Update Submit POST Route
app.post('/employee/edit/:id', function(req,res){
    let employee = {};

    let query = {_id:req.params.id}
    employee.name = req.body.name;
    employee.cell = req.body.cell;
    employee.address = req.body.address;

    Employee.updateOne(query, employee, function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

//Delete single employee
app.delete('/employee/:id', function(req,res){
    let query = {_id:req.params.id}
    Employee.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});
//Start server
app.listen(port, function(){
    console.log(`Server started at port = ${port}`);
})
