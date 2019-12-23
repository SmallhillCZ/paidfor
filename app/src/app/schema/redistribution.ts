import { redistributions } from 'app/redistributions';
import { TranslationWidth } from '@angular/common';
import { Money } from './money';

export interface Output {
  getOutput(name: string): Money;
}

export interface Input {
  setInput(name: string, money: Money): void;
  setInputs(inputs: { input: string, money: Money }[]): void;
}

export interface RedistributionDef {
  name: string;
  inputs: string[];
  outputs: string[];
  compute: (inputs: { [name: string]: Money }) => { [name: string]: Money };
}

export class Redistribution implements Output, Input {

  title: string;

  inputs: { [input: string]: Money } = {};
  outputs: { [output: string]: Money } = {};

  parents: { [input: string]: Redistribution } = {};
  children: { [output: string]: Redistribution } = {};

  _compute: RedistributionDef["compute"];

  constructor(def: RedistributionDef) {
    this.title = def.name;
    this._compute = def.compute;
    def.inputs.forEach(input => this.inputs[input] = new Money());
  }

  compute(): void {
    this.outputs = this._compute(this.inputs);    
    Object.entries(this.children).forEach(([output, redistribution]) => redistribution.setInput(output, this.outputs[output]));
  }

  setInput(input: string, money: Money): void {
    this.inputs[input].merge(money);
    this.compute();
  }

  setInputs(inputs: { input: string, money: Money }[]): void {
    inputs.forEach(({ input, money }) => this.setInput(input, money));
    this.compute();
  }

  getOutput(output: string): Money {
    return this.outputs[output];
  }

  setParent(input: string, redistribution: Redistribution): void {
    this.parents[input] = redistribution;
  }

  setChild(output: string, redistribution: Redistribution): void {
    this.children[output] = redistribution;
  }

}