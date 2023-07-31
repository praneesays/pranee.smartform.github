import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";

import { IntroductionBottomSheetComponent } from "./introduction-bottom-sheet.component";

describe("IntroductionBottomSheetComponent", () => {
    let component: IntroductionBottomSheetComponent;
    let fixture: ComponentFixture<IntroductionBottomSheetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IntroductionBottomSheetComponent],
            imports: [MatBottomSheetModule]
        }).compileComponents();

        fixture = TestBed.createComponent(IntroductionBottomSheetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
