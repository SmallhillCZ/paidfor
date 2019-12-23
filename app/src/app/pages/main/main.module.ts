import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SharedModule } from 'app/shared/shared.module';
import { WageRedistributionComponent } from './components/wage-redistribution/wage-redistribution.component';


@NgModule({
  declarations: [
    MainComponent,
    WageRedistributionComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,

    SharedModule
  ]
})
export class MainModule { }
