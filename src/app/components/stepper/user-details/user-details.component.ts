import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import {
  IUserDetails,
  UserTypes,
  Title,
  IPatientInformation,
  ContactPermission,
  IPatientDetails,
  IContactInformation,
  PhysicianAwareness,
  ContactPermissionHCP,
  IHCPDetails,
  IPatientReporterInformation,
  ContactPermissionReporter,
  IReporterDetails,
  ReporterAdministration,
  Country,
} from 'src/app/types';
import { FormGroupType } from '../stepper.component';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent {

  @Input() 
  complaintReportingFormGroup!: any;

  readonly userDetailsFormGroup: FormGroup<FormGroupType<IUserDetails>>;
  readonly UserTypes = UserTypes;

  titleOptions: string[] = Object.values(Title);
  permissionToContactValues: string[] = Object.values(ContactPermission);
  permissionToContactHCPValues: string[] = Object.values(ContactPermissionHCP);
  physicianAwarenessValues: string[] = Object.values(PhysicianAwareness);
  permissionToContactReporterValues: string[] = Object.values(
    ContactPermissionReporter
  );
  reporterAdministrationValues: string[] = Object.values(
    ReporterAdministration
  );

  countries: Country[] = Object.values(Country);
  countriesList?: Observable<string[]>;

  isStep1Completed: boolean = false;

  constructor(private readonly fb: FormBuilder) {
    this.userDetailsFormGroup = fb.group<FormGroupType<IUserDetails>>({
      userType: fb.control<UserTypes | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      patientInformation: fb.group<FormGroupType<IPatientInformation>>({
        permissionToContact: fb.control<ContactPermission | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        patient: fb.group<FormGroupType<IPatientDetails>>({
          title: fb.control<Title | null>(null, {
            nonNullable: true,
            validators: [],
          }),
          firstName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          lastName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          contactInformation: fb.group<FormGroupType<IContactInformation>>({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
          isProductAvailable: fb.control<boolean | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          additionalContactInformation: fb.group<
            FormGroupType<IContactInformation>
          >({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.required,
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
          dateOfBirth: fb.control<DateTime>(
            DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
            { nonNullable: true, validators: [] }
          ),
          ageAtComplaint: fb.control<string | null>(null, {
            nonNullable: true,
            validators: [],
          }),
        }),
        awareOfComplaint: fb.control<PhysicianAwareness | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        permissionToContactHCP: fb.control<ContactPermissionHCP | null>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        hcp: fb.group<FormGroupType<IHCPDetails>>({
          title: fb.control<Title | null>(null, {
            nonNullable: true,
            validators: [],
          }),
          firstName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          lastName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          contactInformation: fb.group<FormGroupType<IContactInformation>>({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
        }),
      }),

      patientReporterInformation: fb.group<
        FormGroupType<IPatientReporterInformation>
      >({
        permissionToContactReporter:
          fb.control<ContactPermissionReporter | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
          }),
        patient: fb.group<FormGroupType<IPatientDetails>>({
          title: fb.control<Title | null>(null, {
            nonNullable: true,
            validators: [],
          }),
          firstName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          lastName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          contactInformation: fb.group<FormGroupType<IContactInformation>>({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
          isProductAvailable: fb.control<boolean | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          additionalContactInformation: fb.group<
            FormGroupType<IContactInformation>
          >({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [Validators.required],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.required,
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
          dateOfBirth: fb.control<DateTime>(
            DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
            { nonNullable: true, validators: [] }
          ),
          ageAtComplaint: fb.control<string | null>(null, {
            nonNullable: true,
            validators: [],
          }),
        }),
        reporter: fb.group<FormGroupType<IReporterDetails>>({
          title: fb.control<Title | null>(null, {
            nonNullable: true,
            validators: [],
          }),
          firstName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          lastName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          contactInformation: fb.group<FormGroupType<IContactInformation>>({
            addressLine1: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            addressLine2: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            city: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            country: fb.control<Country | null>(null, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            postalCode: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            state: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            telephone: fb.control<string>('', {
              nonNullable: true,
              validators: [],
            }),
            emailAddress: fb.control<string>('', {
              nonNullable: true,
              validators: [
                Validators.pattern(
                  '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$'
                ),
              ],
            }),
          }),
        }),
        facilityName: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        reporterAdministeredProduct: fb.control<ReporterAdministration | null>(
          null,
          { nonNullable: true, validators: [Validators.required] }
        ),
      }),
    });
  }

  ngOnInit() {
    const patientContactInfo = this.userDetailsFormGroup.get(
      'patientInformation.patient.contactInformation'
    );
    const patientReporterContactInfo = this.userDetailsFormGroup.get(
      'patientReporterInformation.patient.contactInformation'
    );

    if (patientContactInfo?.get('country')) {
      this.countriesList = patientContactInfo
        ?.get('country')
        ?.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
    } else if (patientReporterContactInfo?.get('country')) {
      this.countriesList = patientReporterContactInfo
        ?.get('country')
        ?.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter((country) =>
      country.toLowerCase().includes(filterValue)
    );
  }

  onPatientRadioChange(value: boolean) {
    const patientContactInfo = this.userDetailsFormGroup.get(
      'patientInformation.patient.contactInformation'
    );
    const contactFields = [
      'addressLine1',
      'city',
      'postalCode',
      'state',
      'telephone',
      'emailAddress',
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
    const patientReporterContactInfo = this.userDetailsFormGroup.get(
      'patientReporterInformation.patient.contactInformation'
    );
    const contactFields = [
      'addressLine1',
      'city',
      'postalCode',
      'state',
      'telephone',
      'emailAddress',
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
