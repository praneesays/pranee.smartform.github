import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormControl,
    AbstractControl
} from "@angular/forms";
import { startWith, map, Observable, takeUntil, Subject } from "rxjs";
import {
    IComplaintReporting,
    UserTypes,
    ReturnOption,
    Country,
    Brand,
    Product
} from "src/app/types";
import { Question } from "src/app/questions";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { LotNumberHelpBottomSheetComponent } from "src/app/bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component";
import { FormGroupType } from "../stepper.component";

@Component({
    selector: "app-complaint-reporting",
    templateUrl: "./complaint-reporting.component.html",
    styleUrls: ["./complaint-reporting.component.scss"]
})
export class ComplaintReportingComponent implements OnInit, OnDestroy {
    readonly UserTypes = UserTypes;
    readonly userTypeValues: string[] = Object.values(UserTypes);
    readonly returnOptionValues: string[] = Object.values(ReturnOption);
    readonly countries: Country[] = Object.values(Country);

    @Input() form!: FormGroup<FormGroupType<IComplaintReporting>>;
    @Input() products!: Product[];

    countriesList?: Observable<string[]>;
    imageHotspotValues: Question[] = [];
    filteredProducts: Product[] = this.products;
    filteredBrands: Brand[] = [];
    showAllProducts: boolean = true;
    selectedProductIndex: number = -1;
    selectedBrand: string = "";

    newImageHotspotValues: Question[] = [];

    private readonly destroy$ = new Subject<void>();

    constructor(private readonly bottomSheet: MatBottomSheet) {
        this.imageHotspotValues = [
            {
                id: "simponi_device_failure_location",
                type: "image-map",
                required: true,
                questionText: "",
                imageUrl:
                    "https://www.simponihcp.com/sites/www.simponihcp.com/files/injection_experience_autoinjector_desktop_1.png",
                areas: [
                    {
                        value: "Hidden Needle",

                        x: 394,
                        y: 283,
                        radius: 22,

                        nextQuestionId: "needle_damage_type"
                    },
                    {
                        value: "Safety Sleeve",

                        x: 440,
                        y: 253,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Tamper-Evident Seal",

                        x: 545,
                        y: 317,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Large Viewing Window",

                        x: 625,
                        y: 250,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Activation Button",

                        x: 750,
                        y: 236,
                        radius: 22,

                        nextQuestionId: "button_stuck"
                    },
                    {
                        value: "Easy-to-Grip Shape",

                        x: 927,
                        y: 300,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Expiration Date",

                        x: 1055,
                        y: 328,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    }
                ]
            }
        ];

        this.newImageHotspotValues = [
            {
                id: "simponi_autoinjector",
                type: "image-map",
                required: true,
                questionText: "",
                imageUrl: "../../../../assets/Autoinjector.png",
                areas: [
                    {
                        value: "Hidden Needle",

                        x: 394,
                        y: 283,
                        radius: 22,

                        nextQuestionId: "needle_damage_type"
                    },
                    {
                        value: "Safety Sleeve",

                        x: 440,
                        y: 253,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Tamper-Evident Seal",

                        x: 545,
                        y: 317,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Large Viewing Window",

                        x: 625,
                        y: 250,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Activation Button",

                        x: 750,
                        y: 236,
                        radius: 22,

                        nextQuestionId: "button_stuck"
                    },
                    {
                        value: "Easy-to-Grip Shape",

                        x: 927,
                        y: 300,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    },
                    {
                        value: "Expiration Date",

                        x: 1055,
                        y: 328,
                        radius: 22,

                        nextQuestionId: "who_administered"
                    }
                ]
            }
        ];
    }

    ngOnInit() {
        if (this.form.controls?.["purchasedCountry"]) {
            this.countriesList = this.form.controls?.[
                "purchasedCountry"
            ].valueChanges.pipe(
                startWith(""),
                map((value) => this._filter(value || ""))
            );
        }

        this.products.forEach((product) => {
            this.filteredBrands =
                product.name === "Unknown" ? product.brands : [];
            this.sortBrands(product.brands);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onUserTypeChange(value: string) {
        if (value === UserTypes.HealthcareProfessional) {
            this.initializeHcpFormGroup();
        } else {
            this.clearHcpFormGroup();
        }
        this.hcpFormGroup.updateValueAndValidity();
    }

    onProductSelectionChange(index: number): void {
        this.selectedBrandControl.setValue(null);
        this.selectedProductIndex = index;
        this.showAllProducts = false;
    }

    toggleProducts() {
        this.showAllProducts = !this.showAllProducts;
    }

    filterbrands(filter: string, productName: string) {
        const productList = this.products.find(
            (product) => product.name == productName
        );

        if (productList) {
            if (productName === "Unknown") {
                this.filteredBrands = productList.brands.filter((brand) =>
                    filter
                        ? brand.name.charAt(0).toUpperCase() >=
                              filter.charAt(0).toUpperCase() &&
                          brand.name.charAt(0).toUpperCase() <=
                              filter.charAt(2).toUpperCase()
                        : true
                );
            } else {
                this.filteredBrands = productList.brands;
            }
        }
        this.sortBrands(this.filteredBrands);
        this.selectedBrand = filter;
    }

    sortBrands(brands: Brand[]) {
        brands.sort((a, b) => a.name.localeCompare(b.name));
    }

    onBrandSelectionChange(brandName: string): void {
        this.selectedBrandControl.setValue(brandName);
        // this.scrollToStrengthSection();
        this.filteredProducts = this.products.filter(
            (product) =>
                product.brands.some(
                    (brand) =>
                        brand.name.toLowerCase() === brandName.toLowerCase()
                ) && product.name !== "Unknown"
        );
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
        const batchLotNumber = this.form.get("batchLotNumber");
        const noReason = this.form?.get("noReason");

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

    get selectedProductControl(): FormControl {
        return this.form.get("product") as FormControl;
    }

    get selectedBrandControl(): FormControl {
        return this.form.get("brand") as FormControl;
    }

    get hcpFormGroup() {
        return this.form.get("hcp") as FormGroup;
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
