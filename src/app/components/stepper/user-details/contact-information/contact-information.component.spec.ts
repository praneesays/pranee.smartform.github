import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroupDirective, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";

import { ContactInformationComponent } from "./contact-information.component";

describe("ContactInformationComponent", () => {
    let component: ContactInformationComponent;
    let fixture: ComponentFixture<ContactInformationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ContactInformationComponent],
            imports: [
                ReactiveFormsModule,
                MatFormFieldModule,
                MatAutocompleteModule
            ],
            providers: [FormGroupDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(ContactInformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
