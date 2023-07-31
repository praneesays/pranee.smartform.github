import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    FormGroupDirective,
    FormsModule,
    ReactiveFormsModule
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { PersonNameComponent } from "./person-name.component";

describe("PersonNameComponent", () => {
    let component: PersonNameComponent;
    let fixture: ComponentFixture<PersonNameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PersonNameComponent],
            imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule],
            providers: [FormGroupDirective]
        }).compileComponents();

        fixture = TestBed.createComponent(PersonNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
