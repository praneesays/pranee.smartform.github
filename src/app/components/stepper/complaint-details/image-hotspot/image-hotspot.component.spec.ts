import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHotspotComponent } from './image-hotspot.component';

describe('ImageHotspotComponent', () => {
  let component: ImageHotspotComponent;
  let fixture: ComponentFixture<ImageHotspotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageHotspotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageHotspotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
