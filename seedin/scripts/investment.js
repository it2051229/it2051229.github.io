class Investment {

    // Create a new investment object
    constructor(id, amount, interestRate, date, repaymentMethod, tenure, status) {
        this.properties = {
            "projectId": id,
            "investmentAmount": amount,
            "grossInterestRate": interestRate,
            "date": date,
            "repaymentMethod": repaymentMethod,
            "tenure": tenure,
            "projectUrl": "",
            "issuer": "",
            "status": status
        };
    }

    // Return the proeprties of the date as a JSON
    toJson() {
        return {
            "projectId": this.properties["projectId"],
            "investmentAmount": this.properties["investmentAmount"],
            "grossInterestRate": this.properties["grossInterestRate"],
            "date": this.properties["date"].toJson(),
            "repaymentMethod": this.properties["repaymentMethod"],
            "tenure": this.properties["tenure"],
            "projectUrl": this.properties["projectUrl"],
            "issuer": this.properties["issuer"],
            "status": this.properties["status"]
        };
    }

    // Calculate the net interest rate per annum
    calculateNetInterestRate() {
        var feeRate = 0.30;
        var netInterestRate = this.properties["grossInterestRate"] * (1 - feeRate);
        return netInterestRate;
    }

    // Calculate the interest rate within the tenure only
    calculateTenureInterestRate() {
        var netInterestRate = this.calculateNetInterestRate();
        var tenureInterestRate = (netInterestRate / 12.0) * this.properties["tenure"];
        return tenureInterestRate;
    }

    // Calculate the gain amount within the tenure
    calculateNetGainAmount() {
        var netGainAmount = this.calculateTenureInterestRate() * this.properties["investmentAmount"];
        return netGainAmount;
    }

    // How much is the interest payout per month
    calculateMonthlyNetInterestPayoutAmount() {
        var monthlyInterestRate = this.calculateNetInterestRate() / 12;
        return this.properties["investmentAmount"] * monthlyInterestRate;
    }

    // How much of the capital is returned per month
    calculateMonthlyCapitalPayoutAmount() {
        if(this.properties["repaymentMethod"] == "Equal")
            return this.properties["investmentAmount"] / this.properties["tenure"];
        
        return 0;
    }

    // Return the next paydate
    // Function is separated to save power
    calculateNextPayDate() {
        var currentDate = MyDate.now();
        var schedules = this.generateRepaymentSchedule();

        if(currentDate.compareTo(schedules[schedules.length - 1]["date"]) > 0)
            return null;
        
        // Find the month
        for(var i = 0; i < schedules.length; i++)
            if(currentDate.compareTo(schedules[i]["date"]) <= 0)
                return schedules[i]["date"];

        return null;
    }

    // Return the maturity date
    // Function is separated to save power
    calculateMaturityDate() {
        var schedules = this.generateRepaymentSchedule();
        return schedules[schedules.length - 1]["date"];
    }

    // Calculate the next payout date, how much, and when it will mature
    calculateNextPayAndMaturityDate() {        
        if(this.properties["status"] == "On Hold") {
            return {
                "maturityDate": "On Hold",
                "nextPayDate": "On Hold",
                "nextPayAmount": 0
            }            
        }

        var currentDate = MyDate.now();
        var schedules = this.generateRepaymentSchedule();

        var result = {
            "maturityDate": schedules[schedules.length - 1]["date"],
            "nextPayDate": "Completed",
            "nextPayAmount": 0
        };

        if(currentDate.compareTo(schedules[schedules.length - 1]["date"]) <= 0) {
            // Find the month and amount
            for(var i = 0; i < schedules.length; i++) {
                if(currentDate.compareTo(schedules[i]["date"]) <= 0) {
                    // Found it
                    result["nextPayDate"] = schedules[i]["date"];
                    result["nextPayAmount"] = schedules[i]["netPayout"];
                    break;
                }
            }
        }
        
        return result;
    }

    // Generate the repayment schedule based on repayment method
    generateRepaymentSchedule() {
        var schedules = [];
        var monthlyNetInterestPayoutAmount = this.calculateMonthlyNetInterestPayoutAmount();
        var monthlyCapitalAmount = this.calculateMonthlyCapitalPayoutAmount();

        var currentDate = MyDate.copy(this.properties["date"]);

        for(var i = 0; i < this.properties["tenure"]; i++) {
            var netPayout =  monthlyNetInterestPayoutAmount + monthlyCapitalAmount;
            
            // Balloon will have all the capital amount on the last month
            if(i + 1 == this.properties["tenure"] && this.properties["repaymentMethod"] == "Balloon")                
                netPayout += this.properties["investmentAmount"];
            
            var schedule = {
                "date": currentDate,
                "netInterestPayout": monthlyNetInterestPayoutAmount,
                "netPayout": netPayout
            }

            schedules.push(schedule);
            currentDate = currentDate.addMonth();
        }

        return schedules;
    }

    // Project ID is valid if it is not empty and it is unique
    static validateProjectId(projectId) {
        this.validationResult = { "status": true };

        if(projectId == "") {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Project ID is required.";
        }

        return this.validationResult;
    }

    // Amount should be a numeric value greater than 0
    static validateInvestedAmount(amount) {
        this.validationResult = { "status": true };

        if(amount == "") {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Invested amount is required.";
        } else if(isNaN(amount)) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Amount should be a numeric value.";
        } else if(amount <= 0) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Amount should be a non-zero positive value.";
        }

        return this.validationResult;
    }

    // Interest rate should be numeric between 1 and 20
    static validateGrossInterestRate(interestRate) {
        this.validationResult = { "status": true };

        if(interestRate == "") {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Gross interest rate amount is required.";
        } else if(isNaN(interestRate)) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Gross interest rate should be a numeric value.";
        } else if(interestRate < 1 || interestRate > 20) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Gross interest rate should be between 1% and 20% only.";
        }

        return this.validationResult;
    }

    // Check that the date is in the format yyyy-mm-dd
    static validateDate(date) {
        date = MyDate.toMyDate(date);
        this.validationResult = { "status": true };

        if(date == null) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Invalid date.";
        }

        return this.validationResult;
    }

    // Check that tenure is a number between 1 and 12
    static validateTenure(tenure) {
        this.validationResult = { "status": true };

        if(tenure == "") {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Tenure is required.";
        } else if(isNaN(tenure)) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Tenure should be a numeric value.";
        } else if(tenure < 1 || tenure > 12) {
            this.validationResult["status"] = false;
            this.validationResult["message"] = "Tenure should be between 1 and 12 months only.";
        }

        return this.validationResult;
    }

    // Convert the Json as an investment object
    static jsonToObject(json) {
        // Migratory code because we just added status
        if(!("status" in json))
            json["status"] = "Invested";
        
        var investment = new Investment(
            json["projectId"],
            json["investmentAmount"],
            json["grossInterestRate"],
            MyDate.jsonToObject(json["date"]),
            json["repaymentMethod"],
            json["tenure"],
            json["status"]
        );

        investment.properties["projectUrl"] = json["projectUrl"];
        investment.properties["issuer"] = json["issuer"];

        return investment;
    }

    // Find the dates of investment earliest and latest (first payout schedule up to the very last payout schedule)
    static getEarliestAndLatestInvestmentDates(investments) {
        if (investments.length == 0)
            return null;

        var earliestDate = null;
        var latestDate = null;

        for(var i = 0; i < investments.length; i++) {
            var investment = investments[i];
            var firstPayDate = investment.properties["date"];
            var lastPayDate = investment.calculateMaturityDate();
            
            if(earliestDate == null || firstPayDate.compareTo(earliestDate) < 0)
                earliestDate = firstPayDate;

            if(latestDate == null || lastPayDate.compareTo(latestDate) > 0)
                latestDate = lastPayDate;
        }

        return {
            "earliest": earliestDate,
            "latest": latestDate
        }
    }
    
    // Return all investments that lies on the given start and end date
    static filterInvestmentsByDate(investments, startDate, endDate) {
        return investments.filter(function(investment) {
            return investment.calculateMaturityDate().compareTo(startDate) >= 0
                && investment.properties["date"].compareTo(endDate) <= 0;
               
        });
    }

    // Return all investment that matches the repayment method
    static filterInvestmentsByRepaymentMethod(investments, repaymentMethod) {
        return investments.filter(function(investment) {
            return repaymentMethod == "All" 
                || repaymentMethod == investment.properties["repaymentMethod"];
        });
    }

    // Return all investment that matches the issuer
    static filterInvestmentsByIssuer(investments, issuer) {
        return investments.filter(function(investment) {
            return issuer == "All"
                || issuer == investment.properties["issuer"];
        });
    }

    // Get all unique issuers from the list of investments
    static getIssuers(investments) {
        var issuers = [];

        for(var i = 0; i < investments.length; i++) {
            var investment = investments[i];

            if("issuer" in investment.properties && investment.properties["issuer"] != "") {
                var issuer = investment.properties["issuer"];
                
                if(issuers.indexOf(issuer) <= -1)
                    issuers.push(issuer);
            }
        }

        issuers.sort();
        return issuers;
    }
}