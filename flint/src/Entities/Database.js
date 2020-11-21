import Investment from "./Investment";

// Our database just uses the local storage
class Database
{
    // Initialize the data
    constructor() {
		this.databaseName = "flint";
		
        if(!(this.databaseName in localStorage)) {
            localStorage.setItem(this.databaseName, JSON.stringify({}));
            console.log("New investments storage created.");
        }

        // Parse back the investments as an investment object
        var investmentsJson = JSON.parse(localStorage.getItem(this.databaseName));

        this.investments = {};

        for(var i = 0; i < investmentsJson.length; i++) {
            var investment = Investment.jsonToObject(investmentsJson[i])
            this.investments[investment.properties["projectId"]] = investment;
        }
    }

    // Export it as json
    exportAsJson() {
        var investmentsJson = [];

        // Serialize everything as a json object
        for(var projectId in this.investments)
            investmentsJson.push(this.investments[projectId].toJson());

        // Write to the storage
        localStorage.setItem(this.databaseName, JSON.stringify(investmentsJson));
        
        return { 
            "investments": investmentsJson,
        };
    }

    // Convert the JSON to investment objects
    importJson(toImportJson) {        
        if(!("investments" in toImportJson))
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

    // Write the investments to the local storage
    persist() {        
        var investmentsJson = [];

        // Serialize everything as a json object
        for(var projectId in this.investments)
            investmentsJson.push(this.investments[projectId].toJson());

        // Write to the storage
        localStorage.setItem(this.databaseName, JSON.stringify(investmentsJson));
    }

    // Delete everything from the database
    clear() {
        this.investments = {};
        this.persist();
    }
}

export default Database;
