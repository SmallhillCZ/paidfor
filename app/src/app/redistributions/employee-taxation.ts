import { Redistribution, RedistributionDef } from "app/schema";
import { Money } from 'app/schema/money';


export const EmployeeTaxationRedistribution: RedistributionDef = {

  name: "Zaměstnanec",

  inputs: ["gross-wage"],

  outputs: ["employee-income-tax", "net-income", "employee-health-insurance", "employee-social-insurance"],

  compute: (inputs) => {
    
    const grossWage = inputs["gross-wage"] || new Money();
    const supergrossWage = grossWage.clone().multiply(1.34);
    
    return {
      "employee-income-tax": grossWage.slice(supergrossWage.clone().multiply(0.15)),
      "employee-social-insurance": grossWage.slicePortion(0.065),
      "employee-health-insurance": grossWage.slicePortion(0.045),
      "net-income": grossWage
    };
  }

};