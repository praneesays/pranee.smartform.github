import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import {
    IUserDetails,
    UserTypes,
    Title,
    ContactPermission,
    PhysicianAwareness,
    ContactPermissionHCP,
    ContactPermissionReporter,
    ReporterAdministration,
    Country,
    Product,
    IComplaintReporting
} from "src/app/types";
import { Observable, startWith, map, Subject, takeUntil } from "rxjs";
import { FormGroupType } from "../stepper.component";

@Component({
    selector: "app-user-details",
    templateUrl: "./user-details.component.html",
    styleUrls: ["./user-details.component.scss"]
})
export class UserDetailsComponent implements OnInit, OnDestroy {
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

    @Input() complaintReportingFormGroup!: FormGroup<
        FormGroupType<IComplaintReporting>
    >;
    @Input() products!: Product[];

    countriesList?: Observable<string[]>;

    private readonly destroy$ = new Subject<void>();
    private _userDetailsFormGroup?: FormGroup<FormGroupType<IUserDetails>>;

    @Input()
    set form(formGroup: FormGroup) {
        this._userDetailsFormGroup = formGroup;
    }

    get form(): FormGroup {
        return this._userDetailsFormGroup as FormGroup;
    }

    constructor() {}

    ngOnInit() {
        if (!this.complaintReportingFormGroup.controls.userType) {
            return;
        }
        // this.cdr.detectChanges();
        const patientInformation = this.form.get("patientInformation");
        const nonPatientInformation = this.form.get("nonPatientInformation");

        // const user = this.complaintReportingFormGroup.controls.userType.value;

        // if (user === UserTypes.Patient) {
        //     // console.log(patientInformation);
        //     patientInformation?.setValidators(Validators.required);
        //     nonPatientInformation?.clearValidators();
        // } else {
        //     patientInformation?.clearValidators();
        //     nonPatientInformation?.setValidators(Validators.required);
        // }
        // patientInformation?.updateValueAndValidity();
        // nonPatientInformation?.updateValueAndValidity();

        // this.complaintReportingFormGroup.controls.userType.valueChanges
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe((user) => {
        //         if (user) {
        //             this.form.reset();
        //         }
        //         // if (user === UserTypes.Patient) {
        //         //     console.log(patientInformation);
        //         //     patientInformation?.setValidators(Validators.required);
        //         //     nonPatientInformation?.clearValidators();
        //         // } else {
        //         //     patientInformation?.clearValidators();
        //         //     nonPatientInformation?.setValidators(
        //         //         Validators.required
        //         //     );
        //         // }
        //         // patientInformation?.updateValueAndValidity();
        //         // nonPatientInformation?.updateValueAndValidity();
        //     });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onPatientRadioChange(value: boolean) {
        const patientContactInfo = this.form.get(
            "patientInformation.patient.contactInformation"
        );
        const contactFields = [
            "addressLine1",
            "city",
            "postalCode",
            "state",
            "telephone",
            "emailAddress"
        ];

        contactFields.forEach((contact) => {
            const control = patientContactInfo?.get(contact);
            if (control) {
                control.setValidators(value ? [Validators.required] : []);
                control.updateValueAndValidity();
            }
        });
    }

    onNonPatientReporterRadioChange(value: boolean) {
        const patientReporterContactInfo = this.form.get(
            "patientReporterInformation.patient.contactInformation"
        );
        const contactFields = [
            "addressLine1",
            "city",
            "postalCode",
            "state",
            "telephone",
            "emailAddress"
        ];

        contactFields.forEach((contact) => {
            const control = patientReporterContactInfo?.get(contact);
            if (control) {
                control.setValidators(value ? [Validators.required] : []);
                control.updateValueAndValidity();
            }
        });
    }
}
