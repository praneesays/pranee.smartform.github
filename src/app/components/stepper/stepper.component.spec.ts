import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from "@ngx-translate/core";
import { ProductsApiServiceMock } from "src/app/api/products-api.service-mock";
import { ComplaintReportingComponent } from "./complaint-reporting/complaint-reporting.component";

import { StepperComponent } from "./stepper.component";

describe("StepperComponent", () => {
    let component: StepperComponent;
    let fixture: ComponentFixture<StepperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StepperComponent, ComplaintReportingComponent],
            imports: [
                RouterTestingModule,
                MatStepperModule,
                NoopAnimationsModule,
                MatBottomSheetModule,
                TranslateModule.forRoot(),
                MatChipsModule,
                MatIconModule,
                ReactiveFormsModule,
                FormsModule
            ],
            providers: [ProductsApiServiceMock.makeProvider()]
        }).compileComponents();

        fixture = TestBed.createComponent(StepperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
