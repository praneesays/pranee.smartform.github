import { Component } from "@angular/core";
import { IUiLocalizationConfigurationRegion } from "@generated-api-clients";
import { map, Observable } from "rxjs";
import { UiLocalizationApiService } from "src/app/api/ui-localization-api.service";

@Component({
    selector: "app-locale-selector",
    templateUrl: "./locale-selector.component.html",
    styleUrls: ["./locale-selector.component.scss"]
})
export class LocaleSelectorComponent {
    readonly regions$: Observable<IUiLocalizationConfigurationRegion[]>;

    constructor(uiLocalizationApiService: UiLocalizationApiService) {
        this.regions$ = uiLocalizationApiService
            .getLocalizationConfig()
            .pipe(map((c) => c.regions));
    }
}
