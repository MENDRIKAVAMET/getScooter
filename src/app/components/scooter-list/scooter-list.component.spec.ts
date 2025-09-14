import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScooterListComponent } from './scooter-list.component';

describe('ScooterListComponent', () => {
  let component: ScooterListComponent;
  let fixture: ComponentFixture<ScooterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScooterListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScooterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
