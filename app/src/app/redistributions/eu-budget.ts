import { RedistributionDef } from 'app/schema';
import { Money } from 'app/schema/money';

export const EUBudgetRedistribution: RedistributionDef = {

  name: "Rozpočet EU",

  inputs: ["state-budget-eu"],
  outputs: ["eu-funds"],

  compute: (inputs) => {
    return {
      "eu-funds": Object.values(inputs).reduce((acc, money) => acc.merge(money), new Money())
    };
  }

}