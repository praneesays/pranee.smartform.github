import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDescriptionFormComponent } from './problem-description-form.component';

describe('ProblemDescriptionFormComponent', () => {
  let component: ProblemDescriptionFormComponent;
  let fixture: ComponentFixture<ProblemDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemDescriptionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
