import { RedistributionDef, Money } from 'app/schema';

export const HealthRedistribution: RedistributionDef = {
  
  name: "Zdravotnictví",

  inputs: ["health-tax"],
  outputs: ["health-expenditures"],

  compute: (inputs) => {
    return {
      "health-expenditures": Object.values(inputs).reduce((acc, cur) => acc.merge(cur), new Money())
    }
  }
};