import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import {
  filter,
  first,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { LotNumberHelpBottomSheetComponent } from '../..//bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component';
import { Question } from '../../questions';
import {
  IQuestionsRequest,
  IQuestionsRequestAnswer,
  QuestionsService,
} from '../../services/questions.service';
import {
  IAddress,
  IContactData,
  IInitialReporting,
  IPersonalData,
  IPersonalInformation,
  IProblemSummary,
  IProductInformation,
  UserTypes,
  ProductTypes,
  ComplaintReportTypes,
  IComplaintReporting,
  IPatientDetails,
  IReporterDetails,
  IProductDetails,
  IComplaintDetails,
  Country,
  SameCountryReportStatus,
  IUserDetails,
  IPatientInformation,
  IPatientReporterInformation,
  AlcoholConsumptionStatus,
  AllergyStatus,
  ContactPermission,
  ContactPermissionReporter,
  DrugAbuseStatus,
  Gender,
  IContactInformation,
  IPatientMedicalHistory,
  PhysicianAwareness,
  ReporterAdministration,
  SmokingStatus,
  Title,
  AdministeredBy,
  RouteOfAdministration,
  ConcomitantMedicationStatus,
  ConcomitantMedicationDetails,
  ConcomitantMedication,
  ContactPermissionHCP,
  IHCPDetails,
  Product,
  Brand,
  Height,
  Weight,
  HeightUnit,
  WeightUnit,
  ConsumptionUnit,
  Consumption,
  ReturnOption,
  IHcpData,
} from '../../types';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

type FormGroupType<T> = {
  [k in keyof T]: T[k] extends
    | string
    | DateTime
    | boolean
    | File[]
    | File
    | null
    | undefined
    ? FormControl<T[k]>
    : FormGroup<FormGroupType<T[k]>>;
};

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter((item) => item.toLowerCase().includes(filterValue));
};

interface IProblemDetailsWithDone {
  done: boolean;
  questions: Record<string, any>;

  followUpOkay: boolean;
}

const products: Product[] = [
  {
    name: 'One-Press Device',
    type: ProductTypes.OnePressDevice,
    imagePath: './assets/products/onepressdevice.png',
    brands: [
      { name: 'tremfya', imagePath: './assets/brands/onePressDevice-1.PNG' },
    ],
  },
  {
    name: 'Prefilled Syringe',
    type: ProductTypes.PrefilledSyringe,
    imagePath: './assets/products/prefilledsyringe.png',
    brands: [
      {
        name: 'stelara',
        imagePath: './assets/brands/prefilledSyringe-1.PNG',
      },
      {
        name: 'tremfya',
        imagePath: './assets/brands/prefilledSyringe-2.PNG',
      },
      {
        name: 'hafyera',
        imagePath: './assets/brands/prefilledSyringe-3.PNG',
      },
    ],
  },
  {
    name: 'Autoinjector',
    type: ProductTypes.Autoinjector,
    imagePath: './assets/products/autoinjector.png',
    brands: [
      { name: 'simponi', imagePath: './assets/brands/autoinjector-1.PNG' },
    ],
  },
  {
    name: 'Spray',
    type: ProductTypes.Spray,
    imagePath: './assets/products/spray.png',
    brands: [{ name: 'spravato', imagePath: './assets/brands/spray-1.PNG' }],
  },
  {
    name: 'Tablet',
    type: ProductTypes.Tablet,
    imagePath: './assets/products/tablet.png',
    brands: [
      { name: 'symtuza', imagePath: './assets/brands/tablet-1.PNG' },
      { name: 'erleada', imagePath: './assets/brands/tablet-2.PNG' },
      { name: 'opsynvi', imagePath: './assets/brands/tablet-3.PNG' },
      { name: 'xarelto', imagePath: './assets/brands/tablet-4.PNG' },
      { name: 'balversa', imagePath: './assets/brands/tablet-5.PNG' },
      { name: 'risperdal', imagePath: './assets/brands/tablet-6.PNG' },
      { name: 'imbruvica', imagePath: './assets/brands/tablet-7.PNG' },
      { name: 'uptravi', imagePath: './assets/brands/tablet-8.PNG' },
    ],
  },
  {
    name: 'Vial',
    type: ProductTypes.Vial,
    imagePath: './assets/products/vial.png',
    brands: [
      { name: 'velcade', imagePath: './assets/brands/vial-1.PNG' },
      { name: 'remicade', imagePath: './assets/brands/vial-2.PNG' },
      { name: 'darzalex', imagePath: './assets/brands/vial-3.PNG' },
      { name: 'simponi', imagePath: './assets/brands/vial-4.PNG' },
      { name: 'uptravi', imagePath: './assets/brands/vial-5.PNG' },
      { name: 'ponvory', imagePath: './assets/brands/vial-6.PNG' },
      { name: 'sterala', imagePath: './assets/brands/vial-7.PNG' },
      { name: 'tecvayli', imagePath: './assets/brands/vial-8.PNG' },
      { name: 'rybrevant', imagePath: './assets/brands/vial-9.PNG' },
    ],
  },
  {
    name: 'Injection Kit',
    type: ProductTypes.InjectionKit,
    imagePath: './assets/products/injectionkit.png',
    brands: [
      { name: 'risperdal', imagePath: './assets/brands/injectionKit-1.PNG' },
    ],
  },
  {
    name: 'Cream',
    type: ProductTypes.Cream,
    imagePath: './assets/products/cream.png',
    brands: [
      { name: 'daktarin', imagePath: './assets/brands/cream-1.PNG' },
      { name: 'nizoral', imagePath: './assets/brands/cream-2.PNG' },
      { name: 'daktacort', imagePath: './assets/brands/cream-3.PNG' },
    ],
  },
  {
    name: 'Patch',
    type: ProductTypes.Patch,
    imagePath: './assets/products/patch.png',
    brands: [{ name: 'evra', imagePath: './assets/brands/patch-1.PNG' }],
  },
  {
    name: 'Ampule',
    type: ProductTypes.Ampule,
    imagePath: './assets/products/ampule.png',
    brands: [{ name: 'daktarin', imagePath: './assets/brands/ampule-1.PNG' }],
  },
  {
    name: 'Other',
    type: ProductTypes.Other,
    imagePath: './assets/products/other.png',
    brands: [
      { name: 'carvykti', imagePath: './assets/brands/other-1.PNG' },
      { name: 'cabenuva', imagePath: './assets/brands/other-2.PNG' },
      { name: 'akeega', imagePath: './assets/brands/other-3.PNG' },
    ],
  },
  {
    name: 'Unknown',
    type: ProductTypes.Unknown,
    imagePath: './assets/products/unknown.png',
    brands: [
      { name: 'tremfya', imagePath: './assets/brands/onePressDevice-1.PNG' },
      { name: 'stelara', imagePath: './assets/brands/prefilledSyringe-1.PNG' },
      { name: 'hafyera', imagePath: './assets/brands/prefilledSyringe-3.PNG' },
      { name: 'simponi', imagePath: './assets/brands/autoinjector-1.PNG' },
      { name: 'spravato', imagePath: './assets/brands/spray-1.PNG' },
      { name: 'symtuza', imagePath: './assets/brands/tablet-1.PNG' },
      { name: 'erleada', imagePath: './assets/brands/tablet-2.PNG' },
      { name: 'opsynvi', imagePath: './assets/brands/tablet-3.PNG' },
      { name: 'xarelto', imagePath: './assets/brands/tablet-4.PNG' },
      { name: 'balversa', imagePath: './assets/brands/tablet-5.PNG' },
      { name: 'risperdal', imagePath: './assets/brands/tablet-6.PNG' },
      { name: 'imbruvica', imagePath: './assets/brands/tablet-7.PNG' },
      { name: 'uptravi', imagePath: './assets/brands/tablet-8.PNG' },
      { name: 'velcade', imagePath: './assets/brands/vial-1.PNG' },
      { name: 'remicade', imagePath: './assets/brands/vial-2.PNG' },
      { name: 'darzalex', imagePath: './assets/brands/vial-3.PNG' },
      { name: 'ponvory', imagePath: './assets/brands/vial-6.PNG' },
      { name: 'tecvayli', imagePath: './assets/brands/vial-8.PNG' },
      { name: 'rybrevant', imagePath: './assets/brands/vial-9.PNG' },
      { name: 'daktarin', imagePath: './assets/brands/cream-1.PNG' },
      { name: 'nizoral', imagePath: './assets/brands/cream-2.PNG' },
      { name: 'daktacort', imagePath: './assets/brands/cream-3.PNG' },
      { name: 'evra', imagePath: './assets/brands/patch-1.PNG' },
      { name: 'carvykti', imagePath: './assets/brands/other-1.PNG' },
      { name: 'cabenuva', imagePath: './assets/brands/other-2.PNG' },
      { name: 'akeega', imagePath: './assets/brands/other-3.PNG' },
    ],
  },
];

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.component.html',
  styleUrls: ['./complaint-form.component.scss'],
})
export class ComplaintFormComponent implements OnDestroy, OnInit, AfterViewInit {
  readonly UserTypes = UserTypes;
  readonly ComplaintReportTypes = ComplaintReportTypes;
  readonly ProductTypes = ProductTypes;

  complaintSubmitted: boolean = false;
  readonly authorized$: Observable<boolean>;

  readonly productFormGroup: FormGroup<FormGroupType<IProductInformation>>;
  readonly personalInformationFormGroup: FormGroup<
    FormGroupType<IPersonalInformation>
  >;
  readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;
  readonly problemDetailsFormGroup: FormGroup<
    FormGroupType<IProblemDetailsWithDone>
  >;

  readonly initialReportingFormGroup: FormGroup<
    FormGroupType<IInitialReporting>
  >;

  readonly problemDetailsQuestionsFormGroup: FormRecord;
  problemDetailsQuestions: Question[] = [];

  imageHotspotValues: Question[] = [];

  readonly complaintReportingFormGroup: FormGroup<
    FormGroupType<IComplaintReporting>
  >;
  readonly userDetailsFormGroup: FormGroup<FormGroupType<IUserDetails>>;
  readonly complaintDetailsFormGroup: FormGroup<
    FormGroupType<IComplaintDetails>
  >;

  readonly stepperOrientation: Observable<StepperOrientation>;
  readonly stateGroupOptions$: Observable<StateGroup[]>;

  readonly stateGroups: StateGroup[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas'],
    },
    {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut'],
    },
    {
      letter: 'D',
      names: ['Delaware'],
    },
    {
      letter: 'F',
      names: ['Florida'],
    },
    {
      letter: 'G',
      names: ['Georgia'],
    },
    {
      letter: 'H',
      names: ['Hawaii'],
    },
    {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa'],
    },
    {
      letter: 'K',
      names: ['Kansas', 'Kentucky'],
    },
    {
      letter: 'L',
      names: ['Louisiana'],
    },
    {
      letter: 'M',
      names: [
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
      ],
    },
    {
      letter: 'N',
      names: [
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
      ],
    },
    {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon'],
    },
    {
      letter: 'P',
      names: ['Pennsylvania'],
    },
    {
      letter: 'R',
      names: ['Rhode Island'],
    },
    {
      letter: 'S',
      names: ['South Carolina', 'South Dakota'],
    },
    {
      letter: 'T',
      names: ['Tennessee', 'Texas'],
    },
    {
      letter: 'U',
      names: ['Utah'],
    },
    {
      letter: 'V',
      names: ['Vermont', 'Virginia'],
    },
    {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
    },
  ];

  personalInformationStep: number | null = 0;

  @ViewChild(MatStepper) stepper!: MatStepper;

  // totalSteps = this.stepper._steps.length;

  private readonly destroy$ = new Subject<void>();
  private readonly readyForMoreQuestions$ = new Subject<void>();

  titleOptions: string[] = Object.values(Title);
  countries: Country[] = Object.values(Country);
  genderOptions: string[] = Object.values(Gender);
  physicianAwarenessValues: string[] = Object.values(PhysicianAwareness);
  allergyStatusValues: string[] = Object.values(AllergyStatus);
  drugAbuseStatusValues: string[] = Object.values(DrugAbuseStatus);
  alcoholConsumptionStatusValues: string[] = Object.values(
    AlcoholConsumptionStatus
  );
  smokingStatusValues: string[] = Object.values(SmokingStatus);
  reporterAdministrationValues: string[] = Object.values(
    ReporterAdministration
  );
  permissionToContactValues: string[] = Object.values(ContactPermission);
  permissionToContactHCPValues: string[] = Object.values(ContactPermissionHCP);
  permissionToContactReporterValues: string[] = Object.values(
    ContactPermissionReporter
  );
  routeOfAdministrationOptions: string[] = Object.values(RouteOfAdministration);
  administeredByOptions: string[] = Object.values(AdministeredBy);
  concomitantMedicationStatusOptions: string[] = Object.values(
    ConcomitantMedicationStatus
  );
  heightUnitValues: string[] = Object.values(HeightUnit);
  weightUnitValues: string[] = Object.values(WeightUnit);
  consumptionUnitValues: string[] = Object.values(ConsumptionUnit);
  returnOptionValues: string[] = Object.values(ReturnOption);

  privacyPolicyChecked = false;

  showMedicalHistory: boolean = false;

  complaintType = [
    {
      name: 'Product Quality Complaint',
      definition:
        'Concerns about the quality, safety, or effectiveness of a drug product',
      value: this.ComplaintReportTypes.ProductQualityComplaint,
    },
    {
      name: 'Adverse Event',
      definition:
        "Medical Concern- If this issue affected person's health then select Adverse Event",
      value: this.ComplaintReportTypes.AdverseEvent,
    },
    {
      name: 'Product Information',
      definition:
        'Comprehensive details and specifications about a particular product',
      value: this.ComplaintReportTypes.ProductInformation,
    },
  ];

  selectedValues: string[] = [];

  products: Product[] = products;

  showConcomitantProductDetails = false;

  @ViewChild('brandsSection') brandsSection!: ElementRef;
  @ViewChild('strengthSection') strengthSection?: ElementRef;

  showAllProducts: boolean = true; 
  selectedProductIndex: number = -1; 

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    private readonly questionsService: QuestionsService,
    private readonly progressBarService: ProgressBarService,
    private readonly fb: FormBuilder,
    activedRoute: ActivatedRoute,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 1000px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'horizontal')));

    // this.progressBarService.setTotalSteps(this.stepper._steps.length);

    this.productFormGroup = fb.group<FormGroupType<IProductInformation>>({
      productQualityComplaint: fb.control<boolean | null>(null, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),

      userType: fb.control<UserTypes>(UserTypes.Patient, {
        nonNullable: true,
        validators: [Validators.required],
      }),

      brand: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      lotNumber: fb.control<string>('', {}),
    });

    this.initialReportingFormGroup = fb.group<FormGroupType<IInitialReporting>>(
      {
        userType: fb.control<UserTypes>(UserTypes.Patient, {
          nonNullable: true,
          validators: [Validators.required],
        }),

        permission: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        contactInformartion: fb.group<FormGroupType<IContactData>>({
          name: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          facilityName: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),

          phoneNumber: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),

          email: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          address: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
        }),
        product: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }
    );

    this.complaintReportingFormGroup = fb.group<
      FormGroupType<IComplaintReporting>
    >({
      userType: fb.control<UserTypes | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      purchasedCountry: fb.control<Country | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      product: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      brand: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      strength: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      returnOption: fb.control<ReturnOption | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hasBatchLotNumber: fb.control<boolean | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      batchLotNumber: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      noReason: fb.control<string>('', {
        nonNullable: true,
        validators: [],
      }),
      gtin: fb.control<string>('', {
        nonNullable: true,
        validators: [],
      }),
      serial: fb.control<string>('', {
        nonNullable: true,
        validators: [],
      }),
      hcp: fb.group<FormGroupType<IHcpData>>({
        reportedFromJNJProgram: fb.control<boolean | null>(null, {
          nonNullable: true,
          validators: [],
        }),
        studyProgram: fb.control<string>('', {
          nonNullable: true,
          validators: [],
        }),
        siteNumber: fb.control<string>('', {
          nonNullable: true,
          validators: [],
        }),
        subjectNumber: fb.control<string>('', {
          nonNullable: true,
          validators: [],
        }),
      }),
      issueDescription: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      uploadImage: fb.control<File[]>([], {
        nonNullable: true,
        validators: [],
      }),
      // productImage: fb.control<string>("", { nonNullable: true, validators: [] }),
    });

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
          additionalContactInformation: fb.group<FormGroupType<IContactInformation>>({
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
        // patientMedicalHistory: fb.group<FormGroupType<IPatientMedicalHistory>>({
        //   medicalHistory: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   allergies: fb.control<AllergyStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   allergyDetails: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [],
        //   }),
        //   drugAbuse: fb.control<DrugAbuseStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   drugAbuseDetails: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [],
        //   }),
        //   alcoholConsumption: fb.control<AlcoholConsumptionStatus | null>(
        //     null,
        //     { nonNullable: true, validators: [Validators.required] }
        //   ),
        //   alcoholConsumptionDetails: fb.group<FormGroupType<Consumption>>({
        //     value: fb.control<string | null>(null, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //   }),
        //   smokingStatus: fb.control<SmokingStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   smokingDetails: fb.group<FormGroupType<Consumption>>({
        //     value: fb.control<string | null>(null, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //   }),
        // }),
      }),

      patientReporterInformation: fb.group<
        FormGroupType<IPatientReporterInformation>
      >({
        permissionToContactReporter: fb.control<ContactPermissionReporter | null>(null, {
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
          additionalContactInformation: fb.group<FormGroupType<IContactInformation>>({
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
        // patientMedicalHistory: fb.group<FormGroupType<IPatientMedicalHistory>>({
        //   medicalHistory: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   allergies: fb.control<AllergyStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   allergyDetails: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [],
        //   }),
        //   drugAbuse: fb.control<DrugAbuseStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   drugAbuseDetails: fb.control<string>('', {
        //     nonNullable: true,
        //     validators: [],
        //   }),
        //   alcoholConsumption: fb.control<AlcoholConsumptionStatus | null>(
        //     null,
        //     { nonNullable: true, validators: [Validators.required] }
        //   ),
        //   alcoholConsumptionDetails: fb.group<FormGroupType<Consumption>>({
        //     value: fb.control<string | null>(null, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //   }),
        //   smokingStatus: fb.control<SmokingStatus | null>(null, {
        //     nonNullable: true,
        //     validators: [Validators.required],
        //   }),
        //   smokingDetails: fb.group<FormGroupType<Consumption>>({
        //     value: fb.control<string | null>(null, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
        //       nonNullable: true,
        //       validators: [],
        //     }),
        //   }),
        // }),
      }),
    });

    this.complaintDetailsFormGroup = fb.group<FormGroupType<IComplaintDetails>>(
      {
        product: fb.group<FormGroupType<IProductDetails>>({
          tookProductAsDirected: fb.control<string>('', {
            nonNullable: true,
            validators: [Validators.required],
          }),
          administeredBy: fb.control<AdministeredBy | null>(null, {
            nonNullable: true,
            validators: [Validators.required],
          }),
          concomitantMedication: fb.group<FormGroupType<ConcomitantMedication>>(
            {
              status: fb.control<ConcomitantMedicationStatus | null>(null, {
                nonNullable: true,
                validators: [Validators.required],
              }),
              details: fb.group<FormGroupType<ConcomitantMedicationDetails>>({
                productName: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                formulation: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                indication: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                routeOfAdministration:
                  this.fb.control<RouteOfAdministration | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required],
                  }),
                startDate: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                endDate: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                dose: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                strength: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                frequency: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                frequencyTime: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
                optionalImage: this.fb.control<string>('', {
                  nonNullable: true,
                  validators: [Validators.required],
                }),
              }),
            }
          ),
        }),
        reportedFromJNJProgram: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        studyProgram: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        siteNumber: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        subjectNumber: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        complaintDescription: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }
    );

    const stateControl = fb.control<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    });

    this.personalInformationFormGroup = fb.group<
      FormGroupType<IPersonalInformation>
    >({
      personalData: fb.group<FormGroupType<IPersonalData>>({
        firstName: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        lastName: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),

        birthdate: fb.control<DateTime>(
          DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
          { nonNullable: true, validators: [Validators.required] }
        ),

        sex: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        pregnant: fb.control<string>('', {
          nonNullable: false,
          validators: [],
        }),
      }),

      physicalAddress: fb.group<FormGroupType<IAddress>>({
        streetAddress: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        streetAddress2: fb.control<string>('', {}),
        city: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        state: stateControl,
        zipPostal: fb.control<string>('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    this.stateGroupOptions$ = stateControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value || '')),
      takeUntil(this.destroy$)
    );

    this.problemSummaryFormGroup = fb.group<FormGroupType<IProblemSummary>>({
      issueVerbatim: fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      images: fb.control<File[]>([], { nonNullable: true }),
    });

    this.problemDetailsQuestionsFormGroup = fb.record({});
    this.problemDetailsFormGroup = fb.group<
      FormGroupType<IProblemDetailsWithDone>
    >({
      done: fb.control<boolean>(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
      questions: this.problemDetailsQuestionsFormGroup as any,
      followUpOkay: fb.control<boolean>(false, { nonNullable: true }),
    });

    this.problemDetailsQuestionsFormGroup.statusChanges
      .pipe(
        filter((c) => c === 'VALID'),
        takeUntil(this.destroy$)
      )
      .subscribe((status) => {
        this.getNextQuestions();
      });

    activedRoute.queryParamMap
      .pipe(
        map(
          (c): IProductInformation => ({
            productQualityComplaint: null,
            userType: UserTypes.Patient,
            brand: c.get('product.brand') ?? '',
            lotNumber: c.get('product.lot') ?? '',
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((c) => {
        this.productFormGroup.setValue(c);
      });

    activedRoute.queryParamMap
      .pipe(
        map(
          (c): IInitialReporting => ({
            userType: UserTypes.Patient,
            permission: c.get('report.permission') ?? '',
            contactInformartion: {
              name: c.get('reportForm.contactInformartion?.name') ?? '',
              facilityName:
                c.get('reportForm.contactInformartion?.facilityName') ?? '',
              phoneNumber:
                c.get('reportForm.contactInformartion?.phoneNumber') ?? '',
              email: c.get('reportForm.contactInformartion?.email') ?? '',
              address: c.get('reportForm.contactInformartion?.address') ?? '',
            },
            product: c.get('report.product') ?? '',
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((c) => {
        this.initialReportingFormGroup.setValue(c);
      });

    this.readyForMoreQuestions$
      .pipe(
        map((): IQuestionsRequest => {
          const product = this.productFormGroup.value;
          const reportForm = this.initialReportingFormGroup.value;
          const personalInformation = this.personalInformationFormGroup.value;
          const problemSummary = this.problemSummaryFormGroup.value;
          const problemDetails = this.problemDetailsQuestionsFormGroup.value;

          const answeredQuestions: IQuestionsRequestAnswer[] = [];
          for (const question of this.problemDetailsQuestions) {
            const response = problemDetails[question.id];
            answeredQuestions.push({ questionId: question.id, response });
          }

          return {
            product: {
              productQualityComplaint: product.productQualityComplaint ?? null,
              userType: product.userType!,
              brand: product.brand!,
              lotNumber: product.lotNumber ?? null,
            },
            report: {
              userType: reportForm.userType!,
              permission: reportForm.permission!,
              contactInformartion: {
                name: reportForm.contactInformartion?.name!,
                facilityName: reportForm.contactInformartion?.facilityName!,
                phoneNumber: reportForm.contactInformartion?.phoneNumber!,
                email: reportForm.contactInformartion?.email!,
                address: reportForm.contactInformartion?.address!,
              },
              product: reportForm.product! ?? null,
            },
            userType: reportForm.userType!,
            verbatim: problemSummary.issueVerbatim!,
            answeredQuestions,
          };
        }),
        switchMap((c) => this.questionsService.getNextQuestions(c)),
        takeUntil(this.destroy$)
      )
      .subscribe((resp) => {
        if (resp.done) {
          this.problemDetailsFormGroup.controls.done.setValue(true);
          return;
        }

        this.problemDetailsFormGroup.controls.done.setValue(false);

        const problemDetailsQuestions = [...this.problemDetailsQuestions];

        for (const question of resp.questions) {
          const validators: ValidatorFn[] = [];
          if (question.required) {
            validators.push(Validators.required);
          }

          this.problemDetailsQuestionsFormGroup.addControl(
            question.id,
            fb.control<string>('', { validators })
          );
          problemDetailsQuestions.push(question);
        }

        this.problemDetailsQuestions = problemDetailsQuestions;
      });

    if (environment.token) {
      this.authorized$ = activedRoute.queryParamMap.pipe(
        map((c) => c.get('token')),
        map((c) => c === environment.token)
      );
    } else {
      this.authorized$ = of(true);
    }

    this.imageHotspotValues = [
      {
        id: 'simponi_device_failure_location',
        type: 'image-map',
        required: true,
        questionText: '',
        imageUrl:
          'https://www.simponihcp.com/sites/www.simponihcp.com/files/injection_experience_autoinjector_desktop_1.png',
        areas: [
          {
            value: 'Hidden Needle',

            x: 394,
            y: 283,
            radius: 22,

            nextQuestionId: 'needle_damage_type',
          },
          {
            value: 'Safety Sleeve',

            x: 440,
            y: 253,
            radius: 22,

            nextQuestionId: 'who_administered',
          },
          {
            value: 'Tamper-Evident Seal',

            x: 545,
            y: 317,
            radius: 22,

            nextQuestionId: 'who_administered',
          },
          {
            value: 'Large Viewing Window',

            x: 625,
            y: 250,
            radius: 22,

            nextQuestionId: 'who_administered',
          },
          {
            value: 'Activation Button',

            x: 750,
            y: 236,
            radius: 22,

            nextQuestionId: 'button_stuck',
          },
          {
            value: 'Easy-to-Grip Shape',

            x: 927,
            y: 300,
            radius: 22,

            nextQuestionId: 'who_administered',
          },
          {
            value: 'Expiration Date',

            x: 1055,
            y: 328,
            radius: 22,

            nextQuestionId: 'who_administered',
          },
        ],
      },
    ];
  }

  onStepSelectionChange(event: StepperSelectionEvent) {
    const selectedStep = event.selectedIndex;
    const totalSteps = this.stepper._steps.length;
    const newProgressValue = ((selectedStep + 1) / totalSteps) * 100;

    this.progressBarService.setProgressValue(newProgressValue);
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.complaintReportingFormGroup.controls.product.valueChanges.subscribe((product) => {
      if (product) {
        this.scrollToItemSection();
      }
    });

    this.complaintReportingFormGroup.controls.brand.valueChanges.subscribe((brand) => {
      if (brand) {
        this.scrollToStrengthSection();
      }
    });
  }

  private scrollToItemSection(): void {
    // this.brandsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private scrollToStrengthSection(): void {
    
    setTimeout(() => {
      if (!this.strengthSection) {
        return
      }
      this.strengthSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
  }

  // get concomitantProductDetails(): FormArray {
  //   return this.complaintDetailsFormGroup.get('product.concomitantMedication.details') as FormArray;
  // }

  onPatientRadioChange(value: boolean) {
    const patientContactInfo = this.userDetailsFormGroup.get('patientInformation.patient.contactInformation');
    const contactFields = ['addressLine1', 'city', 'postalCode', 'state', 'telephone', 'emailAddress'];

    contactFields.forEach(contact => {
      const control = patientContactInfo?.get(contact);
      if (control) {
        control.setValidators(value ? [Validators.required] : []);
        control.updateValueAndValidity();
      }
    })
  }

  onNonPatientReporterRadioChange(value: boolean) {
    const patientReporterContactInfo = this.userDetailsFormGroup.get('patientReporterInformation.patient.contactInformation');
    const contactFields = ['addressLine1', 'city', 'postalCode', 'state', 'telephone', 'emailAddress'];

    contactFields.forEach(contact => {
      const control = patientReporterContactInfo?.get(contact);
      if (control) {
        control.setValidators(value ? [Validators.required] : []);
        control.updateValueAndValidity();
      }
    })
  }

  get formControls(): { label: string; value: string }[] {
    const controls = this.complaintReportingFormGroup.controls;
    const entries = Object.keys(controls).map((key) => {
      const control: AbstractControl = this.complaintReportingFormGroup.get(
        key
      ) as AbstractControl;
      let value: string;

      if (Array.isArray(control.value)) {
        value = control.value.join(', ');
      } else if (typeof control.value === 'object' && control.value !== null) {
        value = this.formatObjectValue(control.value);
      } else if (control.value !== null) {
        value = control.value.toString();
      } else {
        return null;
      }
      return {
        label: key,
        value: value,
      };
    });
    return entries.filter((entry) => entry !== null) as {
      label: string;
      value: string;
    }[];
  }

  private formatObjectValue(obj: any): string {
    const properties = Object.keys(obj).map(prop => `${prop}: ${obj[prop]}`);
    return properties.join(', ');
  }

  addConcomitantProductDetails() {
    const cc = {
      productName: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      formulation: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      indication: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      routeOfAdministration: this.fb.control<RouteOfAdministration | null>(
        null,
        { nonNullable: true, validators: [Validators.required] }
      ),
      startDate: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      endDate: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      dose: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      strength: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      frequency: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      frequencyTime: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      optionalImage: this.fb.control<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    };
    // this.complaintDetailsFormGroup.
  }

  addConcomitantProduct() {
    this.showConcomitantProductDetails = true;
  }

  deleteConcomitantProduct() {
    this.showConcomitantProductDetails = false;
  }

  onTabsChange() {
    this.complaintReportingFormGroup.controls.product.setValue('');
  }

  get selectedProductControl(): FormControl {
    return this.complaintReportingFormGroup.get('product') as FormControl;
  }

  get selectedBrandControl(): FormControl {
    return this.complaintReportingFormGroup.get('brand') as FormControl;
  }

  onProductSelectionChange(index: number): void {
    this.selectedBrandControl.setValue(null);
    this.selectedProductIndex = index;
    this.showAllProducts = false;
  }

  toggleProducts() {
    this.showAllProducts = !this.showAllProducts;
  }

  onBrandSelectionChange(brandName: string): void {
    this.selectedBrandControl.setValue(brandName);
    // this.scrollToStrengthSection();
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map((group) => ({
          letter: group.letter,
          names: _filter(group.names, value),
        }))
        .filter((group) => group.names.length > 0);
    }

    return this.stateGroups;
  }

  get productQualityComplaint() {
    return this.productFormGroup.controls.productQualityComplaint.value;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  nextStep() {
    // const selectedReportType =
    //   this.complaintReportingFormGroup.controls.complaintReportType.value;
    // if (selectedReportType?.includes(this.ComplaintReportTypes.AdverseEvent)) {
    //   this.showMedicalHistory = true;
    // } else {
    //   this.showMedicalHistory = false;
    // }
    // this.stepper.next();
  }

  resetProblemDetails() {
    this.onProblemSummarySubmitted();
  }

  onProblemSummarySubmitted() {
    for (const k in this.problemDetailsQuestionsFormGroup.controls) {
      if (
        !Object.prototype.hasOwnProperty.call(
          this.problemDetailsQuestionsFormGroup.controls,
          k
        )
      ) {
        continue;
      }

      this.problemDetailsQuestionsFormGroup.removeControl(k);
    }

    this.problemDetailsQuestions = [];

    this.getNextQuestions();
  }

  isExpansionStepInvalid(
    currentStep: number | null,
    step: number,
    formGroup: AbstractControl
  ) {
    if (formGroup.valid || currentStep === step) {
      return false;
    }

    if (currentStep === null) {
      return true;
    }

    if (currentStep < step) {
      return formGroup.dirty;
    }

    return true;
  }

  showLotNumberHelp() {
    this.bottomSheet.open(LotNumberHelpBottomSheetComponent);
  }

  submitComplaint(): void {
    this.complaintSubmitted = true;
  }

  private getNextQuestions() {
    this.readyForMoreQuestions$.next();
  }
}
