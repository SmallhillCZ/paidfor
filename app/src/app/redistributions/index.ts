import { IncomeRedistribution } from './income';
import { RedistributionDef } from 'app/schema';
import { StateBudgetRedistribution } from './state-budget';
import { EUBudgetRedistribution } from './eu-budget';
import { HealthRedistribution } from './health';

export const redistributions: RedistributionDef[] = [
  IncomeRedistribution,
  StateBudgetRedistribution,
  EUBudgetRedistribution,
  HealthRedistribution
];