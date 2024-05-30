// Namespace our app
var MyApp = MyApp || {};

// Define a constructor for Animal in MyApp namespace
MyApp.Animal = function(name) {
    this.name = name;
}

// Add a method to Animal's prototype
MyApp.Animal.prototype.speak = function() {
    return "My name is " + this.name;
}

// Define a constructor for Dog that inherits from Animal
MyApp.Dog = function(name, breed) {
    MyApp.Animal.call(this, name); // Call the parent constructor with current context
    this.breed = breed;
}

// Set Dog's prototype to be an instance of Animal
MyApp.Dog.prototype = Object.create(MyApp.Animal.prototype);

// Correct the constructor pointer because it points to Animal
MyApp.Dog.prototype.constructor = MyApp.Dog;

// Add a method to Dog's prototype
MyApp.Dog.prototype.describe = function() {
    return this.speak() + " and I am a " + this.breed;
}

// Using the constructors
var myDog = new MyApp.Dog("Rex", "German Shepherd");

console.log(myDog.describe()); // "My name is Rex and I am a German Shepherd"
