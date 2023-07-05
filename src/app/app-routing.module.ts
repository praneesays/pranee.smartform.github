import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ComplaintFormComponent } from "./components/complaint-form/complaint-form.component";
import { StepperComponent } from "./components/stepper/stepper.component";
import { ProblemDescriptionFormComponent } from "./components/problem-description-form/problem-description-form.component";
import { LocaleSelectorComponent } from "./components/locale-selector/locale-selector.component";
import { CountryGuard } from "./shared/country.guard";

const routes: Routes = [
    { path: "", component: LocaleSelectorComponent },
    // { path: ":lang", component: LocaleSelectorComponent },
    {
        path: ":countryCode/home",
        component: StepperComponent,
        canActivate: [CountryGuard]
    },
    {
        path: ":countryCode/:languageCode/home",
        component: StepperComponent,
        canActivate: [CountryGuard]
    },
    {
        path: "**",
        redirectTo: "",
        canActivate: [CountryGuard]
    }
];

// const routes: Routes = [
//     // { path: '', component: ProblemDescriptionFormComponent },
//     // { path: "", component: ComplaintFormComponent },
//     { path: "", component: StepperComponent },
//     // { path: '', component: LocaleSelectorComponent },
//     // { path: ':countryCode/home', component: ComplaintFormComponent },
//     // { path: ':countryCode/:languageCode/home', component: ComplaintFormComponent },
//     {
//         path: "**",
//         redirectTo: ""
//     }
// ];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
