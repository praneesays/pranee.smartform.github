import { Component, forwardRef, OnDestroy } from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    Validators
} from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { IProductBrandFormStrengthView } from "@generated-api-clients";
import {
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    takeUntil,
    tap
} from "rxjs";
import { ProductsApiService } from "src/app/api/products-api.service";
import { LotNumberHelpBottomSheetComponent } from "src/app/bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component";
import {
    BatchOrLotNumberUnavailableReason,
    Country,
    IBrandFormSelection,
    IComplaintReporting,
    ReturnOption,
    UserTypes
} from "src/app/types";
import { observeFormControlValue } from "src/app/utilities/rxjs-utils";

export interface IImageDimensions {
    name: string;
    dataUrl: string;
    width: number;
    height: number;
}

export interface IImageHotspot {
    value: string;
    x: number;
    y: number;
    radius: number;
    mark: string;
    nextQuestionId: string;
}

export interface IImageData {
    imageWithDimensions: IImageDimensions;
    hotspots: IImageHotspot[];
}

// const imageData: IImageData[] = [
//     {
//         imageWithDimensions: {
//             name: "Image 1",
//             dataUrl: "./assets/Autoinjector.png",
//             width: 750,
//             height: 134
//         },
//         hotspots: [
//             {
//                 value: "Activation Button",
//                 x: 291,
//                 y: 65,
//                 radius: 15,
//                 mark: "6",
//                 nextQuestionId: "needle_damage_type"
//             },
//             {
//                 value: "Expiration Date",
//                 x: 30,
//                 y: 84,
//                 radius: 15,
//                 mark: "7",
//                 nextQuestionId: "who_administered"
//             },
//             {
//                 value: "Thin hidden needle",
//                 x: 568,
//                 y: 66,
//                 radius: 15,
//                 mark: "4",
//                 nextQuestionId: "who_administered"
//             },
//             {
//                 value: "Green Safety Sleeve",
//                 x: 507,
//                 y: 62,
//                 radius: 15,
//                 mark: "3",
//                 nextQuestionId: "button_stuck"
//             },
//             {
//                 value: "Tamper Evident Seal",
//                 x: 422,
//                 y: 59,
//                 radius: 15,
//                 mark: "2",
//                 nextQuestionId: "who_administered"
//             }
//         ]
//     }
// ];

@Component({
    selector: "app-complaint-reporting",
    templateUrl: "./complaint-reporting.component.html",
    styleUrls: ["./complaint-reporting.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ComplaintReportingComponent),
            multi: true
        }
    ]
})
export class ComplaintReportingComponent
    implements ControlValueAccessor, OnDestroy
{
    readonly UserTypes = UserTypes;
    readonly userTypeValues: string[] = Object.values(UserTypes);
    readonly returnOptionValues: string[] = Object.values(ReturnOption);
    readonly batchOrLotNumberUnavailableReasonValues: string[] = Object.values(
        BatchOrLotNumberUnavailableReason
    );
    readonly countries: Country[] = Object.values(Country);

    countriesList$?: Observable<string[]>;
    // imageHotspotValues: Question[] = [];

    readonly selectedProductStrengths$: Observable<
        readonly IProductBrandFormStrengthView[]
    >;
    loadingSelectedProductStrengths = false;

    readonly hasSelectedBrandAndForm$: Observable<boolean>;

    readonly formGroup = new FormGroup({
        userType: new FormControl<UserTypes | null>(null, {
            validators: [Validators.required]
        }),
        purchasedCountry: new FormControl<Country | null>(null, {
            validators: [Validators.required]
        }),
        brandAndForm: new FormControl<IBrandFormSelection | null>(null, {
            validators: [Validators.required]
        }),
        strengthId: new FormControl<string | null>(null, {
            validators: [Validators.required]
        }),
        returnOption: new FormControl<ReturnOption | null>(null, {
            validators: [Validators.required]
        }),
        hasBatchOrLotNumber: new FormControl<boolean | null>(null, {
            validators: [Validators.required]
        }),
        batchOrLotNumber: new FormControl<string | null>(null, {
            validators: [Validators.required]
        }),
        batchOrLotNumberUnavailableReason:
            new FormControl<BatchOrLotNumberUnavailableReason | null>(null, {
                validators: [Validators.required]
            }),
        gtin: new FormControl<string | null>(null, {
            validators: []
        }),
        serial: new FormControl<string | null>(null, {
            validators: []
        }),
        hcp: new FormGroup({
            reportedFromJNJProgram: new FormControl<boolean | null>(null, {
                validators: []
            }),
            studyProgram: new FormControl<string | null>(null, {
                validators: []
            }),
            siteNumber: new FormControl<number | null>(null, {
                nonNullable: true,
                validators: []
            }),
            subjectNumber: new FormControl<number | null>(null, {
                validators: []
            })
        })
    });

    privacyPolicy = "https://www.janssen.com/privacy-policy";

    private readonly destroy$ = new Subject<void>();
    private onTouched?: () => void;
    private onChange?: (val: IComplaintReporting | null) => void;

    constructor(
        private readonly bottomSheet: MatBottomSheet,
        productsApiService: ProductsApiService
    ) {
        observeFormControlValue<boolean | null>(
            this.formGroup.controls.hasBatchOrLotNumber
        )
            .pipe(takeUntil(this.destroy$))
            .subscribe((hasBatchOrLotNumber) => {
                if (hasBatchOrLotNumber === null) {
                    this.formGroup.controls.batchOrLotNumber.disable();
                    this.formGroup.controls.batchOrLotNumberUnavailableReason.disable();

                    return;
                }

                if (hasBatchOrLotNumber) {
                    this.formGroup.controls.batchOrLotNumber.enable();
                    this.formGroup.controls.batchOrLotNumberUnavailableReason.disable();
                } else {
                    this.formGroup.controls.batchOrLotNumber.disable();
                    this.formGroup.controls.batchOrLotNumberUnavailableReason.enable();
                }
            });

        // this.imageHotspotValues = [
        //     {
        //         id: "simponi_autoinjector",
        //         type: "image-map",
        //         required: true,
        //         questionText: "Image 1",
        //         imageUrl: "./assets/Autoinjector.png",
        //         areas: [
        //             {
        //                 value: "Activation Button",
        //                 x: 291,
        //                 y: 65,
        //                 radius: 15,
        //                 mark: "6",
        //                 nextQuestionId: "needle_damage_type"
        //             },
        //             {
        //                 value: "Expiration Date",
        //                 x: 30,
        //                 y: 84,
        //                 radius: 15,
        //                 mark: "7",
        //                 nextQuestionId: "who_administered"
        //             },
        //             {
        //                 value: "Thin hidden needle",
        //                 x: 568,
        //                 y: 66,
        //                 radius: 15,
        //                 mark: "4",
        //                 nextQuestionId: "who_administered"
        //             },
        //             {
        //                 value: "Green Safety Sleeve",
        //                 x: 507,
        //                 y: 62,
        //                 radius: 15,
        //                 mark: "3",
        //                 nextQuestionId: "button_stuck"
        //             },
        //             {
        //                 value: "Tamper Evident Seal",
        //                 x: 422,
        //                 y: 59,
        //                 radius: 15,
        //                 mark: "2",
        //                 nextQuestionId: "who_administered"
        //             }
        //         ]
        //     },
        //     {
        //         id: "pfs_before",
        //         type: "image-map",
        //         required: true,
        //         questionText: "Image 2",
        //         imageUrl: "./assets/PFS-before1.jpg",
        //         areas: [
        //             {
        //                 value: "Cap",
        //                 x: 41.328125,
        //                 y: 21,
        //                 radius: 15,
        //                 mark: "1",
        //                 nextQuestionId: "who_administered"
        //             },
        //             {
        //                 value: "Green Safety Sleeve",
        //                 x: 34.328125,
        //                 y: 166,
        //                 radius: 15,
        //                 mark: "3",
        //                 nextQuestionId: "button_stuck"
        //             },
        //             {
        //                 value: "Viewing Window",
        //                 x: 35.328125,
        //                 y: 266,
        //                 radius: 15,
        //                 mark: "5",
        //                 nextQuestionId: "who_administered"
        //             },
        //             {
        //                 value: "Expiration Date",
        //                 x: 33.328125,
        //                 y: 360,
        //                 radius: 15,
        //                 mark: "7",
        //                 nextQuestionId: "needle_damage_type"
        //             }
        //         ]
        //     }
        // ];

        const brandAndForm$ =
            observeFormControlValue<IBrandFormSelection | null>(
                this.formGroup.controls.brandAndForm
            );

        this.selectedProductStrengths$ = brandAndForm$.pipe(
            tap(() => {
                this.loadingSelectedProductStrengths = true;
                this.selectedProductStrengthControl.disable();
                this.selectedProductStrengthControl.setValue(null);
            }),
            switchMap((c) =>
                !c
                    ? of([])
                    : productsApiService.getStrengthsForBrandAndForm(
                          c.brandId,
                          c.formId
                      )
            ),
            tap((c) => {
                this.loadingSelectedProductStrengths = false;

                if (c.length > 0) {
                    this.selectedProductStrengthControl.enable();
                }
            })
        );

        this.hasSelectedBrandAndForm$ = brandAndForm$.pipe(map((c) => !!c));

        observeFormControlValue(this.formGroup)
            .pipe(
                map((c): IComplaintReporting | null => {
                    if (!c) {
                        return null;
                    }

                    if (
                        !c.userType ||
                        !c.brandAndForm ||
                        !c.purchasedCountry ||
                        !c.returnOption ||
                        !c.hcp
                    ) {
                        return null;
                    }

                    return {
                        brandAndForm: c.brandAndForm,
                        hasBatchOrLotNumber: c.hasBatchOrLotNumber ?? false,
                        purchasedCountry: c.purchasedCountry,
                        returnOption: c.returnOption,
                        strengthId: c.strengthId ?? null,
                        userType: c.userType,
                        batchOrLotNumber: c.batchOrLotNumber ?? null,
                        batchOrLotNumberUnavailableReason:
                            c.batchOrLotNumberUnavailableReason ?? null,
                        gtin: c.gtin ?? null,
                        serial: c.serial ?? null,
                        hcp: {
                            reportedFromJNJProgram:
                                c.hcp.reportedFromJNJProgram ?? null,
                            siteNumber: c.hcp.siteNumber ?? null,
                            studyProgram: c.hcp.studyProgram ?? null,
                            subjectNumber: c.hcp.subjectNumber ?? null
                        }
                    };
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((c) => {
                const onChange = this.onChange;

                if (!onChange) {
                    return;
                }

                onChange(c);
            });

        this.countriesList$ =
            this.formGroup.controls.purchasedCountry.valueChanges.pipe(
                startWith(""),
                map((value) => this._filter(value || ""))
            );

        // languageService.selectedLocale$
        // .pipe(takeUntil(this.destroy$))
        // .subscribe((locale) => {
        //     this.privacyPolicy = locale?.privacyPolicy;
        // });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // onProductImageChange(question: Question) {
    //     if (this.selectedProduct) {
    //         delete this.selectedProduct;
    //     }
    //     this.selectedProduct = question;
    // }

    onUserTypeChange(value: string) {
        if (value === UserTypes.HealthcareProfessional) {
            this.initializeHcpFormGroup();
        } else {
            this.clearHcpFormGroup();
        }
        this.hcpFormGroup.updateValueAndValidity();
    }

    showLotNumberHelp() {
        this.bottomSheet.open(LotNumberHelpBottomSheetComponent);
    }

    // handleBatchLotNumberChange(value: boolean) {
    //     const batchLotNumber = this.form.get("batchLotNumber");
    //     const noReason = this.form?.get("noReason");

    //     if (!batchLotNumber) {
    //         return;
    //     }

    //     if (!noReason) {
    //         return;
    //     }

    //     if (value) {
    //         this.clearValidatorsAndSetValue(noReason);
    //         this.setRequiredValidator(batchLotNumber);
    //     } else {
    //         this.clearValidatorsAndSetValue(batchLotNumber);
    //         this.setRequiredValidator(noReason);
    //     }

    //     this.updateFormControlValidity(batchLotNumber);
    //     this.updateFormControlValidity(noReason);
    // }

    handleBatchLotNumberChange(value: boolean) {
        const batchLotNumber = this.formGroup.controls.batchOrLotNumber;
        const noReason =
            this.formGroup.controls.batchOrLotNumberUnavailableReason;

        if (!batchLotNumber) {
            return;
        }

        if (!noReason) {
            return;
        }

        if (value) {
            noReason.disable();
            batchLotNumber.enable();
            noReason.reset();
        } else {
            noReason.enable();
            batchLotNumber.disable();
            batchLotNumber.reset();
        }
    }

    setRequiredValidator(control: AbstractControl) {
        control?.setValidators(Validators.required);
    }

    clearValidatorsAndSetValue(control: AbstractControl) {
        control?.setValue("");
        control?.clearValidators();
    }

    updateFormControlValidity(control: AbstractControl) {
        control?.updateValueAndValidity();
    }

    writeValue(obj: IComplaintReporting | null): void {
        this.formGroup.setValue({
            userType: obj?.userType ?? null,
            purchasedCountry: obj?.purchasedCountry ?? null,
            brandAndForm: obj?.brandAndForm ?? null,
            strengthId: obj?.strengthId ?? null,
            returnOption: obj?.returnOption ?? null,
            hasBatchOrLotNumber: obj?.hasBatchOrLotNumber ?? null,
            batchOrLotNumber: obj?.batchOrLotNumber ?? null,
            batchOrLotNumberUnavailableReason:
                obj?.batchOrLotNumberUnavailableReason ?? null,
            gtin: obj?.gtin ?? null,
            serial: obj?.serial ?? null,
            hcp: {
                reportedFromJNJProgram:
                    obj?.hcp?.reportedFromJNJProgram ?? null,
                studyProgram: obj?.hcp?.studyProgram ?? null,
                siteNumber: obj?.hcp?.siteNumber ?? null,
                subjectNumber: obj?.hcp?.subjectNumber ?? null
            }
        });
    }
    registerOnChange(fn: (val: IComplaintReporting | null) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
    }

    get selectedProductStrengthControl() {
        return this.formGroup.controls.strengthId;
    }

    get hcpFormGroup() {
        return this.formGroup.controls.hcp;
    }

    private initializeHcpFormGroup() {
        const reportedFromJNJProgramControl = this.hcpFormGroup.get(
            "reportedFromJNJProgram"
        );
        const studyProgramControl = this.hcpFormGroup.get("studyProgram");
        const siteNumberControl = this.hcpFormGroup.get("siteNumber");
        const subjectNumberControl = this.hcpFormGroup.get("subjectNumber");

        reportedFromJNJProgramControl?.setValidators([Validators.required]);

        reportedFromJNJProgramControl?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    studyProgramControl?.setValidators([Validators.required]);
                    siteNumberControl?.setValidators([Validators.required]);
                    subjectNumberControl?.setValidators([Validators.required]);
                } else {
                    studyProgramControl?.updateValueAndValidity();
                    siteNumberControl?.updateValueAndValidity();
                    subjectNumberControl?.updateValueAndValidity();
                }
            });
        reportedFromJNJProgramControl?.updateValueAndValidity();
    }

    private clearHcpFormGroup() {
        this.hcpFormGroup.clearValidators();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.countries.filter((country) =>
            country.toLowerCase().includes(filterValue)
        );
    }
}
