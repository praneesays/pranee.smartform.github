import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { ImageUploadComponent } from "../../image-upload/image-upload.component";

import { ComplaintDetailsComponent } from "./complaint-details.component";

describe("ComplaintDetailsComponent", () => {
    let component: ComplaintDetailsComponent;
    let fixture: ComponentFixture<ComplaintDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComplaintDetailsComponent, ImageUploadComponent],
            imports: [
                MatIconModule,
                MatChipsModule,
                MatFormFieldModule,
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ComplaintDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
