class Database
{
    // Initialize the data
    constructor() {
        this.databaseName = "insider-trading";

        // Create the storage for our app if not yet created
        // localStorage.removeItem(this.databaseName);
        if(!(this.databaseName in localStorage)) {
            localStorage.setItem(this.databaseName, JSON.stringify({}));
            console.log("New " + this.databaseName + " storage created.");
        }

        this.stocks = JSON.parse(localStorage.getItem(this.databaseName));
    }

    // Return the list of stock names
    getStockNames() {
        return Object.keys(this.stocks);
    }

    // Return the names of people related to a stock
    getStockInsiders(stockName) {
        if(!(stockName in this.stocks))
            return [];

        return Object.keys(this.stocks[stockName]);
    }

    // Remove an insider data from a stock
    removeStockInsider(stockName, insiderName) {
        if(!(stockName in this.stocks))
            return;
        
        delete this.stocks[stockName][insiderName];
        this.persist();
    }

    // Return the list of transactions of a person of a specific stock
    getInsiderTransactions(stockName, insiderName) {
        if(!(stockName in this.stocks) || !(insiderName in this.stocks[stockName]))
            return[];
            
        return this.stocks[stockName][insiderName];
    }

    // Delete the stock given the name
    deleteStock(stockName) {
        delete this.stocks[stockName];
        this.persist();
    }

    // Add a new transaction to the database
    addTransaction(stockName, insiderName, date, shares, type, price) {
        // Add the stock if it doesn't exist yet
        if(!(stockName in this.stocks))
            this.stocks[stockName] = {};

        // Add the person if it doesn't exist yet in the stock
        if(!(insiderName in this.stocks[stockName]))
            this.stocks[stockName][insiderName] = []

        // Add the transaction for the person
        this.stocks[stockName][insiderName].push({ 
            "date": date,
            "shares": shares,
            "type": type,
            "price": price 
        });
        
        this.persist();        
    }

    // Write the transactions to the local storage
    persist() {
        localStorage.setItem(this.databaseName, JSON.stringify(this.stocks));
        console.log(this.stocks);
    }
}

export default Database;
