import { Input, Output, Redistribution, RedistributionDef } from 'app/schema';
import { Money } from 'app/schema/money';

interface RedistributionTreeItem {
  name: string;
  source: Redistribution;
  parents: RedistributionTreeItem[];
}

export class RedistributionTree implements Output, Input {

  redistributions: { def: RedistributionDef, instance: Redistribution }[] = [];

  inputs: { [input: string]: Redistribution } = {};
  outputs: { [output: string]: Redistribution } = {};

  constructor(private redistributionDefs: RedistributionDef[]) {

  }

  buildTree(inputs: string[], outputs: string[]) {

    const resolvedOutputs = outputs.map(output => this.resolveOutput(output, inputs));

    console.log(resolvedOutputs);
    // link found root redistribution to the outputs
    resolvedOutputs.forEach(({ output, redistribution }) => this.outputs[output] = redistribution);

  }

  resolveOutput(output: string, requestedInputs: string[], childRedistribution?: Redistribution) {

    // find which redistribution is providing this output
    const redistributionDef = this.redistributionDefs.find(item => item.outputs.indexOf(output) !== -1);

    // if output (input of child redistribution) is a requested input, save it as input
    if (requestedInputs.indexOf(output) !== -1) {
      this.inputs[output] = childRedistribution;
    }

    // if no redistribution save forced input and stop resolving
    if (!redistributionDef) {
      this.inputs[output] = childRedistribution;
      return;
    }

    // get redistribution if already in the tree, or create one
    let redistribution: Redistribution;

    let existingRedistribution = this.redistributions.find(item => item.def === redistributionDef);

    if (existingRedistribution) {
      redistribution = existingRedistribution.instance;
    }
    else {
      redistribution = new Redistribution(redistributionDef);
      this.redistributions.push({ def: redistributionDef, instance: redistribution });
    }

    // link parent redistributions to the child ones
    redistributionDef.inputs.forEach(input => {

      const parent = this.resolveOutput(input, requestedInputs, redistribution);

      if (parent) {
        redistribution.setParent(parent.output, parent.redistribution);
        parent.redistribution.setChild(parent.output, redistribution);
      }

    });

    return { output, redistribution };

  }

  // find the tree item for specified source and get the value
  getOutput(output: string): Money {
    return this.outputs[output] ? this.outputs[output].getOutput(output) : undefined;
  }

  setInput(input: string, money: Money): void {
    if (this.inputs[input]) this.inputs[input].setInput(input, money);
  }

  setInputs(inputs: { input: string, money: Money }[]): void {
    inputs.forEach(({ input, money }) => this.setInput(input, money));
  }

}