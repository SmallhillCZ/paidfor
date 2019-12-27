import { Redistribution, RedistributionDef } from "app/schema";
import { Money } from 'app/schema/money';


export const EmployerTaxationRedistribution: RedistributionDef = {

  name: "Zaměstnavatel",

  inputs: ["supergross-wage"],

  outputs: ["gross-wage", "employer-health-insurance", "employer-social-insurance"],

  compute: (inputs) => {

    const supergrossWage = inputs["supergross-wage"] || new Money();
    const grossWage = supergrossWage.clone().divide(1.34);

    return {
      "employer-health-insurance": supergrossWage.slice(grossWage.clone().multiply(0.09)),
      "employer-social-insurance": supergrossWage.slice(grossWage.clone().multiply(0.25)),
      "gross-wage": supergrossWage
    };
  }

};