import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WageRedistributionComponent } from './wage-redistribution.component';

describe('WageRedistributionComponent', () => {
  let component: WageRedistributionComponent;
  let fixture: ComponentFixture<WageRedistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WageRedistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WageRedistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
