import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    Validators
} from "@angular/forms";
import { DateTime } from "luxon";
import { map, Observable, Subject, takeUntil } from "rxjs";
import {
    ContactPermission,
    ContactPermissionHCP,
    ContactPermissionReporter,
    Country,
    IComplaintReporting,
    IHCPDetails,
    IUserDetails,
    PhysicianAwareness,
    Product,
    ReporterAdministration,
    Title,
    UserTypes
} from "src/app/types";
import { observeFormControlValue } from "src/app/utilities/rxjs-utils";
import { FormGroupType } from "../stepper.component";

@Component({
    selector: "app-user-details",
    templateUrl: "./user-details.component.html",
    styleUrls: ["./user-details.component.scss"]
})
// export class UserDetailsComponent implements OnInit, OnDestroy {
//     readonly UserTypes = UserTypes;
//     readonly titleOptions: string[] = Object.values(Title);
//     readonly countries: Country[] = Object.values(Country);
//     readonly permissionToContactValues: string[] =
//         Object.values(ContactPermission);
//     readonly permissionToContactHCPValues: string[] =
//         Object.values(ContactPermissionHCP);
//     readonly permissionToContactReporterValues: string[] = Object.values(
//         ContactPermissionReporter
//     );
//     readonly physicianAwarenessValues: string[] =
//         Object.values(PhysicianAwareness);
//     readonly reporterAdministrationValues: string[] = Object.values(
//         ReporterAdministration
//     );

//     @Input() complaintReportingFormGroup!: FormGroup<
//         FormGroupType<IComplaintReporting>
//     >;
//     @Input() products!: Product[];
//     @Input() hcp?: FormGroup<FormGroupType<IHCPDetails>>;

//     countriesList?: Observable<string[]>;

//     private readonly destroy$ = new Subject<void>();
//     private _userDetailsFormGroup?: FormGroup<FormGroupType<IUserDetails>>;

//     @Input()
//     set form(formGroup: FormGroup) {
//         this._userDetailsFormGroup = formGroup;
//     }

//     get form(): FormGroup {
//         return this._userDetailsFormGroup as FormGroup;
//     }

//     constructor() {}

//     ngOnInit() {
//         if (!this.complaintReportingFormGroup.controls.userType) {
//             return;
//         }

//         const patientInformation = this.form.get(
//             "patientInformation"
//         ) as FormGroup;

//         this.form
//             .get("patientInformation.permissionToContactHCP")!
//             .valueChanges.pipe(takeUntil(this.destroy$))
//             .subscribe((value) => {
//                 console.log(value);
//                 if (value === "Yes") {
//                     patientInformation?.addControl("hcp", this.hcp);
//                 } else {
//                     patientInformation.removeControl("hcp");
//                 }
//                 this.form.updateValueAndValidity();
//             });

//         this.form.valueChanges
//             .pipe(takeUntil(this.destroy$))
//             .subscribe((value) => {
//                 console.log("Form Value:", value);
//             });
//     }

//     ngOnDestroy() {
//         this.destroy$.next();
//         this.destroy$.complete();
//     }

//     onPatientRadioChange(value: boolean) {
//         const patientFormGroup = this.form.get(
//             "patientInformation.patient"
//         ) as FormGroup;

//         const contactInformationFormGroup = this.form.get(
//             "patientInformation.patient.contactInformation"
//         ) as FormGroup;

//         const contactFields = [
//             "addressLine1",
//             "city",
//             "postalCode",
//             "state",
//             "telephone",
//             "emailAddress"
//         ];

//         contactFields.forEach((contact) => {
//             const control = contactInformationFormGroup?.get(contact);
//             if (control) {
//                 control.setValidators(value ? [Validators.required] : []);
//                 control.updateValueAndValidity();
//             }
//         });

//         if (!value) {
//             patientFormGroup.addControl(
//                 "additionalContactInformation",
//                 contactInformationFormGroup
//             );
//         } else {
//             patientFormGroup.removeControl("additionalContactInformation");
//         }
//     }

//     onNonPatientReporterRadioChange(value: boolean) {
//         const nonPatientFormGroup = this.form.get(
//             "nonPatientInformation.patient"
//         ) as FormGroup;

//         const contactInformationFormGroup = this.form.get(
//             "nonPatientInformation.patient.contactInformation"
//         ) as FormGroup;

//         const contactFields = [
//             "addressLine1",
//             "city",
//             "postalCode",
//             "state",
//             "telephone",
//             "emailAddress"
//         ];

//         contactFields.forEach((contact) => {
//             const control = contactInformationFormGroup?.get(contact);
//             if (control) {
//                 control.setValidators(value ? [Validators.required] : []);
//                 control.updateValueAndValidity();
//             }
//         });

//         if (!value) {
//             nonPatientFormGroup.addControl(
//                 "additionalContactInformation",
//                 contactInformationFormGroup
//             );
//         } else {
//             nonPatientFormGroup.removeControl("additionalContactInformation");
//         }
//     }
// }
export class UserDetailsComponent
    implements ControlValueAccessor, OnInit, OnDestroy
{
    readonly UserTypes = UserTypes;
    readonly titleOptions: string[] = Object.values(Title);
    readonly countries: Country[] = Object.values(Country);
    readonly permissionToContactValues: string[] =
        Object.values(ContactPermission);
    readonly permissionToContactHCPValues: string[] =
        Object.values(ContactPermissionHCP);
    readonly permissionToContactReporterValues: string[] = Object.values(
        ContactPermissionReporter
    );
    readonly physicianAwarenessValues: string[] =
        Object.values(PhysicianAwareness);
    readonly reporterAdministrationValues: string[] = Object.values(
        ReporterAdministration
    );

    @Input() complaintReportingFormGroup?: FormGroup<
        FormGroupType<IComplaintReporting>
    >;
    @Input() products?: Product[];
    // @Input() hcp?: FormGroup<FormGroupType<IHCPDetails>>;

    @Input() complaintReportingFormValues?: IComplaintReporting;

    countriesList?: Observable<string[]>;

    readonly nameInformationFormGroup = new FormGroup({
        title: new FormControl<Title | null>(null, {
            validators: []
        }),
        firstName: new FormControl<string>("", {
            validators: [Validators.required]
        }),
        lastName: new FormControl<string>("", {
            validators: [Validators.required]
        })
    });

    readonly contactInformationFormGroup = new FormGroup({
        addressLine1: new FormControl<string>("", {
            validators: []
        }),
        addressLine2: new FormControl<string>("", {
            validators: []
        }),
        city: new FormControl<string>("", {
            validators: []
        }),
        country: new FormControl<Country | null>(null, {
            validators: [Validators.required]
        }),
        postalCode: new FormControl<string>("", {
            validators: []
        }),
        state: new FormControl<string>("", {
            validators: []
        }),
        telephone: new FormControl<string>("", {
            validators: []
        }),
        emailAddress: new FormControl<string>("", {
            validators: [
                Validators.required,
                Validators.pattern(
                    "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
                )
            ]
        })
    });

    readonly patientInformationFormGroup = new FormGroup({
        permissionToContact: new FormControl<ContactPermission | null>(null, {
            validators: [Validators.required]
        }),
        patient: new FormGroup({
            name: this.nameInformationFormGroup,
            contactInformation: this.contactInformationFormGroup,
            // additionalContactInformation: this.contactInformationFormGroup,
            dateOfBirth: new FormControl<DateTime | null>(null, {
                validators: []
            }),
            ageAtComplaint: new FormControl<string | null>(null, {
                validators: []
            })
        }),
        awareOfComplaint: new FormControl<PhysicianAwareness | null>(null, {
            validators: [Validators.required]
        }),
        permissionToContactHCP: new FormControl<ContactPermissionHCP | null>(
            null,
            {
                validators: [Validators.required]
            }
        )
    });

    readonly nonPatientInformationFormGroup = new FormGroup({
        permissionToContactReporter:
            new FormControl<ContactPermissionReporter | null>(null, {
                validators: [Validators.required]
            }),
        patient: new FormGroup({
            name: this.nameInformationFormGroup,
            contactInformation: this.contactInformationFormGroup,
            // isProductAvailable: new FormControl<boolean | null>(null, {
            //     validators: [Validators.required]
            // }),
            // additionalContactInformation: this.contactInformationFormGroup,
            dateOfBirth: new FormControl<DateTime>(
                DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                { validators: [] }
            ),
            ageAtComplaint: new FormControl<string | null>(null, {
                validators: []
            })
        }),
        reporter: new FormGroup({
            name: this.nameInformationFormGroup,
            contactInformation: this.contactInformationFormGroup
        }),
        facilityName: new FormControl<string>("", {
            validators: [Validators.required]
        }),
        reporterAdministeredProduct:
            new FormControl<ReporterAdministration | null>(null, {
                validators: [Validators.required]
            })
    });

    readonly isProductAvailable = new FormControl(null, {
        validators: [Validators.required]
    });

    readonly hcp = new FormGroup({
        name: this.nameInformationFormGroup,
        contactInformation: this.contactInformationFormGroup
    });

    readonly formGroup = new FormGroup({
        patientInformation: this.patientInformationFormGroup,

        nonPatientInformation: this.nonPatientInformationFormGroup
    });

    private readonly destroy$ = new Subject<void>();

    private onTouched?: () => void;
    private onChange?: (val: IUserDetails | null) => void;

    constructor() {
        observeFormControlValue(this.formGroup)
            .pipe(
                map((c): IUserDetails | null => {
                    if (!c) {
                        return null;
                    }

                    return {
                        patientInformation: {
                            permissionToContact:
                                c.patientInformation?.permissionToContact ??
                                null,
                            permissionToContactHCP:
                                c.patientInformation?.permissionToContactHCP ??
                                null,
                            awareOfComplaint:
                                c.patientInformation?.awareOfComplaint ?? null,
                            patient: {
                                name: {
                                    title:
                                        c.patientInformation?.patient?.name
                                            ?.title ?? null,
                                    firstName:
                                        c.patientInformation?.patient?.name
                                            ?.firstName!,
                                    lastName:
                                        c.patientInformation?.patient?.name
                                            ?.lastName!
                                },
                                contactInformation: {
                                    addressLine1:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    addressLine2:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.addressLine2!,
                                    city: c.patientInformation?.patient
                                        ?.contactInformation?.addressLine1!,
                                    country:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.country ??
                                        null,
                                    postalCode:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    state: c.patientInformation?.patient
                                        ?.contactInformation?.state!,
                                    telephone:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.telephone!,
                                    emailAddress:
                                        c.patientInformation?.patient
                                            ?.contactInformation?.emailAddress!
                                },
                                dateOfBirth:
                                    c.patientInformation?.patient?.dateOfBirth!,
                                ageAtComplaint:
                                    c.patientInformation?.patient
                                        ?.ageAtComplaint ?? null
                            }
                        },
                        nonPatientInformation: {
                            facilityName:
                                c.nonPatientInformation?.facilityName!,
                            reporterAdministeredProduct:
                                c.nonPatientInformation
                                    ?.reporterAdministeredProduct ?? null,
                            permissionToContactReporter:
                                c.nonPatientInformation
                                    ?.permissionToContactReporter ?? null,
                            patient: {
                                name: {
                                    title:
                                        c.nonPatientInformation?.patient?.name
                                            ?.title ?? null,
                                    firstName:
                                        c.nonPatientInformation?.patient?.name
                                            ?.firstName!,
                                    lastName:
                                        c.nonPatientInformation?.patient?.name
                                            ?.lastName!
                                },
                                contactInformation: {
                                    addressLine1:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    addressLine2:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine2!,
                                    city: c.nonPatientInformation?.patient
                                        ?.contactInformation?.addressLine1!,
                                    country:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.country ??
                                        null,
                                    postalCode:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    state: c.nonPatientInformation?.patient
                                        ?.contactInformation?.state!,
                                    telephone:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.telephone!,
                                    emailAddress:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.emailAddress!
                                },
                                dateOfBirth:
                                    c.nonPatientInformation?.patient
                                        ?.dateOfBirth!,
                                ageAtComplaint:
                                    c.nonPatientInformation?.patient
                                        ?.ageAtComplaint ?? null
                            },
                            reporter: {
                                name: {
                                    title:
                                        c.nonPatientInformation?.patient?.name
                                            ?.title ?? null,
                                    firstName:
                                        c.nonPatientInformation?.patient?.name
                                            ?.firstName!,
                                    lastName:
                                        c.nonPatientInformation?.patient?.name
                                            ?.lastName!
                                },
                                contactInformation: {
                                    addressLine1:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    addressLine2:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine2!,
                                    city: c.nonPatientInformation?.patient
                                        ?.contactInformation?.addressLine1!,
                                    country:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.country ??
                                        null,
                                    postalCode:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.addressLine1!,
                                    state: c.nonPatientInformation?.patient
                                        ?.contactInformation?.state!,
                                    telephone:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.telephone!,
                                    emailAddress:
                                        c.nonPatientInformation?.patient
                                            ?.contactInformation?.emailAddress!
                                }
                            }
                        }
                    };
                }),
                takeUntil(this.destroy$)
            )
            .subscribe((c) => {
                // const onChange = this.onChange;
                // if (!onChange) {
                //     return;
                // }
                // onChange(c);
            });
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

    writeValue(obj: IUserDetails | null): void {
        this.formGroup.setValue({
            patientInformation: {
                permissionToContact:
                    obj?.patientInformation?.permissionToContact ?? null,
                permissionToContactHCP:
                    obj?.patientInformation?.permissionToContactHCP ?? null,
                awareOfComplaint:
                    obj?.patientInformation?.awareOfComplaint ?? null,
                patient: {
                    name: {
                        title:
                            obj?.patientInformation?.patient?.name?.title ??
                            null,
                        firstName:
                            obj?.patientInformation?.patient?.name?.firstName!,
                        lastName:
                            obj?.patientInformation?.patient?.name?.lastName!
                    },
                    contactInformation: {
                        addressLine1:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.addressLine1!,
                        addressLine2:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.addressLine2!,
                        city: obj?.patientInformation?.patient
                            ?.contactInformation?.addressLine1!,
                        country:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.country ?? null,
                        postalCode:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.addressLine1!,
                        state: obj?.patientInformation?.patient
                            ?.contactInformation?.state!,
                        telephone:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.telephone!,
                        emailAddress:
                            obj?.patientInformation?.patient?.contactInformation
                                ?.emailAddress!
                    },
                    dateOfBirth: obj?.patientInformation?.patient?.dateOfBirth!,
                    ageAtComplaint:
                        obj?.patientInformation?.patient?.ageAtComplaint ?? null
                }
            },
            nonPatientInformation: {
                facilityName: obj?.nonPatientInformation?.facilityName!,
                reporterAdministeredProduct:
                    obj?.nonPatientInformation?.reporterAdministeredProduct ??
                    null,
                permissionToContactReporter:
                    obj?.nonPatientInformation?.permissionToContactReporter ??
                    null,
                patient: {
                    name: {
                        title:
                            obj?.nonPatientInformation?.patient?.name?.title ??
                            null,
                        firstName:
                            obj?.nonPatientInformation?.patient?.name
                                ?.firstName!,
                        lastName:
                            obj?.nonPatientInformation?.patient?.name?.lastName!
                    },
                    contactInformation: {
                        addressLine1:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine1!,
                        addressLine2:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine2!,
                        city: obj?.nonPatientInformation?.patient
                            ?.contactInformation?.addressLine1!,
                        country:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.country ?? null,
                        postalCode:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine1!,
                        state: obj?.nonPatientInformation?.patient
                            ?.contactInformation?.state!,
                        telephone:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.telephone!,
                        emailAddress:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.emailAddress!
                    },
                    dateOfBirth:
                        obj?.nonPatientInformation?.patient?.dateOfBirth!,
                    ageAtComplaint:
                        obj?.nonPatientInformation?.patient?.ageAtComplaint ??
                        null
                },
                reporter: {
                    name: {
                        title:
                            obj?.nonPatientInformation?.patient?.name?.title ??
                            null,
                        firstName:
                            obj?.nonPatientInformation?.patient?.name
                                ?.firstName!,
                        lastName:
                            obj?.nonPatientInformation?.patient?.name?.lastName!
                    },
                    contactInformation: {
                        addressLine1:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine1!,
                        addressLine2:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine2!,
                        city: obj?.nonPatientInformation?.patient
                            ?.contactInformation?.addressLine1!,
                        country:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.country ?? null,
                        postalCode:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.addressLine1!,
                        state: obj?.nonPatientInformation?.patient
                            ?.contactInformation?.state!,
                        telephone:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.telephone!,
                        emailAddress:
                            obj?.nonPatientInformation?.patient
                                ?.contactInformation?.emailAddress!
                    }
                }
            }
        });
    }
    registerOnChange(fn: (val: IUserDetails | null) => void): void {
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

    ngOnInit() {
        const userType = this.complaintReportingFormValues?.userType;
        if (!userType) {
            return;
        }

        const patientInformation = this.formGroup.get(
            "patientInformation"
        ) as FormGroup;

        const nonPatientInformation = this.formGroup.get(
            "nonPatientInformation"
        ) as FormGroup;

        const patientFormGroup = patientInformation.get("patient") as FormGroup;

        const returnOption = this.complaintReportingFormValues?.returnOption;

        this.formGroup
            .get("patientInformation.permissionToContactHCP")!
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value === "Yes") {
                    patientInformation?.addControl("hcp", this.hcp);
                } else {
                    patientInformation.removeControl("hcp");
                }
                this.formGroup.updateValueAndValidity();
            });

        if (userType === UserTypes.Patient) {
            if (!this.formGroup.get("patientInformation")) {
                this.formGroup.addControl(
                    "patientInformation",
                    this.patientInformationFormGroup
                );
            }

            if (returnOption === "Yes") {
                patientFormGroup.addControl(
                    "isProductAvailable",
                    this.isProductAvailable
                );
            } else {
                if (patientFormGroup.get("isProductAvailable")) {
                    patientFormGroup.removeControl("isProductAvailable");
                }
            }

            // this.formGroup.removeControl("nonPatientInformation");
        } else {
            const nonPatientFormGroup = nonPatientInformation.get(
                "patient"
            ) as FormGroup;
            if (!this.formGroup.get("nonPatientInformation")) {
                this.formGroup.addControl(
                    "nonPatientInformation",
                    this.nonPatientInformationFormGroup
                );
            }
            if (returnOption === "Yes") {
                nonPatientFormGroup.addControl(
                    "isProductAvailable",
                    this.isProductAvailable
                );
            } else {
                if (nonPatientFormGroup.get("isProductAvailable")) {
                    nonPatientFormGroup.removeControl("isProductAvailable");
                }
            }
            // this.formGroup.removeControl("patientInformation");
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPatientRadioChange(value: boolean) {
        const patientFormGroup = this.formGroup.get(
            "patientInformation.patient"
        ) as FormGroup;

        const contactInformationFormGroup = this.formGroup.get(
            "patientInformation.patient.contactInformation"
        ) as FormGroup;

        const contactFields = [
            "addressLine1",
            "city",
            "postalCode",
            "state",
            "telephone",
            "emailAddress"
        ];

        contactFields.forEach((contact) => {
            const control = contactInformationFormGroup?.get(contact);
            if (control) {
                control.setValidators(value ? [Validators.required] : []);
                control.updateValueAndValidity();
            }
        });

        if (!value) {
            patientFormGroup.addControl(
                "additionalContactInformation",
                contactInformationFormGroup
            );
        } else {
            patientFormGroup.removeControl("additionalContactInformation");
        }
    }

    onNonPatientReporterRadioChange(value: boolean) {
        const nonPatientFormGroup = this.formGroup.get(
            "nonPatientInformation.patient"
        ) as FormGroup;

        const contactInformationFormGroup = this.formGroup.get(
            "nonPatientInformation.patient.contactInformation"
        ) as FormGroup;

        const contactFields = [
            "addressLine1",
            "city",
            "postalCode",
            "state",
            "telephone",
            "emailAddress"
        ];

        contactFields.forEach((contact) => {
            const control = contactInformationFormGroup?.get(contact);
            if (control) {
                control.setValidators(value ? [Validators.required] : []);
                control.updateValueAndValidity();
            }
        });

        if (!value) {
            nonPatientFormGroup.addControl(
                "additionalContactInformation",
                contactInformationFormGroup
            );
        } else {
            nonPatientFormGroup.removeControl("additionalContactInformation");
        }
    }
}
