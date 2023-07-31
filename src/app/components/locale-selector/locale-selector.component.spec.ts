import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UiLocalizationApiServiceMock } from "src/app/api/ui-localization-api.service-mock";

import { LocaleSelectorComponent } from "./locale-selector.component";

describe("LocaleSelectorComponent", () => {
    let component: LocaleSelectorComponent;
    let fixture: ComponentFixture<LocaleSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LocaleSelectorComponent],
            providers: [UiLocalizationApiServiceMock.makeProvider()]
        }).compileComponents();

        fixture = TestBed.createComponent(LocaleSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
