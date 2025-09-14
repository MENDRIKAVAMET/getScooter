import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScooterFormComponent } from './scooter-form.component';

describe('ScooterFormComponent', () => {
  let component: ScooterFormComponent;
  let fixture: ComponentFixture<ScooterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScooterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScooterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
