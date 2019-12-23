import { Redistribution, RedistributionDef } from "app/schema";
import { Money } from 'app/schema/money';


export const IncomeRedistribution: RedistributionDef = {

  name: "Daně ze mzdy",

  inputs: ["income"],

  outputs: ["income-tax", "net-income", "health-tax"],

  compute: (inputs) => ({
    "income-tax": inputs["income"] ? inputs["income"].slicePortion(0.15) : undefined,
    "health-tax": inputs["income"] ? inputs["income"].slicePortion(0.3) : undefined,
    "net-income": inputs["income"] ? inputs["income"] : undefined
  })

};