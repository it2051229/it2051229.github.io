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
        console.log(this.stocks);
    }

    // Return the list of stock names
    getStockNames() {
        return Object.keys(this.stocks);
    }

    // Return the names of people related to a stock
    getStockInsiders(stock) {
        return Object.keys(this.stocks[stock]);
    }

    // Return the list of transactions of a person of a specific stock
    getInsiderTransactions(stock, person) {
        return this.stocks[stock][person];
    }

    // Delete the stock given the name
    deleteStock(stock) {
        delete this.stocks[stock];
        this.persist();
    }

    // Add a new transaction to the database
    addTransaction(stock, person, date, shares, type, price) {
        // Add the stock if it doesn't exist yet
        if(!(stock in this.stocks))
            this.stocks[stock] = {};

        // Add the person if it doesn't exist yet in the stock
        if(!(person in this.stocks[stock]))
            this.stocks[stock][person] = []

        // Add the transaction for the person
        this.stocks[stock][person].push({ 
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
