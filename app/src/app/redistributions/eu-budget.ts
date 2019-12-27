import { RedistributionDef } from 'app/schema';
import { Money } from 'app/schema/money';

/**
 * Should reimplement as EU budget with the whole EU budget amount and redistribution rules
 * I.e. we send some money, other states send some money, then some money is used on our spending and some on other
 */
export const EUBudgetRedistribution: RedistributionDef = {

  name: "EU",

  inputs: ["state-budget-eu", "eu-support"],
  outputs: ["eu-funds"],

  compute: (inputs) => {
    return {
      "eu-funds": Object.values(inputs).reduce((acc, cur) => acc.merge(cur), new Money())
    };
  }

}