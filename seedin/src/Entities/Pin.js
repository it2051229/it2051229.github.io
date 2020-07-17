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
        averageGrossInterestRate, 
        averageNetInterestRate, 
        averageTenure, 
        netEarningsPercent,
        netPayoutPercent, 
        completedProjectsPercent, 
        numOngoingProjects,
        averageProjectInterestPercent, 
		averageProjectTenurePercent,
		averageNetInterestRateAfterTenure) {
        
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
			"averageGrossInterestRate": averageGrossInterestRate,
			"averageNetInterestRate": averageNetInterestRate,
			"averageTenure": averageTenure,
			"netEarningsPercent": netEarningsPercent,
			"netPayoutPercent": netPayoutPercent,
			"completedProjectsPercent": completedProjectsPercent,
			"numOngoingProjects": numOngoingProjects,
			"averageProjectInterestPercent": averageProjectInterestPercent,
			"averageProjectTenurePercent": averageProjectTenurePercent,
			"averageNetInterestRateAfterTenure": averageNetInterestRateAfterTenure
        }
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
			"averageGrossInterestRate": this.properties["averageGrossInterestRate"],
			"averageNetInterestRate": this.properties["averageNetInterestRate"],
			"averageTenure": this.properties["averageTenure"],
			"netEarningsPercent": this.properties["netEarningsPercent"],
			"netPayoutPercent": this.properties["netPayoutPercent"],
			"completedProjectsPercent": this.properties["completedProjectsPercent"],
			"numOngoingProjects": this.properties["numOngoingProjects"],
			"averageProjectInterestPercent": this.properties["averageProjectInterestPercent"],
			"averageProjectTenurePercent": this.properties["averageProjectTenurePercent"],
			"averageNetInterestRateAfterTenure": this.properties["averageNetInterestRateAfterTenure"]
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
			json["averageGrossInterestRate"],
			json["averageNetInterestRate"],
			json["averageTenure"],
			json["netEarningsPercent"],
			json["netPayoutPercent"],
			json["completedProjectsPercent"],
			json["numOngoingProjects"],
			json["averageProjectInterestPercent"],
			json["averageProjectTenurePercent"],
			json["averageNetInterestRateAfterTenure"]
        );

        return pin;
    }
}

export default Pin;
