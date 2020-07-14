import Investment from "./Investment";
import Pin from "./Pin";

// Our database just uses the local storage
class Database
{
    // Initialize the data
    constructor() {
        if(!("investments" in localStorage)) {
            localStorage.setItem("investments", JSON.stringify({}));
            console.log("New investments storage created.");
        }

        if(!("pins" in localStorage)) {
            localStorage.setItem("pins", JSON.stringify([]));
            console.log("New pins storage created.");
        }

        // Parse back the investments as an investment object
        var investmentsJson = JSON.parse(localStorage.getItem("investments"));

        this.investments = {};

        for(var i = 0; i < investmentsJson.length; i++) {
            var investment = Investment.jsonToObject(investmentsJson[i])
            this.investments[investment.properties["projectId"]] = investment;
        }

        // Parse the pins back as an object
        var pinsJson = JSON.parse(localStorage.getItem("pins"));
        this.pins = [];

        for(var j = 0; j < pinsJson.length; j++) {
            var pin = Pin.jsonToObject(pinsJson[j]);
            this.pins.push(pin);
        }
    }

    // Export it as json
    exportAsJson(version) {
        var investmentsJson = [];

        // Serialize everything as a json object
        for(var projectId in this.investments)
            investmentsJson.push(this.investments[projectId].toJson());

        // Write to the storage
        localStorage.setItem("investments", JSON.stringify(investmentsJson));

        var pinsJson = [];

        for(var i = 0; i < this.pins.length; i++)
            pinsJson.push(this.pins[i].toJson());
        
        return { 
            "version": version,
            "investments": investmentsJson,
            "pins": pinsJson
        };
    }

    // Convert the JSON to investment objects
    importJson(appVersion, toImportJson) {        
        if(!("version" in toImportJson))
            // Attempt to migrate
            return this.importJsonVersion_1_0_0(toImportJson);

        // For those that has a version, we can start impoort as it is
        if(toImportJson["version"] === "1.2.1")
            return this.importJsonVersion_1_2_1(toImportJson);

        return false;
    }

    // Try to import from version 1.2.1
    importJsonVersion_1_2_1(toImportJson) {
        if(!("investments" in toImportJson) || !("pins" in toImportJson))
            return false;

        // Look for the investments key, put it as investment objects
        var tempInvestments = {};
        var investmentsJson = toImportJson["investments"];

        for(var i = 0; i < investmentsJson.length; i++) {
            try {
                var investment = Investment.jsonToObject(investmentsJson[i]);
                tempInvestments[investment.properties["projectId"]] = investment;
            } catch(err) {
                console.log(err);
                return false;
            }
        }

        this.investments = tempInvestments;

        // Look for the pins key, they will remain as json object
        var tempPins = [];
        var pinsJson = toImportJson["pins"];

        for(var j = 0; j < pinsJson.length; j++) {
            try {
                var pin = Pin.jsonToObject(pinsJson[j]);
                tempPins.push(pin);
            } catch(err) {
                console.log(err);
                return false;
            }
        }

        this.pins = tempPins;

        this.persist();
        return true;
    }

    // Try to import from version 1.0.0
    importJsonVersion_1_0_0(toImportJson) {
        var tempInvestments = {};

        for(var i = 0; i < toImportJson.length; i++) {
            try {
                var investment = Investment.jsonToObject(toImportJson[i]);
                tempInvestments[investment.properties["projectId"]] = investment;
            } catch(err) {
                console.log(err);
                return false;
            }
        }

        // If all goes fine we're done
        this.investments = tempInvestments;
        this.persist();
        return true;
    }

    // Find the investment that holds the given ID, return null if none
    findInvestment(projectId) {
        if(!(projectId in this.investments))
            return null;

        return this.investments[projectId];
    }

    // Delete an investment
    deleteInvestment(projectId) {
        delete this.investments[projectId];
        this.persist();
    }

    // Add a new investment, assumes that the investment has been well validated
    addInvestment(investment) {
        this.investments[investment.properties["projectId"]] = investment;        
        this.persist();
    }

    // Return the investments as a list
    getInvestments() {
        var investmentsList = [];

        for(var projectId in this.investments)
            investmentsList.push(this.investments[projectId]);

        return investmentsList;
    }

    // Add a new pin
    addPin(pin) {
        this.pins.push(pin);
        this.persist();
    }

    // Delete a pin
    deletePin(index) {
        this.pins.splice(index, 1);
        this.persist();
    }

    // Return the pins as a copy of the list
    getPins() {
        return this.pins.slice();
    }

    // Write the investments to the local storage
    persist() {        
        var investmentsJson = [];

        // Serialize everything as a json object
        for(var projectId in this.investments)
            investmentsJson.push(this.investments[projectId].toJson());

        // Write to the storage
        localStorage.setItem("investments", JSON.stringify(investmentsJson));

        var pinsJson = [];

        for(var i = 0; i < this.pins.length; i++)
            pinsJson.push(this.pins[i].toJson());

        localStorage.setItem("pins", JSON.stringify(pinsJson));
    }

    // Delete everything from the database
    clear() {
        this.investments = {};
        this.pins = [];
        this.persist();
    }
}

export default Database;
