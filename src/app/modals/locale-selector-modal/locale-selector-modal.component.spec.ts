import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaleSelectorModalComponent } from './locale-selector-modal.component';

describe('LocaleSelectorModalComponent', () => {
  let component: LocaleSelectorModalComponent;
  let fixture: ComponentFixture<LocaleSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocaleSelectorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocaleSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
