import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { GoogleChartsModule } from "angular-google-charts";
import { ChartSankeyComponent } from './components/chart-sankey/chart-sankey.component';

@NgModule({
  declarations: [
    ChartSankeyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GoogleChartsModule.forRoot()
  ],
  exports: [
    FormsModule,
    GoogleChartsModule,
    ChartSankeyComponent
  ]
})
export class SharedModule { }
