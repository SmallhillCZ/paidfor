import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Role } from 'angular-google-charts/lib/models/role.model';
import { GoogleChartComponent } from 'angular-google-charts';
import { Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-chart-sankey',
  template: `<raw-chart #chart *ngIf="chartData" [firstRowIsData]="true" [chartData]="chartData" (ready)="chartReady$.next(true)"></raw-chart>`,
  styles: [`
    :host{display:block;}
    raw-chart{width:100%;height:100%;}
    `]
})
export class ChartSankeyComponent {

  @ViewChild('chart', { static: false })
  chart: GoogleChartComponent;

  @Input()
  set data(data: Array<[string, string, number]>) {
    this.updateChartData(data);
  }
  @Input()
  set selection(selection: number[]) {
    this.selection$.next(selection);
  }
  selection$ = new Subject<number[]>();
  chartReady$ = new Subject<boolean>();

  chartData: google.visualization.ChartSpecs;

  constructor() {
    // fire on each new selection but wait for when chart is ready
    combineLatest(this.selection$, this.chartReady$).subscribe(([selection]) => this.setSelection(selection));
  }

  setSelection(selection: number[]) {
    // visualization property is not in type definitions
    (<any>this.chart.wrapper).visualization.setSelection(selection.map(row => ({ row, column: null })));
  }

  updateChartData(data: Array<[string, string, number]>) {

    this.chartData = {
      chartType: "Sankey",
      dataTable: data,
      options: {
        sankey: {
          link: {
            colorMode: "none",
            interactivity: true,
            color: {
              stroke: '#dddddd',
              strokeWidth: 1
            }
          },
          node: {
            label: {
              fontSize: 14
            },
            nodePadding: 100,
            interactivity: true,
            width: 50
          }
        },
        tooltip: {
          isHtml: true
        }
      }
    };

  }

}
