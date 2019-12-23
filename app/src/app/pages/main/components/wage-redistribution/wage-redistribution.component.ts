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

  wage: number = 51200 * 12;

  project: Project;

  tree: RedistributionTree;

  treeInputs: any[];
  treeOutputs: any[];

  chartData: Array<[string, string, number]> = [];

  chartOptions = {
    height: 600,
    width: 800
  };

  hideOther: boolean = false;

  amountPaid: number;

  constructor() { }

  ngOnInit() {

    this.buildTree();

    this.updateChart();
  }

  buildTree() {

    this.project = new Project({
      name: "Projekt 1",
      sources: [
        { input: "state-budget-expenditures", amount: 20000000000 },
        { input: "eu-funds", amount: 10000000000 }
      ]
    });

    this.tree = new RedistributionTree(redistributions);

    this.treeInputs = [
      { input: "income", money: new Money([{ amount: this.wage, id: "my-wage" }]) },
      { input: "income-tax", money: new Money([{ amount: 1000000000000, id: "other-wages" }]) }
    ];

    this.treeOutputs = [...this.project.inputs(), "net-income"];

    this.tree.buildTree(this.treeInputs.map(input => input.input), this.treeOutputs);

    this.tree.setInputs(this.treeInputs);

  }

  updateChart() {
    this.chartData = [];
    const otherChartData = [];

    this.tree.redistributions.forEach(({ def, instance }) => {
      Object.entries(instance.outputs).forEach(([output, money]) => {
        if (instance.children[output]) {
          this.chartData.push([instance.title, instance.children[output].title, money.sum("my-wage")]);
        }
        else if (this.treeOutputs.indexOf(output) === -1) {
          otherChartData.push([instance.title, money.sum("my-wage")]);
        }
      });
    })

    this.chartData.push(["Hrubá mzda", this.tree.inputs["income"].title, this.wage]);
    this.chartData.push([this.tree.outputs["net-income"].title, "Čistá mzda", this.tree.getOutput("net-income").sum("my-wage")]);

    this.project.sources.forEach(source => {
      const projectAmount = this.tree.getOutput(source.input).sum("my-wage") / this.tree.getOutput(source.input).sum() * source.amount;
      const otherAmount = this.tree.getOutput(source.input).sum("my-wage") - projectAmount;
      otherChartData.push([this.tree.outputs[source.input].title, otherAmount]);
      this.chartData.push([this.tree.outputs[source.input].title, this.project.name, projectAmount]);
    })

    if(!this.hideOther) otherChartData.forEach(([sourceTitle, amount]) => this.chartData.push([sourceTitle, "Ostatní daně", amount]));

    this.amountPaid = Math.round(this.project.sources.reduce((acc, cur) => acc + this.tree.getOutput(cur.input).sum("my-wage") / this.tree.getOutput(cur.input).sum() * cur.amount, 0) * 100) / 100;

  }

  setHideOther(hide: boolean) {
    this.hideOther = hide;
    this.updateChart();
  }

}
