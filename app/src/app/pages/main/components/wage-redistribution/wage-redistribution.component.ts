import { Component, OnInit } from '@angular/core';
import { RedistributionTree } from 'app/utils/redistribution-tree';
import { Money } from 'app/schema/money';
import { redistributions } from 'app/redistributions';
import { Project } from 'app/schema';

@Component({
  selector: 'app-wage-redistribution',
  templateUrl: './wage-redistribution.component.html',
  styleUrls: ['./wage-redistribution.component.scss']
})
export class WageRedistributionComponent implements OnInit {

  wage: number = Math.ceil(31000 * 12 * 1.34 / 100) * 100;

  project: Project;

  tree: RedistributionTree;

  treeInputs: any[];
  treeOutputs: any[];

  chartData: Array<[string, string, number]> = [];
  chartSelection: number[];

  hideOther: boolean = false;

  amountPaid: number;

  constructor() { }

  ngOnInit() {

    this.buildTree();

    this.updateChart();
  }

  buildTree() {

    this.project = new Project({
      name: "Čapí hnízdo",
      sources: [
        { input: "eu-funds", amount: 50 * Math.pow(10, 6) }
      ]
    });

    this.tree = new RedistributionTree(redistributions);

    this.treeInputs = [
      { input: "supergross-wage", money: new Money([{ amount: this.wage, id: "my-wage" }]) },
      { input: "other-income", money: new Money([{ amount: 1103259593000, id: "other" }]) },
      { input: "eu-support", money: new Money([{ amount: 	45281 * Math.pow(10, 6), id: "eu-help" }]) }
    ];

    this.treeOutputs = [...this.project.inputs(), "net-income"];

    this.tree.buildTree(this.treeInputs.map(input => input.input), this.treeOutputs);

    this.tree.addInputs(this.treeInputs);

  }

  updateChart() {
    const chartData: [string, string, number][] = [];
    const otherChartData: [string, number][] = [];

    const selection: number[] = [];

    this.tree.redistributions.forEach(({ def, instance }) => {
      Object.entries(instance.outputs).forEach(([output, money]) => {
        if (instance.children[output]) {
          chartData.push([instance.title, instance.children[output].title, money.sum("my-wage")]);
        }
        else if (this.treeOutputs.indexOf(output) === -1) {
          otherChartData.push([instance.title, money.sum("my-wage")]);
        }
      });
    })

    // chartData.push(["Superhrubá mzda", this.tree.inputs["supergross-wage"].title, this.wage]);
    chartData.push([this.tree.outputs["net-income"].title, "Čistá mzda", this.tree.getOutput("net-income").sum("my-wage")]);
    // otherChartData.push([this.tree.outputs["health-insurance"].title, this.tree.getOutput("health-insurance").sum("my-wage")]);

    this.project.sources.forEach(source => {
      const projectAmount = this.tree.getOutput(source.input).sum("my-wage") / this.tree.getOutput(source.input).sum() * source.amount;
      const otherAmount = this.tree.getOutput(source.input).sum("my-wage") - projectAmount;
      otherChartData.push([this.tree.outputs[source.input].title, otherAmount]);

      chartData.push([this.tree.outputs[source.input].title, this.project.name, projectAmount]);
      console.log([this.tree.outputs[source.input].title, this.project.name, projectAmount])
      selection.push(chartData.length - 1);
    })

    if (!this.hideOther) otherChartData.forEach(([sourceTitle, amount]) => chartData.push([sourceTitle, "Ostatní výdaje", amount]));

    this.amountPaid = Math.round(this.project.sources.reduce((acc, cur) => acc + this.tree.getOutput(cur.input).sum("my-wage") / this.tree.getOutput(cur.input).sum() * cur.amount, 0) * 100) / 100;

    this.chartData = chartData;
    this.chartSelection = selection;

    console.log(chartData);
  }

  setHideOther(hide: boolean) {
    this.hideOther = hide;
    this.updateChart();
  }

}
