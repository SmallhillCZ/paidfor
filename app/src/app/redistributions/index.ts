import { RedistributionDef } from 'app/schema';
import { StateBudgetRedistribution } from './state-budget';
import { EUBudgetRedistribution } from './eu-budget';
import { HealthInsuranceRedistribution } from './health-insurance';
import { EmployeeTaxationRedistribution } from './employee-taxation';
import { EmployerTaxationRedistribution } from './employer-taxation';

export const redistributions: RedistributionDef[] = [
  EmployeeTaxationRedistribution,
  EmployerTaxationRedistribution,
  StateBudgetRedistribution,
  EUBudgetRedistribution,
  HealthInsuranceRedistribution
];