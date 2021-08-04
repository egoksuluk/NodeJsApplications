// Functional programming --> Lambda syntax
numbers = [4,8,15,16,23,42]
// Even --> Square --> Sum
// Classical solution
let sum = 0 ;
for(let number of numbers){ // external loop
    if(number % 2==0){ //even
     sum = sum + number * number ;
    }
}
console.log(sum);

function even(number){
    return number%2==0;
}
function squared(number){
    return number * number;
}
function add(accumulate,number){
    return accumulate + number ;
}

// Functional programming --> Array,framework (MapReduce --> Hadoop)
// function --> no side-effect --> lambda expression
// 1- internal loop
sum = numbers.filter(even)
             .map(squared)
             .reduce(add,0);
console.log(sum);

// Lambda expression --> arrow function
sum = numbers.filter((n) => {return n % 2 == 0;})
             .map((n)=> {return n * n;})
             .reduce((acc,n)=> {return acc+n;},0);

sum = numbers.filter(n => n % 2 == 0)
             .map(n=> n * n)
             .reduce((acc,n)=> acc+n,0);

//büyükten küçüğe sıralama , lambda exp
//numbers.sort((x,y)=> y-x)
//küçükten büyüğe sıralama , lambda exp
//numbers.sort((x,y)=> x-y)

//generator function 
function get_evens(numbers) { //blocking function
    let even_numbers = [];
    for(let n of numbers){
        if(n%2 == 0) even_numbers.push(n);
    }
    return even_numbers;
}
let nums = [1,2,3,4,5,6,7,8,9,10];
for(let n of get_evens(nums)){
    console.log(n);
}

function* find_evens(numbers) { //generator function
    for(let n of numbers){
        console.log("find_evens:for:"+n);
        if(n%2 == 0) yield n;
    }
}

for(let n of find_evens(nums)){
    console.log(n);
}

