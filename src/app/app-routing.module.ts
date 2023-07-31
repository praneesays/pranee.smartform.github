import { Location } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    LocalizeParser,
    LocalizeRouterModule,
    LocalizeRouterSettings
} from "@gilsdav/ngx-translate-router";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { UiLocalizationApiService } from "./api/ui-localization-api.service";
import { LocaleSelectorComponent } from "./components/locale-selector/locale-selector.component";
import { StepperComponent } from "./components/stepper/stepper.component";
import { ContactUsComponent } from "./components/contact-us/contact-us.component";
import { ApiLocalizeParser } from "./shared/localization/api-translation-loader";

export function createApiLocalizeParser(
    translate: TranslateService,
    location: Location,
    settings: LocalizeRouterSettings,
    uiLocalizationApi: UiLocalizationApiService
) {
    return new ApiLocalizeParser(
        translate,
        location,
        settings,
        uiLocalizationApi
    );
}

let routes: Routes;
const additionalImports: any[] = [];
if (window.location.pathname !== "/") {
    routes = [
        {
            path: "",
            pathMatch: "full",
            redirectTo: "select-locale",
            data: { skipRouteLocalization: true }
        },
        {
            path: "home",
            component: StepperComponent
        }
        // {
        //     path: "**",
        //     redirectTo: "select-locale"
        // }
    ];

    additionalImports.push(
        TranslateModule.forChild(),
        LocalizeRouterModule.forRoot(routes, {
            parser: {
                provide: LocalizeParser,
                useFactory: createApiLocalizeParser,
                deps: [
                    TranslateService,
                    Location,
                    LocalizeRouterSettings,
                    UiLocalizationApiService
                ]
            },
            alwaysSetPrefix: true
        })
    );
} else {
    routes = [
        {
            path: "",
            component: LocaleSelectorComponent
        },
        {
            path: "contact-us",
            component: ContactUsComponent
        }
    ];
}

@NgModule({
    imports: [RouterModule.forRoot(routes), ...additionalImports],
    exports: [RouterModule]
})
export class AppRoutingModule {}
