import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import { ProductsApiServiceMock } from "src/app/api/products-api.service-mock";

import { ComplaintReportingComponent } from "./complaint-reporting.component";

describe("ComplaintReportingComponent", () => {
    let component: ComplaintReportingComponent;
    let fixture: ComponentFixture<ComplaintReportingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ComplaintReportingComponent],
            imports: [
                MatBottomSheetModule,
                TranslateModule.forRoot(),
                MatChipsModule,
                MatIconModule
            ],
            providers: [ProductsApiServiceMock.makeProvider()]
        }).compileComponents();

        fixture = TestBed.createComponent(ComplaintReportingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
