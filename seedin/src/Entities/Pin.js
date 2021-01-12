class Pin {

    // Create a new pin
    constructor(fromDate, 
        toDate, 
        repaymentMethod, 
        issuer, 
        amountInvested,
        completedNetEarnings, 
        netEarnings, 
        projectedNetAmount, 
        completedNetPayoutAmount,
        completedProjects, 
        gainPercent, 
        numOngoingProjects,
		grossInterestRateStats,
		tenureStats,
		grossInterestRateAfterTenureStats,
		subscriptionDaysStats,
		idleDaysStats) {
        
        this.properties = {
            "fromDate": fromDate,
			"toDate": toDate,
			"repaymentMethod": repaymentMethod,
			"issuer": issuer,
			"amountInvested": amountInvested,
			"completedNetEarnings": completedNetEarnings,
			"netEarnings": netEarnings,
			"projectedNetAmount": projectedNetAmount,
			"completedNetPayoutAmount": completedNetPayoutAmount,
			"completedProjects": completedProjects,
			"gainPercent": gainPercent,
			"numOngoingProjects": numOngoingProjects,
			"grossInterestRateStats": grossInterestRateStats,
			"tenureStats": tenureStats,
			"grossInterestRateAfterTenureStats": grossInterestRateAfterTenureStats,
			"subscriptionDaysStats": subscriptionDaysStats,
			"idleDaysStats": idleDaysStats
		}
		
		// If any of the properties are undefined then throw an exception
		for(var key in this.properties)
			if(this.properties[key] === undefined)
				throw new Error(key + " is undefined");
    }

    // Return the properties as a JSON
    toJson() {
        return {
            "fromDate": this.properties["fromDate"],
			"toDate": this.properties["toDate"],
			"repaymentMethod": this.properties["repaymentMethod"],
			"issuer": this.properties["issuer"],
			"amountInvested": this.properties["amountInvested"],
			"completedNetEarnings": this.properties["completedNetEarnings"],
			"netEarnings": this.properties["netEarnings"],
			"projectedNetAmount": this.properties["projectedNetAmount"],
			"completedNetPayoutAmount": this.properties["completedNetPayoutAmount"],
			"completedProjects": this.properties["completedProjects"],
			"gainPercent": this.properties["gainPercent"],
			"numOngoingProjects": this.properties["numOngoingProjects"],
			"grossInterestRateStats": this.properties["grossInterestRateStats"],
			"tenureStats": this.properties["tenureStats"],
			"grossInterestRateAfterTenureStats": this.properties["grossInterestRateAfterTenureStats"],
			"subscriptionDaysStats": this.properties["subscriptionDaysStats"],
			"idleDaysStats": this.properties["idleDaysStats"]
        }
    }

    // Convert the json as a pin object
    static jsonToObject(json) {
        var pin = new Pin(
            json["fromDate"],
			json["toDate"],
			json["repaymentMethod"],
			json["issuer"],
			json["amountInvested"],
			json["completedNetEarnings"],
			json["netEarnings"],
			json["projectedNetAmount"],
			json["completedNetPayoutAmount"],
			json["completedProjects"],
			json["gainPercent"],
			json["numOngoingProjects"],
			json["grossInterestRateStats"],
			json["tenureStats"],
			json["grossInterestRateAfterTenureStats"],
			json["subscriptionDaysStats"],
			json["idleDaysStats"]
        );

        return pin;
    }
}

export default Pin;
