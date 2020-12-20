
const db = require("./db");
const isFunction = require("./helper").isFunction;

class Program{
    // This class allows us to manipulate a program in the database 

    constructor(n, p, c, e, g){
        this.name = n;
        this.price = p; //The price for one individual to register for the program
        this.capacity = c; //The capacity of the program
        this.registered = e; //The capacity of the program
        this.gender = g;
    }

    getPrice(){
        return this.price;
    }

    getCapacity(){
        return this.capacity;
    }

    getGender(){
        return this.gender;
    }

    getName(){
        return this.name;
    }

    async setPrice(price, callBack){
        // Get the price of the program from the database;
        var sql = 'UPDATE program SET price=$1 WHERE name=$2;';
        return await db.query(sql, [price, this.name]).then(res => {
            if (res.rowCount == 0) {
                console.log("No program called '" + this.name + "' could be found, so price was not updated.");
                return false;
            }
            this.price = price;
            if (isFunction(callBack)){
                callBack(true);
            }
            console.log("The " + this.name + " program price was updated to " + price);
            return true;
        }).catch(e => {
            if (isFunction(callBack)){
                callBack(false);
            }
            console.log("\n ERROR! \n Program with name: " + this.name + " caused the following error in updatePrice function. \n", e);
        });    
    }

    async setCapacity(capacity, callBack){
        // Get the capacity of the program from the database;
        var sql = 'UPDATE program SET capacity=$1 WHERE name=$2;';
        return await db.query(sql, [price, this.name]).then(res => {
            if (res.rowCount == 0) {
                console.log("No program called '" + this.name + "' could be found, so capacity was not updated.");
                return false;
            }
            this.capacity = capacity;
            if (isFunction(callBack)){
                callBack(true);
            }
            console.log("The " + this.name + " program capacity was updated to " + capacity);
            return true;
        }).catch(e => {
            if (isFunction(callBack)){
                callBack(false);
            }
            console.log("\n ERROR! \n Program with name: " + this.name + " caused the following error in updateCapacity function. \n", e);
        });
    }

    validate(gender){
        if (this.gender != gender){
            return "You cannot enrol in this program as it is only for " + this.gender + "s"
        } else if (this.capacity <= this.registered){
            return "You cannot enrol in this program as it is currently full"
        }
    }
}

module.exports.getPrograms = async function getPrograms(){
    // Get the price of the program from the database;
    var sql = 'SELECT * FROM program;';
    return await db.query(sql).then(res => {
        if (!res.rows[0]) {
            console.log("Uh Oh! No programs could be found. That's weird.");
            return false;
        }
	var x = 0;
        var programs = {};
        for (const program of res.rows) {
            x++;
            programs[program.name] = new Program(program.name, program.price, program.capacity, program.registered, program.gender);
            //console.log("Program " + program.name  + " was fetched from the database.");
        }
        console.log(x + " programs were fetched from the database.");
	return programs;
    }).catch(e => {
        console.log("\n ERROR! \n in getProgram function. Description below. \n", e);
        return false;
    });
}


module.exports.program = Program;
