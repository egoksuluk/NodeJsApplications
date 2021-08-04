// Asynchronous Programming --> async func.
class Employee {
    constructor(fullname,salary) {
        this.fullname = fullname;
        this.salary = salary;
        // alternative method to bind without lambda
        // this.sayHello = this.sayHello.bind(this);
    }
    sayHello = () =>{ //sync.
        console.log("Hello " + this.fullname+"!");
    }
}

let jack = new Employee("Jack Bauer",100000);
jack.sayHello(); //this --> jack
//async func.
                    //callback function - timeout
window.setInterval(jack.sayHello,1000);

let sync_get_sum = function (numbers) {
    if(numbers === undefined) throw "Provide numbers";
    let sum = 0;
    for(let number of numbers){
        sum+= number;
    }
    return sum;
};
let numbers = [1,2,3,4,5,6,7,8,9,10];
try{
    let sum = sync_get_sum(numbers);
    console.log(sum);
}catch (e) {}

// async function conversion
let sync_get_sum_conv = async function (numbers) {
    if(numbers === undefined) throw "Provide numbers";
    let sum = 0;
    for(let number of numbers){
        sum+= number;
    }
    return sum;
};

async function example() {
    try{ //await --> async function
        let sum = await sync_get_sum_conv(numbers);
        console.log(sum);
    }catch (e) {}
}
example().then(()=>{});

// ES7 buradaki promise yapısını "async" kelimesi ile otomatik sağlıyor.
let async_get_sum = function (numbers) {
    return  new Promise((resolve,reject)=>{
        if(numbers === undefined) reject("Provide numbers");
        let sum = 0;
        for(let number of numbers){
            sum+= number;
        }
        resolve(sum);
    });

};
let promise_sum = async_get_sum(numbers);
//do more important operations
//callback function
promise_sum.then(sum => console.log(sum)) // event driven programming
           .catch(e => console.error(e))


// Event-driven programming