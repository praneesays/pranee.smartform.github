import { Injectable } from "@angular/core";
import { UiLocalizationClientBase } from "@generated-api-clients";

@Injectable({
    providedIn: "root"
})
export class UiLocalizationApiService extends UiLocalizationClientBase {}
