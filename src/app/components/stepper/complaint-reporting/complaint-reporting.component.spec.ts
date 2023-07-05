import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComplaintReportingComponent } from "./complaint-reporting.component";

describe("ComplaintReportingComponent", () => {
    let component: ComplaintReportingComponent;
    let fixture: ComponentFixture<ComplaintReportingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComplaintReportingComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ComplaintReportingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
