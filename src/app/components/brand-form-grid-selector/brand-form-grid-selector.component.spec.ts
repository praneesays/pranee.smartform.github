import { NgOptimizedImage } from "@angular/common";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule
} from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ProductsApiServiceMock } from "src/app/api/products-api.service-mock";

import { BrandFormGridSelectorComponent } from "./brand-form-grid-selector.component";

// https://stackoverflow.com/a/59164109/1270504
function setTimeoutPromise<T>(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

// // https://stackoverflow.com/a/59164109/1270504
// function setTimeoutPromise<T>(
//   fixture: ComponentFixture<T>,
//   milliseconds: number
// ): Promise<void> {
//   return new Promise((resolve) => {
//       setTimeout(() => {
//           fixture.detectChanges();

//           resolve();
//       }, milliseconds);
//   });
// }

describe("BrandFormGridSelectorComponent", () => {
    let component: BrandFormGridSelectorComponent;
    let fixture: ComponentFixture<BrandFormGridSelectorComponent>;

    beforeEach(waitForAsync(() =>
        TestBed.configureTestingModule({
            declarations: [BrandFormGridSelectorComponent],
            imports: [FormsModule, ReactiveFormsModule, NgOptimizedImage],
            providers: [ProductsApiServiceMock.makeProvider()]
        }).compileComponents()));

    beforeEach(async () => {
        spyOn(ProductsApiServiceMock.prototype, "getForms").and.callThrough();

        fixture = TestBed.createComponent(BrandFormGridSelectorComponent);
        component = fixture.componentInstance;
        fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should start without a selected form", () => {
        expect(component.primaryProductFormControl.value).toBeFalsy();
    });

    it("should filter brands for a selected form", async () => {
        await setTimeoutPromise(1000);
        fixture.detectChanges();

        expect(ProductsApiServiceMock.prototype.getForms).toHaveBeenCalled();

        const primaryFormElements = fixture.debugElement.queryAll(
            By.css('[data-test-key="form-item"]')
        );

        expect(primaryFormElements.length)
            .withContext("No form options were present in the DOM")
            .toBeGreaterThan(0);

        expect(primaryFormElements.length)
            .withContext(
                `Only one primary form ('${primaryFormElements[0].nativeElement.innerText}') was present in the DOM`
            )
            .toBeGreaterThan(1);
    });
});
