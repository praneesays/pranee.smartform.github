// import { Component, OnDestroy, OnInit } from "@angular/core";
// import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { Subject } from "rxjs";
// import { LanguageService } from "src/app/services/language.service";

// interface Language {
//     language: string;
//     code: string;
// }

// @Component({
//     selector: "app-problem-description-form",
//     templateUrl: "./problem-description-form.component.html",
//     styleUrls: ["./problem-description-form.component.scss"]
// })
// export class ProblemDescriptionFormComponent implements OnDestroy, OnInit {
//     // readonly productFormGroup: FormGroup;

//     readonly localeForm!: FormGroup;

//     private readonly destroy$ = new Subject<void>();

//     constructor(private languageService: LanguageService, fb: FormBuilder) {
//         // this.productFormGroup = fb.group({
//         //   productQualityComplaint: fb.control<boolean | null>(null, {
//         //     nonNullable: true,
//         //     validators: [Validators.requiredTrue],
//         //   }),
//         // });

//         this.localeForm = fb.group({
//             locale: fb.group({
//                 // country: ['', Validators.required],
//                 language: ["", Validators.required]
//             })
//         });
//     }

//     languages: Language[] = [
//         { language: "English", code: "en" },
//         { language: "Spanish", code: "es" },
//         { language: "German", code: "de" },
//         { language: "Hindi", code: "hi" },
//         { language: "French", code: "fr" },
//         { language: "Portuguese", code: "pt" }
//     ];

//     ngOnInit() {}

//     // get productQualityComplaint() {
//     //   return this.productFormGroup.controls['productQualityComplaint'].value;
//     // }

//     ngOnDestroy() {
//         this.destroy$.next();
//     }

//     selectLanguage(language: string) {
//         // this.languageService.clearSelectedLanguage();
//         // this.languageService.setSelectedLanguage(language);
//     }
// }
