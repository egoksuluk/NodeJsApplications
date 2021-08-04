const mongoose = require("mongoose");
require("./utils");

//region mongodb
//1- mongodb connection
const mongodb_url = "mongodb://localhost:27017/hrdb";
const mongo_opts ={
    "useNewUrlParser" : true,
    "socketTimeoutMS" : 0,
    "keepAlive" : true,
    "useCreateIndex" : true,
    "useUnifiedTopology" : true
}
mongoose.connect(mongodb_url,mongo_opts);

//2- mongoose  --> Schema --> Entity
const employeeSchema = new mongoose.Schema({
    "_id":{
        type:String,
        required:true
    },
    "fullname":{
        type:String,
        required:true,
        minLength:5
    },
    "identityNo":{ //tc kimlik no
        type:String,
        required:true,
        unique:true,
        validate: [
            tcKimlikNoValidator,
            "You must provide a valid identity no."
        ]
    },
    "salary":{
        type:Number,
        required : true,
        min : 5000
    },
    "iban":{
        type:String,
        required:true,
        validate: [
            ibanValidator,
            "You must provide a valid iban."
        ]
    },
    "birthYear":{
        type : Number,
        required : true
    },
    "photo":{
        type : String,
        required : false,
        default: AppConfig.NO_IMAGE
    },
    "fulltime":{
        type : Boolean,
        required : false,
        default : true
    },
    "department":{
        type : String,
        enum : ["IT","Sales","Finance","HR"],
        required : false,
        default : "Finance"
    }
});

// 3. CRUD Persistence Object
const Employee = mongoose.model('employees',employeeSchema);
//endregion

//region express + swagger ui configuration
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const openApiDoc = require("./swagger-hr");

const port = 7001;
const api = express();
api.use(bodyParser.json({
    limit:"3mb"
}));
api.use(logger('dev'));

//CORS Filter
api.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","HEAD, POST, PUT, DELETE, GET");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})


// http://localhost:7001/api-docs
api.use("/api-docs",swaggerUi.serve,swaggerUi.setup(openApiDoc));

//endregion

//region rest over HTTP

//B2B --> Business to Business
//i.   Resource : Employee --> URL http(s)://server.example.com:8080 /hr/api/v1 /employees
//ii.  Methods  : GET, POST, PUT, PATCH, DELETE
//iii. Representation : XML,JSON,CSV, ... -->  JSON

// Hiring an employee
// POST http://localhost:7001/hr/api/v1/employees
api.post("/hr/api/v1/employees", (req,res) => {
    let emp = req.body;
    emp._id = emp.identityNo;
    let employee = new Employee(emp);
    employee.save((err, new_employee) => {
        res.set("Content-Type", "application/json");
        if (err){
            res.status(400).send({status: err});
        } else {
            sockets.forEach( socket => socket.emit('hire', new_employee));
            res.status(200).send(new_employee);
        }
    });
});

//PUT   --> Tüm employee entity'si
//PATCH --> Sadece değişen alanlar ( salary, department )
const updatableEmployeeFields = [
    "salary","photo","department","fulltime","iban"
];
// PUT http://localhost:7001/hr/api/v1/employees/17986085532
const updateOrPatch = (req,res)=>{
    let identity = req.params.identity;
    let emp = req.body; // full resource
    emp._id = emp.identity;

    let updatedEmployee = {};
    for(let field in emp){
        if(updatableEmployeeFields.includes(field)){
            updatedEmployee[field]= emp[field];
        }
    }
    Employee.update(
        {"identityNo":identity},
        {$set: updatedEmployee},
        {upsert:false},
        (err,new_emp)=>{
        res.set("Content-Type","application-json");
        if(err){
            res.status(404).send({status:err});
        }else{
            res.status(200).send({"status":"ok"});
        }
    });
};

// PUT http://localhost:7001/hr/api/v1/employees/11111111110
api.put("/hr/api/v1/employees/:identity", updateOrPatch);

// PATCH http://localhost:7001/hr/api/v1/employees/11111111110
api.patch("/hr/api/v1/employees/:identity", updateOrPatch);

// DELETE http://localhost:7001/hr/api/v1/employees/11111111110
api.delete("/hr/api/v1/employees/:identity",(req,res)=>{
    let identity = req.params.identity;
    Employee.findOneAndDelete(
        {"identityNo": identity},
        {_id: false},
        (err,emp) => {
            res.set("Content-Type", "application/json");
            if (err){
                res.status(404).send({status: err});
            } else {
                sockets.forEach( socket => socket.emit('fire', emp));
                res.status(200).send(emp);
            }
        }
    );
});

// GET http://localhost:7001/hr/api/v1/employees/11111111110
api.get("/hr/api/v1/employees/:identity",(req,res)=> {
    let identity = req.params.identity;
    Employee.findOne(
        {"identityNo": identity},
        {_id: false},
        (err,emp) => {
            res.set("Content-Type", "application/json");
            if (err){
                res.status(404).send({status: err});
            } else {
                res.status(200).send(emp);
            }
        }
    )
});
// GET http://localhost:7001/hr/api/v1/employees/51608105512/photo
api.get("/hr/api/v1/employees/:identity/photo",(req,res)=> {
    let identity = req.params.identity;
    Employee.findOne(
        {"identityNo": identity},
        {_id: false},
        (err,emp) => {
            res.set("Content-Type", "application/json");
            if (err){
                res.status(404).send({status: err});
            } else {
                res.status(200).send(emp);
            }
        }
    )
});

// GET http://localhost:7001/hr/api/v1/employees?page=10&size=15
// GET http://localhost:7001/hr/api/v1/employees
api.get("/hr/api/v1/employees",(req,res)=> {
    let page = Number(req.query.page || 0);
    let size = Number(req.query.size || 10);
    let offset = page * size ;
    Employee.find(
        {},
        {_id: false},
        {skip: offset, limit: size},
        (err,employees) => {
            res.set("Content-Type", "application/json");
            if (err){
                res.status(404).send({status: err});
            } else {
                res.status(200).send(employees);
            }
        }
    )
});

//endregion

let server = api.listen(port);

//region rest over ws
const sockets = [];
let io = require("socket.io").listen(server);
io.set("origins","*:*")
io.on("connect", socket => {
    sockets.push(socket);
    socket.on("disconnect", () => {
        let index = sockets.indexOf(socket);
        if (index >= 0){
            sockets.splice(index,1);
        }
    });
});
//endregion

console.log("Server is up and running at "+port+"...");