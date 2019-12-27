import { RedistributionDef } from 'app/schema';
import { Money } from 'app/schema/money';

export const StateBudgetRedistribution: RedistributionDef = {

  name: "Státní rozpočet",

  inputs: ["employee-income-tax", "employee-social-insurance", "employer-social-insurance","other-income"],
  outputs: ["state-budget-debt", "state-budget-wages", "state-budget-expenditures", "state-budget-eu", "state-budget-social"],

  compute: (inputs) => {
    
    const budget = Object.values(inputs).reduce((acc, money) => acc.merge(money), new Money());

    return {
      "state-budget-eu": budget.slicePortion(0.033),
      "state-budget-debt": budget.slicePortion(0.2),
      "state-budget-social": budget.sliceAmount(0.5),
      "state-budget-wages": budget.sliceAmount(10000),
      "state-budget-expenditures": budget
    };
  }

}