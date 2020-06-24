// Date library
class MyDate {

    // Create a date
    constructor(year, month, day) {
        this.properties = {
            "year": year,
            "month": month,
            "day": day
        };    
    }

    // Compare if this date goes before, equal or after the other date
    compareTo(other) {
        if(this.properties["year"] > other.properties["year"])
            return 1;
        
        if(this.properties["year"] < other.properties["year"])
            return -1;

        if(this.properties["month"] > other.properties["month"])
            return 1;
        
        if(this.properties["month"] < other.properties["month"])
            return -1;

        if(this.properties["day"] > other.properties["day"])
            return 1;

        if(this.properties["day"] < other.properties["day"])
            return -1;

        return 0;
    }

    // Return the date as yyyy-mm-dd format
    toString() {
        var month = this.properties["month"];
        var day = this.properties["day"];

        if(month < 10)
            month = "0" + month;

        if(day < 10)
            day = "0" + day;

        return this.properties["year"] + "-" 
            + month + "-" 
            + day;
    }

    // Add a month
    addMonth() {
        // Set the days for each month    
        var year = this.properties["year"];
        var month = this.properties["month"] + 1;
        var day = this.properties["day"];

        if(month > 12) {
            year++;
            month = 1;
        }

        return new MyDate(year, month, day);
    }

    // Return the proeprties of the date as a JSON
    toJson() {
        return {
            "year": this.properties["year"],
            "month": this.properties["month"],
            "day": this.properties["day"]
        }
    }

    // Get the date now
    static now() {
        var jsDate = new Date();
        return new MyDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
    }

    // Create a copy of the date as a new object
    static copy(date) {
        return new MyDate(date.properties["year"], date.properties["month"], date.properties["day"]);
    }

    // Attempt to create a date object out of the string date
    // Expects that the date is in yyyy-mm-dd format
    // Returns null if the date is invalid
    static toMyDate(strDate) {
        // Validate the format
        this.tokens = strDate.split("-");

        if(this.tokens.length != 3)
            return null;

        // Check that everything else is a number
        for(var i = 0; i < this.tokens.length; i++)
            if(isNaN(this.tokens[i]))
                return null;

        var year = parseInt(this.tokens[0]);
        var month = parseInt(this.tokens[1]);
        var day = parseInt(this.tokens[2]);

        // Validate the year
        if(year < 1900 || isNaN(year) || isNaN(month) || isNaN(day))
            return null;

        // Validate the month, should be 1 to 12
        if(month < 1 || month > 12)
            return null;

        // Validate the day, it should be within the month's day
        var daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];

        // February is 29 days during leap year
        if((year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0))
            daysInMonths[1] = 29;

        if(day < 1 || day > daysInMonths[month - 1])
            return null;
        
        // We're good
        return new MyDate(year, month, day);
    }

    // Convert the JSON to a date object
    static jsonToObject(json) {
        return new MyDate(
            json["year"],
            json["month"],
            json["day"]
        );
    }
}