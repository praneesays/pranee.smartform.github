import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";

import { ReviewComponent } from "./review.component";

describe("ReviewComponent", () => {
    let component: ReviewComponent;
    let fixture: ComponentFixture<ReviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReviewComponent],
            imports: [MatIconModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ReviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
