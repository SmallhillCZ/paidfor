import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart-sankey',
  template: `<google-chart type="Sankey" [data]="data" [options]="options"></google-chart>`  
})
export class ChartSankeyComponent implements OnInit {

  @Input() data: Array<[string, string, number]> = [];
  @Input() options: any;

  constructor() { }

  ngOnInit() {
  }

}
