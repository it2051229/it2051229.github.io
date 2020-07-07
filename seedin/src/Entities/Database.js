import Investment from "./Investment";

// Our database just uses the local storage
class Database
{
    // Initialize the data
    constructor() {
        if(!("investments" in localStorage)) {
            localStorage.setItem("investments", JSON.stringify({}));
            console.log("New investments storage created.");
        }

        var investmentsJson = JSON.parse(localStorage.getItem("investments"));

        // Parse back the investments as an investment object
        this.investments = {};

        for(var i = 0; i < investmentsJson.length; i++) {
            var investment = Investment.jsonToObject(investmentsJson[i])
            this.investments[investment.properties["projectId"]] = investment;
        }
    }

    // Convert the JSON to investment objects
    importJson(toImportInvestmentsJson) {
        var tempInvestments = {};

        for(var i = 0; i < toImportInvestmentsJson.length; i++) {
            try {
                var investment = Investment.jsonToObject(toImportInvestmentsJson[i]);
                tempInvestments[investment.properties["projectId"]] = investment;
            } catch(err) {
                console.log(err);
                return false;
            }
        }

        // If all goes fine, then we replace
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
        var investmentsJson = []

        // Serialize everything as a json object
        for(var projectId in this.investments)
            investmentsJson.push(this.investments[projectId].toJson());

        // Write to the storage
        localStorage.setItem("investments", JSON.stringify(investmentsJson));
    }

    // Delete everything from the database
    clear() {
        this.investments = [];
        this.persist();
    }
}

export default Database;
