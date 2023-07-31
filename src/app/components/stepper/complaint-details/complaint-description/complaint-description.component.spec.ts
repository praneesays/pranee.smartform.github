import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ImageUploadComponent } from "src/app/components/image-upload/image-upload.component";

import { ComplaintDescriptionComponent } from "./complaint-description.component";

describe("ComplaintDescriptionComponent", () => {
    let component: ComplaintDescriptionComponent;
    let fixture: ComponentFixture<ComplaintDescriptionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComplaintDescriptionComponent, ImageUploadComponent],
            imports: [MatFormFieldModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ComplaintDescriptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
