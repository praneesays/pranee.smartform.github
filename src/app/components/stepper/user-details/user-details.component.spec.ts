import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { UserDetailsComponent } from "./user-details.component";

describe("UserDetailsComponent", () => {
    let component: UserDetailsComponent;
    let fixture: ComponentFixture<UserDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserDetailsComponent],
            imports: [MatIconModule, ReactiveFormsModule, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(UserDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
