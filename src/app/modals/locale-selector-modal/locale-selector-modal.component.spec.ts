import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UiLocalizationApiServiceMock } from "src/app/api/ui-localization-api.service-mock";
import { LocaleSelectorComponent } from "src/app/components/locale-selector/locale-selector.component";

import { LocaleSelectorModalComponent } from "./locale-selector-modal.component";

describe("LocaleSelectorModalComponent", () => {
    let component: LocaleSelectorModalComponent;
    let fixture: ComponentFixture<LocaleSelectorModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                LocaleSelectorModalComponent,
                LocaleSelectorComponent
            ],
            providers: [UiLocalizationApiServiceMock.makeProvider()]
        }).compileComponents();

        fixture = TestBed.createComponent(LocaleSelectorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
