// Object based
let o1 = { // object syntax
    x:0, //attribute
    y:0,
    radius:100,
    area: function () { // method
        return Math.PI * this.radius * this.radius;
    }
}
console.table(o1)
console.log(o1.area())

// Alternative syntax
o2 = {}
o2.x = 0
o2.y = 0
o2.radius = 100
o2.area = function () {
    return Math.PI * this.radius * this.radius;
}

// OOP --> Class Employee --> New Employee
let Circle = function (x,y,radius) { //Class --> Constructor
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.area = function () {
        return Math.PI * this.radius * this.radius;
    }
}
let o3 = new Circle(0,0,100);
let o4 = new Circle(1,1,200);
console.table(o3)
console.table(o4)
console.log(o3.area())
console.log(o4.area())
//since ES6
class Cember { // Class
    constructor (x,y,radius) { //Constructor
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.area = function () {
            return Math.PI * this.radius * this.radius;
        }
    }
};
let o5 = new Cember(200,200,400)
console.table(o5)
console.log(o5.area())

for(let p in o5){
    console.log(p+" : "+o5[p])
}
o5.hasOwnProperty("radius")

//Inheritance
//old syntax
Circle.prototype.color = "Red"

//es6 syntax --> syntactic sugar
class RenkliCember extends Cember{
    constructor(x,y,radius,color) {
        super(x,y,radius);
        this.color = color ;
    }
}
let kirmiziCember = new RenkliCember(1,2,3,"Sari");

//array
numbers = new Array(4,5,6,7)
numbers = [4,5,6,7]
console.log(numbers[0]) //4
console.log(numbers[3]) //7
console.log(numbers.length) //4
numbers[10] = 10
for(let ind in numbers){
    console.log("ind: "+ numbers[ind])
}

for(let ind=0;ind<numbers.length;ind++){
    console.log("ind: "+ numbers[ind])
}

for(let ind of numbers){
    console.log(ind)
}

// sorting arrays
// partial order function
// if x<y --> -1
// if x==y --> 0
// if x>y --> 1
numericOrderAsc = function (x,y) {return x-y;}
numericOrderDesc = function (x,y) {return y-x;}
numbers.sort(numericOrderAsc);
numbers.sort(numericOrderDesc);
names = ["jack","kate","james","jin","ben"]
names.sort();
names.sort(function(x,y){return y.localeCompare(x)})
"kate".localeCompare("jack") // --> Sözlük sıralaması




