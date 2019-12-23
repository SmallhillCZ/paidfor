import { RedistributionDef } from 'app/schema';
import { Money } from 'app/schema/money';

export const StateBudgetRedistribution: RedistributionDef = {

  name: "Státní rozpočet",

  inputs: ["income-tax"],
  outputs: ["state-budget-debt", "state-budget-wages", "state-budget-expenditures", "state-budget-eu"],

  compute: (inputs) => {

    const budget = Object.entries(inputs).reduce((acc, [input, money]) => acc.merge(money), new Money());

    return {
      "state-budget-eu": budget.slicePortion(0.1),
      "state-budget-debt": budget.slicePortion(0.2),
      "state-budget-wages": budget.sliceAmount(10000),
      "state-budget-expenditures": budget
    };
  }

}