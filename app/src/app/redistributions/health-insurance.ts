import { RedistributionDef, Money } from 'app/schema';

export const HealthInsuranceRedistribution: RedistributionDef = {

  name: "Zdravotní pojištění",

  inputs: ["employee-health-insurance", "employer-health-insurance"],
  outputs: ["health-insurance"],

  compute: (inputs) => {
    return {
      "health-insurance": Object.values(inputs).reduce((acc, cur) => acc.merge(cur), new Money())
    }
  }
};