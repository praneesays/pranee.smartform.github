import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
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
  HeightUnit,
  WeightUnit,
  ConsumptionUnit,
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
      { name: 'Tremfya', imagePath: './assets/brands/Tremfya.png' },
    ],
  },
  {
    name: 'Prefilled Syringe',
    type: ProductTypes.PrefilledSyringe,
    imagePath: './assets/products/prefilledsyringe.png',
    brands: [
      { name: 'Stelara', imagePath: './assets/brands/Stelara.png' },
      { name: 'Tremfya', imagePath: './assets/brands/Tremfya.png' },
      { name: 'Invega', imagePath: './assets/brands/Invega.png' },
    ],
  },
  {
    name: 'Autoinjector',
    type: ProductTypes.Autoinjector,
    imagePath: './assets/products/autoinjector.png',
    brands: [
      { name: 'Simponi', imagePath: './assets/brands/Simponi.png' },
    ],
  },
  {
    name: 'Spray',
    type: ProductTypes.Spray,
    imagePath: './assets/products/spray.png',
    brands: [{ name: 'Spravato', imagePath: './assets/brands/Spravato.png' }],
  },
  {
    name: 'Tablet',
    type: ProductTypes.Tablet,
    imagePath: './assets/products/tablet.png',
    brands: [
      { name: 'Symtuza', imagePath: './assets/brands/Symtuza.png' },
      { name: 'Erleada', imagePath: './assets/brands/Erleada.png' },
      { name: 'Opsynvi', imagePath: './assets/brands/Opsynvi.png' },
      { name: 'Xarelto', imagePath: './assets/brands/Xarelto.png' },
      { name: 'Balversa', imagePath: './assets/brands/Balversa.png' },
      { name: 'RisperdalConsta', imagePath: './assets/brands/RisperdalConsta.png' },
      { name: 'Imbruvica', imagePath: './assets/brands/Imbruvica.png' },
      { name: 'Uptravi', imagePath: './assets/brands/Uptravi.png' },
    ],
  },
  {
    name: 'Vial',
    type: ProductTypes.Vial,
    imagePath: './assets/products/vial.png',
    brands: [
      { name: 'Velcade', imagePath: './assets/brands/Velcade.png' },
      { name: 'Remicade', imagePath: './assets/brands/Remicade.png' },
      { name: 'Darzalex', imagePath: './assets/brands/Darzalex.png' },
      { name: 'Simponi', imagePath: './assets/brands/Simponi.png' },
      { name: 'Uptravi', imagePath: './assets/brands/Uptravi.png' },
      { name: 'Ponvory', imagePath: './assets/brands/Ponvory.png' },
      { name: 'Stelara', imagePath: './assets/brands/Stelara.png' },
      { name: 'Tecvayli', imagePath: './assets/brands/Tecvayli.png' },
      { name: 'Rybrevant', imagePath: './assets/brands/Rybrevant.png' },
    ],
  },
  {
    name: 'Injection Kit',
    type: ProductTypes.InjectionKit,
    imagePath: './assets/products/injectionkit.png',
    brands: [
      { name: 'RisperdalConsta', imagePath: './assets/brands/RisperdalConsta.png' },
    ],
  },
  {
    name: 'Cream',
    type: ProductTypes.Cream,
    imagePath: './assets/products/cream.png',
    brands: [
      { name: 'Daktarin', imagePath: './assets/brands/Daktarin.png' },
      { name: 'Nizoral', imagePath: './assets/brands/Nizoral.png' },
      { name: 'Daktacort', imagePath: './assets/brands/Daktacort.png' },
    ],
  },
  {
    name: 'Patch',
    type: ProductTypes.Patch,
    imagePath: './assets/products/patch.png',
    brands: [{ name: 'Evra', imagePath: './assets/brands/Evra.png' }],
  },
  {
    name: 'Ampule',
    type: ProductTypes.Ampule,
    imagePath: './assets/products/ampule.png',
    brands: [{ name: 'Daktarin', imagePath: './assets/brands/Daktarin.png' }],
  },
  {
    name: 'Other',
    type: ProductTypes.Other,
    imagePath: './assets/products/other.png',
    brands: [
      { name: 'Carvykti', imagePath: './assets/brands/Carvykti.png' },
      { name: 'Cabenuva', imagePath: './assets/brands/Cabenuva.png' },
      { name: 'Akeega', imagePath: './assets/brands/Akeega.png' },
    ],
  },
  {
    name: 'Unknown',
    type: ProductTypes.Unknown,
    imagePath: './assets/products/unknown.png',
    brands: [
      { name: 'Tremfya', imagePath: './assets/brands/Tremfya.png' },
      { name: 'Stelara', imagePath: './assets/brands/Stelara.png' },
      { name: 'Invega', imagePath: './assets/brands/Invega.png' },
      { name: 'Simponi', imagePath: './assets/brands/Simponi.png' },
      { name: 'Spravato', imagePath: './assets/brands/Spravato.png' },
      { name: 'Symtuza', imagePath: './assets/brands/Symtuza.png' },
      { name: 'Erleada', imagePath: './assets/brands/Erleada.png' },
      { name: 'Opsynvi', imagePath: './assets/brands/Opsynvi.png' },
      { name: 'Xarelto', imagePath: './assets/brands/Xarelto.png' },
      { name: 'Balversa', imagePath: './assets/brands/Balversa.png' },
      { name: 'RisperdalConsta', imagePath: './assets/brands/RisperdalConsta.png' },
      { name: 'Imbruvica', imagePath: './assets/brands/Imbruvica.png' },
      { name: 'Uptravi', imagePath: './assets/brands/Uptravi.png' },
      { name: 'Velcade', imagePath: './assets/brands/Velcade.png' },
      { name: 'Remicade', imagePath: './assets/brands/Remicade.png' },
      { name: 'Darzalex', imagePath: './assets/brands/Darzalex.png' },
      { name: 'Ponvory', imagePath: './assets/brands/Ponvory.png' },
      { name: 'Tecvayli', imagePath: './assets/brands/Tecvayli.png' },
      { name: 'Rybrevant', imagePath: './assets/brands/Rybrevant.png' },
      { name: 'Daktarin', imagePath: './assets/brands/Daktarin.png' },
      { name: 'Nizoral', imagePath: './assets/brands/Nizoral.png' },
      { name: 'Daktacort', imagePath: './assets/brands/Daktacort.png' },
      { name: 'Evra', imagePath: './assets/brands/Evra.png' },
      { name: 'Carvykti', imagePath: './assets/brands/Carvykti.png' },
      { name: 'Cabenuva', imagePath: './assets/brands/Cabenuva.png' },
      { name: 'Akeega', imagePath: './assets/brands/Akeega.png' },
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


  userTypeValues: string[] = Object.values(UserTypes);
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

  countriesList?: Observable<string[]>;

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

  filteredProducts: Product[] = products;

  filteredBrands: Brand[] = [];
  selectedBrand: string = '';

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
        validators: [],
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

    this.products.forEach(product => {
      this.filteredBrands = product.name === 'Unknown' ? product.brands : []
      this.sortBrands(product.brands)
    });
  }

  onStepSelectionChange(event: StepperSelectionEvent) {
    const selectedStep = event.selectedIndex;
    const totalSteps = this.stepper._steps.length;
    const newProgressValue = ((selectedStep + 1) / totalSteps) * 100;

    this.progressBarService.setProgressValue(newProgressValue);
  }

  ngOnInit() {
    const patientContactInfo = this.userDetailsFormGroup.get('patientInformation.patient.contactInformation');
    const patientReporterContactInfo = this.userDetailsFormGroup.get('patientReporterInformation.patient.contactInformation');

    if (this.complaintReportingFormGroup.controls.purchasedCountry) {
      this.countriesList = this.complaintReportingFormGroup.controls.purchasedCountry.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
    } else if (patientContactInfo?.get('country')) {
      this.countriesList = patientContactInfo?.get('country')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
    } else if (patientReporterContactInfo?.get('country')) {
      this.countriesList = patientReporterContactInfo?.get('country')?.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      )
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter(country => country.toLowerCase().includes(filterValue));
  }

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

  filterbrands(filter: string, productName: string) {
    const productList = this.products.find(product => product.name == productName);

    if (productList) {
      if (productName === 'Unknown') {
        this.filteredBrands = productList.brands.filter(brand =>
          filter ?
          brand.name.charAt(0).toUpperCase() >= filter.charAt(0).toUpperCase() &&
          brand.name.charAt(0).toUpperCase() <= filter.charAt(2).toUpperCase()
          : true)
      } else {
        this.filteredBrands = productList.brands;
      }

      // switch(filter) {
      //   case 'A-C':
      //     this.filteredProducts = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='A' && brand.name.charAt(0).toUpperCase() <= 'C'
      //     )
      //     break;
      //   case 'D-F':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='D' && brand.name.charAt(0).toUpperCase() <= 'F'
      //     )
      //     break;
      //   case 'G-I':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='G' && brand.name.charAt(0).toUpperCase() <= 'I'
      //     )
      //     break;
      //   case 'J-L':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='J' && brand.name.charAt(0).toUpperCase() <= 'L'
      //     )
      //     break;
      //   case 'M-O':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='M' && brand.name.charAt(0).toUpperCase() <= 'O'
      //     )
      //     break;
      //   case 'P-R':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='P' && brand.name.charAt(0).toUpperCase() <= 'R'
      //     )
      //     break;
      //   case 'S-U':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='S' && brand.name.charAt(0).toUpperCase() <= 'U'
      //     )
      //     break;
      //   case 'V-Z':
      //     this.filteredBrands = product.brands.filter(brand =>
      //       brand.name.charAt(0).toUpperCase() >='V' && brand.name.charAt(0).toUpperCase() <= 'Z'
      //     )
      //     break;
      //   default:
      //     this.filteredBrands = [...product.brands]
      //     break;
      // }
    }
    this.sortBrands(this.filteredBrands);
    this.selectedBrand = filter;
  }

  sortBrands(brands: Brand[]) {
    brands.sort((a, b) => a.name.localeCompare(b.name));
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

  handleBatchLotNumberChange(value: boolean) {
    const batchLotNumber = this.complaintReportingFormGroup.get('batchLotNumber') ;
    const noReason = this.complaintReportingFormGroup?.get('noReason');

    if (!batchLotNumber) {
      return
    }

    if (!noReason) {
      return
    }
    
    if (value) {
        this.clearValidatorsAndSetValue(noReason);        
        this.setRequiredValidator(batchLotNumber);
    } else {
      this.clearValidatorsAndSetValue(batchLotNumber);
      this.setRequiredValidator(noReason);
    }

    this.updateFormControlValidity(batchLotNumber);
    this.updateFormControlValidity(noReason);
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

  setRequiredValidator(control: AbstractControl) {
    control?.setValidators(Validators.required);
  }

  clearValidatorsAndSetValue(control: AbstractControl) {
    control?.setValue('');
    control?.clearValidators();
  }

  updateFormControlValidity(control: AbstractControl) {
    control?.updateValueAndValidity();
  }

  private initializeHcpFormGroup() {
    const reportedFromJNJProgramControl = this.hcpFormGroup.get('reportedFromJNJProgram');
    const studyProgramControl = this.hcpFormGroup.get('studyProgram');
    const siteNumberControl = this.hcpFormGroup.get('siteNumber');
    const subjectNumberControl = this.hcpFormGroup.get('subjectNumber');

    reportedFromJNJProgramControl?.setValidators([Validators.required]);

    reportedFromJNJProgramControl?.valueChanges.subscribe(value => {
      if (value) {
        studyProgramControl?.setValidators([Validators.required]);
        siteNumberControl?.setValidators([Validators.required]);
        subjectNumberControl?.setValidators([Validators.required]);
      } else {
        studyProgramControl?.updateValueAndValidity();
        siteNumberControl?.updateValueAndValidity();
        subjectNumberControl?.updateValueAndValidity();
      }
    })
    reportedFromJNJProgramControl?.updateValueAndValidity();    
  }

  private clearHcpFormGroup() {
    this.hcpFormGroup.clearValidators();
  }

  onUserTypeChange(value: string) {
    if (value === UserTypes.HealthcareProfessional) {
      this.initializeHcpFormGroup();
    } else {
      this.clearHcpFormGroup();
    }
    this.hcpFormGroup.updateValueAndValidity();
  }

  get hcpFormGroup() {
    return this.complaintReportingFormGroup.get('hcp') as FormGroup;
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
    this.filteredProducts = this.products.filter(product => product.brands.some(brand => brand.name.toLowerCase() === brandName.toLowerCase()) && product.name !== 'Unknown' )
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
