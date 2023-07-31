// import { BreakpointObserver } from "@angular/cdk/layout";
// import { StepperSelectionEvent } from "@angular/cdk/stepper";
// import {
//     AfterViewInit,
//     Component,
//     ElementRef,
//     OnDestroy,
//     OnInit,
//     ViewChild
// } from "@angular/core";
// import {
//     AbstractControl,
//     FormBuilder,
//     FormControl,
//     FormGroup,
//     FormRecord,
//     Validators
// } from "@angular/forms";
// import { MatBottomSheet } from "@angular/material/bottom-sheet";
// import { MatStepper, StepperOrientation } from "@angular/material/stepper";
// import { ActivatedRoute } from "@angular/router";
// import {
//     IProductBrandView,
//     IProductFormView,
//     ProductBrandsFilter,
//     ProductFormsFilter
// } from "@generated-api-clients";
// import { DateTime } from "luxon";
// import {
//     BehaviorSubject,
//     filter,
//     map,
//     Observable,
//     of,
//     startWith,
//     Subject,
//     switchMap,
//     takeUntil
// } from "rxjs";
// import { ProductsApiService } from "src/app/api/products-api.service";
// import { ProgressBarService } from "src/app/services/progress-bar.service";
// import {
//     combineMapLatest,
//     filterTruthy,
//     observeFormControlValue,
//     replayLatest
// } from "src/app/utilities/rxjs-utils";
// import { environment } from "src/environments/environment";
// import { makeApiType } from "src2/app/_gen/helpers";
// import { LotNumberHelpBottomSheetComponent } from "../..//bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component";
// import { Question } from "../../questions";
// import { QuestionsService } from "../../services/questions.service";
// import {
//     AdministeredBy,
//     AlcoholConsumptionStatus,
//     AllergyStatus,
//     BatchOrLotNumberUnavailableReason,
//     ComplaintReportTypes,
//     ConcomitantMedicationStatus,
//     ConsumptionUnit,
//     ContactPermission,
//     ContactPermissionHCP,
//     ContactPermissionReporter,
//     Country,
//     DrugAbuseStatus,
//     Gender,
//     HeightUnit,
//     IAddress,
//     IComplaintReporting,
//     IContactData,
//     IContactInformation,
//     IHcpData,
//     IInitialReporting,
//     ILetterRange,
//     INonPatientInformation,
//     IPatientDetails,
//     IPatientInformation,
//     IPersonalData,
//     IPersonalInformation,
//     IPersonName,
//     IProblemSummary,
//     IProductInformation,
//     IReporterDetails,
//     IUserDetails,
//     PhysicianAwareness,
//     ProductTypes,
//     ReporterAdministration,
//     ReturnOption,
//     RouteOfAdministration,
//     SmokingStatus,
//     Title,
//     UserTypes,
//     WeightUnit
// } from "../../types";

// type FormGroupType<T> = {
//     [k in keyof T]: T[k] extends
//         | string
//         | DateTime
//         | boolean
//         | number
//         | File[]
//         | File
//         | null
//         | undefined
//         | IProductFormView
//         ? FormControl<T[k]>
//         : FormGroup<FormGroupType<T[k]>>;
// };

// export interface StateGroup {
//     letter: string;
//     names: string[];
// }

// export const _filter = (opt: string[], value: string): string[] => {
//     const filterValue = value.toLowerCase();

//     return opt.filter((item) => item.toLowerCase().includes(filterValue));
// };

// class LetterRange implements ILetterRange {
//     readonly name: string;

//     constructor(readonly from: string, readonly to: string) {
//         this.name = `${from}-${to}`;
//     }

//     matches(value: string): boolean {
//         return (
//             value.charAt(0).toUpperCase() >= this.from.toUpperCase() &&
//             value.charAt(0).toUpperCase() <= this.to.toUpperCase()
//         );
//     }
// }

// interface IProblemDetailsWithDone {
//     done: boolean;
//     questions: Record<string, any>;

//     followUpOkay: boolean;
// }

// @Component({
//     selector: "app-complaint-form",
//     templateUrl: "./complaint-form.component.html",
//     styleUrls: ["./complaint-form.component.scss"]
// })
// export class ComplaintFormComponent
//     implements OnDestroy, OnInit, AfterViewInit
// {
//     readonly UserTypes = UserTypes;
//     readonly ComplaintReportTypes = ComplaintReportTypes;
//     readonly ProductTypes = ProductTypes;

//     complaintSubmitted: boolean = false;
//     readonly authorized$: Observable<boolean>;

//     readonly productFormGroup: FormGroup<FormGroupType<IProductInformation>>;
//     readonly personalInformationFormGroup: FormGroup<
//         FormGroupType<IPersonalInformation>
//     >;
//     readonly problemSummaryFormGroup: FormGroup<FormGroupType<IProblemSummary>>;
//     readonly problemDetailsFormGroup: FormGroup<
//         FormGroupType<IProblemDetailsWithDone>
//     >;

//     readonly initialReportingFormGroup: FormGroup<
//         FormGroupType<IInitialReporting>
//     >;

//     readonly problemDetailsQuestionsFormGroup: FormRecord;
//     problemDetailsQuestions: Question[] = [];

//     imageHotspotValues: Question[] = [];

//     readonly complaintReportingFormGroup: FormGroup<
//         FormGroupType<IComplaintReporting>
//     >;
//     readonly userDetailsFormGroup: FormGroup<FormGroupType<IUserDetails>>;
//     // readonly complaintDetailsFormGroup: FormGroup<
//     //     FormGroupType<IComplaintDetails>
//     // >;

//     readonly stepperOrientation: Observable<StepperOrientation>;
//     readonly stateGroupOptions$: Observable<StateGroup[]>;

//     readonly stateGroups: StateGroup[] = [
//         {
//             letter: "A",
//             names: ["Alabama", "Alaska", "Arizona", "Arkansas"]
//         },
//         {
//             letter: "C",
//             names: ["California", "Colorado", "Connecticut"]
//         },
//         {
//             letter: "D",
//             names: ["Delaware"]
//         },
//         {
//             letter: "F",
//             names: ["Florida"]
//         },
//         {
//             letter: "G",
//             names: ["Georgia"]
//         },
//         {
//             letter: "H",
//             names: ["Hawaii"]
//         },
//         {
//             letter: "I",
//             names: ["Idaho", "Illinois", "Indiana", "Iowa"]
//         },
//         {
//             letter: "K",
//             names: ["Kansas", "Kentucky"]
//         },
//         {
//             letter: "L",
//             names: ["Louisiana"]
//         },
//         {
//             letter: "M",
//             names: [
//                 "Maine",
//                 "Maryland",
//                 "Massachusetts",
//                 "Michigan",
//                 "Minnesota",
//                 "Mississippi",
//                 "Missouri",
//                 "Montana"
//             ]
//         },
//         {
//             letter: "N",
//             names: [
//                 "Nebraska",
//                 "Nevada",
//                 "New Hampshire",
//                 "New Jersey",
//                 "New Mexico",
//                 "New York",
//                 "North Carolina",
//                 "North Dakota"
//             ]
//         },
//         {
//             letter: "O",
//             names: ["Ohio", "Oklahoma", "Oregon"]
//         },
//         {
//             letter: "P",
//             names: ["Pennsylvania"]
//         },
//         {
//             letter: "R",
//             names: ["Rhode Island"]
//         },
//         {
//             letter: "S",
//             names: ["South Carolina", "South Dakota"]
//         },
//         {
//             letter: "T",
//             names: ["Tennessee", "Texas"]
//         },
//         {
//             letter: "U",
//             names: ["Utah"]
//         },
//         {
//             letter: "V",
//             names: ["Vermont", "Virginia"]
//         },
//         {
//             letter: "W",
//             names: ["Washington", "West Virginia", "Wisconsin", "Wyoming"]
//         }
//     ];

//     readonly letterRanges: readonly ILetterRange[] = [
//         new LetterRange("A", "C"),
//         new LetterRange("D", "F"),
//         new LetterRange("G", "I"),
//         new LetterRange("J", "L"),
//         new LetterRange("M", "O"),
//         new LetterRange("P", "R"),
//         new LetterRange("S", "U"),
//         new LetterRange("V", "Z")
//     ];

//     readonly userTypeValues: string[] = Object.values(UserTypes);
//     readonly titleOptions: string[] = Object.values(Title);
//     readonly countries: Country[] = Object.values(Country);
//     readonly genderOptions: string[] = Object.values(Gender);
//     readonly physicianAwarenessValues: string[] =
//         Object.values(PhysicianAwareness);
//     readonly allergyStatusValues: string[] = Object.values(AllergyStatus);
//     readonly drugAbuseStatusValues: string[] = Object.values(DrugAbuseStatus);
//     readonly alcoholConsumptionStatusValues: string[] = Object.values(
//         AlcoholConsumptionStatus
//     );
//     readonly smokingStatusValues: string[] = Object.values(SmokingStatus);
//     readonly reporterAdministrationValues: string[] = Object.values(
//         ReporterAdministration
//     );
//     readonly permissionToContactValues: string[] =
//         Object.values(ContactPermission);
//     readonly permissionToContactHCPValues: string[] =
//         Object.values(ContactPermissionHCP);
//     readonly permissionToContactReporterValues: string[] = Object.values(
//         ContactPermissionReporter
//     );
//     readonly routeOfAdministrationOptions: string[] = Object.values(
//         RouteOfAdministration
//     );
//     readonly administeredByOptions: string[] = Object.values(AdministeredBy);
//     readonly concomitantMedicationStatusOptions: string[] = Object.values(
//         ConcomitantMedicationStatus
//     );
//     readonly heightUnitValues: string[] = Object.values(HeightUnit);
//     readonly weightUnitValues: string[] = Object.values(WeightUnit);
//     readonly consumptionUnitValues: string[] = Object.values(ConsumptionUnit);
//     readonly returnOptionValues: string[] = Object.values(ReturnOption);

//     readonly complaintType = [
//         {
//             name: "Product Quality Complaint",
//             definition:
//                 "Concerns about the quality, safety, or effectiveness of a drug product",
//             value: this.ComplaintReportTypes.ProductQualityComplaint
//         },
//         {
//             name: "Adverse Event",
//             definition:
//                 "Medical Concern- If this issue affected person's health then select Adverse Event",
//             value: this.ComplaintReportTypes.AdverseEvent
//         },
//         {
//             name: "Product Information",
//             definition:
//                 "Comprehensive details and specifications about a particular product",
//             value: this.ComplaintReportTypes.ProductInformation
//         }
//     ];

//     countriesList?: Observable<string[]>;

//     personalInformationStep: number | null = 0;
//     privacyPolicyChecked = false;

//     showMedicalHistory: boolean = false;

//     selectedValues: string[] = [];

//     showConcomitantProductDetails = false;

//     @ViewChild("brandsSection") brandsSection!: ElementRef;
//     @ViewChild("strengthSection") strengthSection?: ElementRef;
//     @ViewChild(MatStepper) stepper!: MatStepper;

//     showAllProducts: boolean = true;

//     // totalSteps = this.stepper._steps.length;

//     readonly allProductForms$: Observable<readonly IProductFormView[]>;
//     readonly filteredProductForms$: Observable<readonly IProductFormView[]>;
//     readonly filteredProductBrands$: Observable<readonly IProductBrandView[]>;

//     private readonly destroy$ = new Subject<void>();
//     private readonly readyForMoreQuestions$ = new Subject<void>();
//     private readonly brandAlphaFilter$ =
//         new BehaviorSubject<ILetterRange | null>(null);

//     constructor(
//         private readonly bottomSheet: MatBottomSheet,
//         private readonly questionsService: QuestionsService,
//         private readonly productsApiService: ProductsApiService,
//         private readonly progressBarService: ProgressBarService,
//         private readonly fb: FormBuilder,
//         activedRoute: ActivatedRoute,
//         breakpointObserver: BreakpointObserver
//     ) {
//         this.stepperOrientation = breakpointObserver
//             .observe("(min-width: 1000px)")
//             .pipe(
//                 map(({ matches }) => (matches ? "horizontal" : "horizontal"))
//             );

//         this.allProductForms$ = productsApiService
//             .getForms()
//             .pipe(replayLatest(this.destroy$), takeUntil(this.destroy$));

//         // this.progressBarService.setTotalSteps(this.stepper._steps.length);

//         this.productFormGroup = fb.group<FormGroupType<IProductInformation>>({
//             productQualityComplaint: fb.control<boolean | null>(null, {
//                 nonNullable: true,
//                 validators: [Validators.requiredTrue]
//             }),

//             userType: fb.control<UserTypes>(UserTypes.Patient, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),

//             brand: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             lotNumber: fb.control<string>("", {})
//         });

//         this.initialReportingFormGroup = fb.group<
//             FormGroupType<IInitialReporting>
//         >({
//             userType: fb.control<UserTypes>(UserTypes.Patient, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),

//             permission: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             contactInformartion: fb.group<FormGroupType<IContactData>>({
//                 name: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 facilityName: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),

//                 phoneNumber: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),

//                 email: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 address: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 })
//             }),
//             product: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             })
//         });

//         this.complaintReportingFormGroup = fb.group<
//             FormGroupType<IComplaintReporting>
//         >({
//             userType: fb.control<UserTypes | null>(null, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             purchasedCountry: fb.control<Country | null>(null, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             formId: fb.control<string | null>(null, {
//                 validators: [Validators.required]
//             }),
//             brandId: fb.control<string | null>(null, {
//                 validators: [Validators.required]
//             }),
//             strength: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             returnOption: fb.control<ReturnOption | null>(null, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             hasBatchOrLotNumber: fb.control<boolean | null>(null, {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             batchOrLotNumber: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: []
//             }),
//             batchOrLotNumberUnavailableReason:
//                 fb.control<BatchOrLotNumberUnavailableReason | null>(null, {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//             gtin: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: []
//             }),
//             serial: fb.control<string>("", {
//                 nonNullable: true,
//                 validators: []
//             }),
//             hcp: fb.group<FormGroupType<IHcpData>>({
//                 reportedFromJNJProgram: fb.control<boolean | null>(null, {
//                     nonNullable: true,
//                     validators: []
//                 }),
//                 studyProgram: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: []
//                 }),
//                 siteNumber: fb.control<number | null>(null, {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 subjectNumber: fb.control<number | null>(null, {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 })
//             })
//             // issueDescription: fb.control<string>("", {
//             //     nonNullable: true,
//             //     validators: [Validators.required]
//             // }),
//             // uploadImage: fb.control<File[]>([], {
//             //     nonNullable: true,
//             //     validators: []
//             // })
//             // productImage: fb.control<string>("", { nonNullable: true, validators: [] }),
//         });

//         this.userDetailsFormGroup = fb.group<FormGroupType<IUserDetails>>({
//             patientInformation: fb.group<FormGroupType<IPatientInformation>>({
//                 permissionToContact: fb.control<ContactPermission | null>(
//                     null,
//                     {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     }
//                 ),
//                 patient: fb.group<FormGroupType<IPatientDetails>>({
//                     name: fb.group<FormGroupType<IPersonName>>({
//                         title: fb.control<Title | null>(null, {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         firstName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         lastName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         })
//                     }),
//                     contactInformation: fb.group<
//                         FormGroupType<IContactInformation>
//                     >({
//                         addressLine1: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         addressLine2: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         city: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         country: fb.control<Country | null>(null, {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         postalCode: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         state: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         telephone: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         emailAddress: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [
//                                 Validators.pattern(
//                                     "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                                 )
//                             ]
//                         })
//                     }),
//                     isProductAvailable: fb.control<boolean | null>(null, {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     }),
//                     // additionalContactInformation: fb.group<
//                     //     FormGroupType<IContactInformation>
//                     // >({
//                     //     addressLine1: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     addressLine2: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: []
//                     //     }),
//                     //     city: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     country: fb.control<Country | null>(null, {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     postalCode: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     state: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     telephone: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     emailAddress: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [
//                     //             Validators.required,
//                     //             Validators.pattern(
//                     //                 "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                     //             )
//                     //         ]
//                     //     })
//                     // }),
//                     dateOfBirth: fb.control<DateTime>(
//                         DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
//                         { nonNullable: true, validators: [] }
//                     ),
//                     ageAtComplaint: fb.control<string | null>(null, {
//                         nonNullable: true,
//                         validators: []
//                     })
//                 }),
//                 awareOfComplaint: fb.control<PhysicianAwareness | null>(null, {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 permissionToContactHCP: fb.control<ContactPermissionHCP | null>(
//                     null,
//                     {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     }
//                 )
//                 // hcp: fb.group<FormGroupType<IHCPDetails>>({
//                 //     name: fb.group<FormGroupType<IPersonName>>({
//                 //         title: fb.control<Title | null>(null, {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         firstName: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: [Validators.required]
//                 //         }),
//                 //         lastName: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: [Validators.required]
//                 //         })
//                 //     }),
//                 //     contactInformation: fb.group<
//                 //         FormGroupType<IContactInformation>
//                 //     >({
//                 //         addressLine1: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         addressLine2: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         city: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         country: fb.control<Country | null>(null, {
//                 //             nonNullable: true,
//                 //             validators: [Validators.required]
//                 //         }),
//                 //         postalCode: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         state: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         telephone: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: []
//                 //         }),
//                 //         emailAddress: fb.control<string>("", {
//                 //             nonNullable: true,
//                 //             validators: [
//                 //                 Validators.pattern(
//                 //                     "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                 //                 )
//                 //             ]
//                 //         })
//                 //     })
//                 // }),
//                 // patientMedicalHistory: fb.group<FormGroupType<IPatientMedicalHistory>>({
//                 //   medicalHistory: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   allergies: fb.control<AllergyStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   allergyDetails: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [],
//                 //   }),
//                 //   drugAbuse: fb.control<DrugAbuseStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   drugAbuseDetails: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [],
//                 //   }),
//                 //   alcoholConsumption: fb.control<AlcoholConsumptionStatus | null>(
//                 //     null,
//                 //     { nonNullable: true, validators: [Validators.required] }
//                 //   ),
//                 //   alcoholConsumptionDetails: fb.group<FormGroupType<Consumption>>({
//                 //     value: fb.control<string | null>(null, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //   }),
//                 //   smokingStatus: fb.control<SmokingStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   smokingDetails: fb.group<FormGroupType<Consumption>>({
//                 //     value: fb.control<string | null>(null, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //   }),
//                 // }),
//             }),

//             nonPatientInformation: fb.group<
//                 FormGroupType<INonPatientInformation>
//             >({
//                 permissionToContactReporter:
//                     fb.control<ContactPermissionReporter | null>(null, {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     }),
//                 patient: fb.group<FormGroupType<IPatientDetails>>({
//                     name: fb.group<FormGroupType<IPersonName>>({
//                         title: fb.control<Title | null>(null, {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         firstName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         lastName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         })
//                     }),
//                     contactInformation: fb.group<
//                         FormGroupType<IContactInformation>
//                     >({
//                         addressLine1: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         addressLine2: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         city: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         country: fb.control<Country | null>(null, {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         postalCode: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         state: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         telephone: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         emailAddress: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [
//                                 Validators.pattern(
//                                     "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                                 )
//                             ]
//                         })
//                     }),
//                     isProductAvailable: fb.control<boolean | null>(null, {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     }),
//                     // additionalContactInformation: fb.group<
//                     //     FormGroupType<IContactInformation>
//                     // >({
//                     //     addressLine1: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     addressLine2: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: []
//                     //     }),
//                     //     city: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     country: fb.control<Country | null>(null, {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     postalCode: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     state: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     telephone: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [Validators.required]
//                     //     }),
//                     //     emailAddress: fb.control<string>("", {
//                     //         nonNullable: true,
//                     //         validators: [
//                     //             Validators.required,
//                     //             Validators.pattern(
//                     //                 "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                     //             )
//                     //         ]
//                     //     })
//                     // }),
//                     dateOfBirth: fb.control<DateTime>(
//                         DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
//                         { nonNullable: true, validators: [] }
//                     ),
//                     ageAtComplaint: fb.control<string | null>(null, {
//                         nonNullable: true,
//                         validators: []
//                     })
//                 }),
//                 reporter: fb.group<FormGroupType<IReporterDetails>>({
//                     name: fb.group<FormGroupType<IPersonName>>({
//                         title: fb.control<Title | null>(null, {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         firstName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         lastName: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         })
//                     }),
//                     contactInformation: fb.group<
//                         FormGroupType<IContactInformation>
//                     >({
//                         addressLine1: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         addressLine2: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         city: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         country: fb.control<Country | null>(null, {
//                             nonNullable: true,
//                             validators: [Validators.required]
//                         }),
//                         postalCode: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         state: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         telephone: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: []
//                         }),
//                         emailAddress: fb.control<string>("", {
//                             nonNullable: true,
//                             validators: [
//                                 Validators.pattern(
//                                     "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
//                                 )
//                             ]
//                         })
//                     })
//                 }),
//                 facilityName: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 reporterAdministeredProduct:
//                     fb.control<ReporterAdministration | null>(null, {
//                         nonNullable: true,
//                         validators: [Validators.required]
//                     })
//                 // patientMedicalHistory: fb.group<FormGroupType<IPatientMedicalHistory>>({
//                 //   medicalHistory: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   allergies: fb.control<AllergyStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   allergyDetails: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [],
//                 //   }),
//                 //   drugAbuse: fb.control<DrugAbuseStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   drugAbuseDetails: fb.control<string>('', {
//                 //     nonNullable: true,
//                 //     validators: [],
//                 //   }),
//                 //   alcoholConsumption: fb.control<AlcoholConsumptionStatus | null>(
//                 //     null,
//                 //     { nonNullable: true, validators: [Validators.required] }
//                 //   ),
//                 //   alcoholConsumptionDetails: fb.group<FormGroupType<Consumption>>({
//                 //     value: fb.control<string | null>(null, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //   }),
//                 //   smokingStatus: fb.control<SmokingStatus | null>(null, {
//                 //     nonNullable: true,
//                 //     validators: [Validators.required],
//                 //   }),
//                 //   smokingDetails: fb.group<FormGroupType<Consumption>>({
//                 //     value: fb.control<string | null>(null, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //     unit: fb.control<ConsumptionUnit | null>(ConsumptionUnit.Month, {
//                 //       nonNullable: true,
//                 //       validators: [],
//                 //     }),
//                 //   }),
//                 // }),
//             })
//         });

//         // this.complaintDetailsFormGroup = fb.group<
//         //     FormGroupType<IComplaintDetails>
//         // >({
//         //     product: fb.group<FormGroupType<IProductDetails>>({
//         //         tookProductAsDirected: fb.control<string>("", {
//         //             nonNullable: true,
//         //             validators: [Validators.required]
//         //         }),
//         //         administeredBy: fb.control<AdministeredBy | null>(null, {
//         //             nonNullable: true,
//         //             validators: [Validators.required]
//         //         }),
//         //         concomitantMedication: fb.group<
//         //             FormGroupType<ConcomitantMedication>
//         //         >({
//         //             status: fb.control<ConcomitantMedicationStatus | null>(
//         //                 null,
//         //                 {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }
//         //             ),
//         //             details: fb.group<
//         //                 FormGroupType<ConcomitantMedicationDetails>
//         //             >({
//         //                 productName: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 formulation: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 indication: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 routeOfAdministration:
//         //                     this.fb.control<RouteOfAdministration | null>(
//         //                         null,
//         //                         {
//         //                             nonNullable: true,
//         //                             validators: [Validators.required]
//         //                         }
//         //                     ),
//         //                 startDate: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 endDate: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 dose: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 strength: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 frequency: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 frequencyTime: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 }),
//         //                 optionalImage: this.fb.control<string>("", {
//         //                     nonNullable: true,
//         //                     validators: [Validators.required]
//         //                 })
//         //             })
//         //         })
//         //     }),
//         //     reportedFromJNJProgram: fb.control<string>("", {
//         //         nonNullable: true,
//         //         validators: [Validators.required]
//         //     }),
//         //     studyProgram: fb.control<string>("", {
//         //         nonNullable: true,
//         //         validators: [Validators.required]
//         //     }),
//         //     siteNumber: fb.control<number | null>(null, {
//         //         nonNullable: true,
//         //         validators: [Validators.required]
//         //     }),
//         //     subjectNumber: fb.control<number | null>(null, {
//         //         nonNullable: true,
//         //         validators: [Validators.required]
//         //     }),
//         //     complaintDescription: fb.control<string>("", {
//         //         nonNullable: true,
//         //         validators: [Validators.required]
//         //     })
//         // });

//         const stateControl = fb.control<string>("", {
//             nonNullable: true,
//             validators: [Validators.required]
//         });

//         this.personalInformationFormGroup = fb.group<
//             FormGroupType<IPersonalInformation>
//         >({
//             personalData: fb.group<FormGroupType<IPersonalData>>({
//                 firstName: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 lastName: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),

//                 birthdate: fb.control<DateTime>(
//                     DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
//                     { nonNullable: true, validators: [Validators.required] }
//                 ),

//                 sex: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 pregnant: fb.control<string>("", {
//                     nonNullable: false,
//                     validators: []
//                 })
//             }),

//             physicalAddress: fb.group<FormGroupType<IAddress>>({
//                 streetAddress: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 streetAddress2: fb.control<string>("", {}),
//                 city: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 state: stateControl,
//                 zipPostal: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 })
//             })
//         });

//         this.stateGroupOptions$ = stateControl.valueChanges.pipe(
//             startWith(""),
//             map((value) => this._filterGroup(value || "")),
//             takeUntil(this.destroy$)
//         );

//         this.problemSummaryFormGroup = fb.group<FormGroupType<IProblemSummary>>(
//             {
//                 issueVerbatim: fb.control<string>("", {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//                 images: fb.control<File[]>([], { nonNullable: true })
//             }
//         );

//         this.problemDetailsQuestionsFormGroup = fb.record({});
//         this.problemDetailsFormGroup = fb.group<
//             FormGroupType<IProblemDetailsWithDone>
//         >({
//             done: fb.control<boolean>(false, {
//                 nonNullable: true,
//                 validators: [Validators.requiredTrue]
//             }),
//             questions: this.problemDetailsQuestionsFormGroup as any,
//             followUpOkay: fb.control<boolean>(false, { nonNullable: true })
//         });

//         this.problemDetailsQuestionsFormGroup.statusChanges
//             .pipe(
//                 filter((c) => c === "VALID"),
//                 takeUntil(this.destroy$)
//             )
//             .subscribe((status) => {
//                 this.getNextQuestions();
//             });

//         const formBrands$ = observeFormControlValue<string>(
//             this.initialReportingFormGroup.controls.product
//         ).pipe(
//             switchMap((form) =>
//                 productsApiService.filterBrands(
//                     makeApiType(ProductBrandsFilter, {
//                         formIds: form ? [form] : undefined
//                     })
//                 )
//             ),
//             takeUntil(this.destroy$)
//         );

//         this.filteredProductBrands$ = combineMapLatest({
//             brands: formBrands$,
//             brandAlphaFilter: this.brandAlphaFilter$
//         }).pipe(
//             map((c) => {
//                 let ret = c.brands;
//                 if (c.brandAlphaFilter) {
//                     ret = ret.filter((x) =>
//                         c.brandAlphaFilter?.matches(x.name)
//                     );
//                 }

//                 ret.sort((a, b) => a.name.localeCompare(b.name));

//                 return ret;
//             })
//         );

//         this.filteredProductForms$ = observeFormControlValue<string | null>(
//             this.selectedBrandControl
//         ).pipe(
//             switchMap((brandId) => {
//                 if (brandId) {
//                     return productsApiService.filterForms(
//                         makeApiType(ProductFormsFilter, {
//                             brandIds: brandId ? [brandId] : undefined
//                         })
//                     );
//                 } else {
//                     return this.allProductForms$;
//                 }
//             })
//         );

//         activedRoute.queryParamMap
//             .pipe(
//                 map(
//                     (c): IProductInformation => ({
//                         productQualityComplaint: null,
//                         userType: UserTypes.Patient,
//                         brand: c.get("product.brand") ?? "",
//                         lotNumber: c.get("product.lot") ?? ""
//                     })
//                 ),
//                 takeUntil(this.destroy$)
//             )
//             .subscribe((c) => {
//                 this.productFormGroup.setValue(c);
//             });

//         activedRoute.queryParamMap
//             .pipe(
//                 map(
//                     (c): IInitialReporting => ({
//                         userType: UserTypes.Patient,
//                         permission: c.get("report.permission") ?? "",
//                         contactInformartion: {
//                             name:
//                                 c.get("reportForm.contactInformartion?.name") ??
//                                 "",
//                             facilityName:
//                                 c.get(
//                                     "reportForm.contactInformartion?.facilityName"
//                                 ) ?? "",
//                             phoneNumber:
//                                 c.get(
//                                     "reportForm.contactInformartion?.phoneNumber"
//                                 ) ?? "",
//                             email:
//                                 c.get(
//                                     "reportForm.contactInformartion?.email"
//                                 ) ?? "",
//                             address:
//                                 c.get(
//                                     "reportForm.contactInformartion?.address"
//                                 ) ?? ""
//                         },
//                         product: c.get("report.product") ?? ""
//                     })
//                 ),
//                 takeUntil(this.destroy$)
//             )
//             .subscribe((c) => {
//                 this.initialReportingFormGroup.setValue(c);
//             });

//         // this.readyForMoreQuestions$
//         //     .pipe(
//         //         map((): IIQuestionsRequest => {
//         //             const product = this.productFormGroup.value;
//         //             const reportForm = this.initialReportingFormGroup.value;
//         //             const personalInformation =
//         //                 this.personalInformationFormGroup.value;
//         //             const problemSummary = this.problemSummaryFormGroup.value;
//         //             const problemDetails =
//         //                 this.problemDetailsQuestionsFormGroup.value;

//         //             const answeredQuestions: IQuestionsRequestAnswer[] = [];
//         //             for (const question of this.problemDetailsQuestions) {
//         //                 const response = problemDetails[question.id];
//         //                 answeredQuestions.push({
//         //                     questionId: question.id,
//         //                     response
//         //                 });
//         //             }

//         //             return {
//         //                 product: {
//         //                     productQualityComplaint:
//         //                         product.productQualityComplaint ?? null,
//         //                     userType: product.userType!,
//         //                     brand: product.brand!,
//         //                     lotNumber: product.lotNumber ?? null
//         //                 },
//         //                 report: {
//         //                     userType: reportForm.userType!,
//         //                     permission: reportForm.permission!,
//         //                     contactInformartion: {
//         //                         name: reportForm.contactInformartion?.name!,
//         //                         facilityName:
//         //                             reportForm.contactInformartion
//         //                                 ?.facilityName!,
//         //                         phoneNumber:
//         //                             reportForm.contactInformartion
//         //                                 ?.phoneNumber!,
//         //                         email: reportForm.contactInformartion?.email!,
//         //                         address:
//         //                             reportForm.contactInformartion?.address!
//         //                     },
//         //                     product: reportForm.product! ?? null
//         //                 },
//         //                 userType: reportForm.userType!,
//         //                 verbatim: problemSummary.issueVerbatim!,
//         //                 answeredQuestions
//         //             };
//         //         }),
//         //         switchMap((c) => this.questionsService.getNextQuestions(c)),
//         //         takeUntil(this.destroy$)
//         //     )
//         //     .subscribe((resp) => {
//         //         if (resp.done) {
//         //             this.problemDetailsFormGroup.controls.done.setValue(true);
//         //             return;
//         //         }

//         //         this.problemDetailsFormGroup.controls.done.setValue(false);

//         //         const problemDetailsQuestions = [
//         //             ...this.problemDetailsQuestions
//         //         ];

//         //         for (const question of resp.questions) {
//         //             const validators: ValidatorFn[] = [];
//         //             if (question.required) {
//         //                 validators.push(Validators.required);
//         //             }

//         //             this.problemDetailsQuestionsFormGroup.addControl(
//         //                 question.id,
//         //                 fb.control<string>("", { validators })
//         //             );
//         //             problemDetailsQuestions.push(question);
//         //         }

//         //         this.problemDetailsQuestions = problemDetailsQuestions;
//         //     });

//         if (environment.token) {
//             this.authorized$ = activedRoute.queryParamMap.pipe(
//                 map((c) => c.get("token")),
//                 map((c) => c === environment.token)
//             );
//         } else {
//             this.authorized$ = of(true);
//         }

//         this.imageHotspotValues = [
//             {
//                 id: "simponi_device_failure_location",
//                 type: "image-map",
//                 required: true,
//                 questionText: "",
//                 imageUrl:
//                     "https://www.simponihcp.com/sites/www.simponihcp.com/files/injection_experience_autoinjector_desktop_1.png",
//                 areas: [
//                     {
//                         value: "Hidden Needle",

//                         x: 394,
//                         y: 283,
//                         radius: 22,

//                         nextQuestionId: "needle_damage_type"
//                     },
//                     {
//                         value: "Safety Sleeve",

//                         x: 440,
//                         y: 253,
//                         radius: 22,

//                         nextQuestionId: "who_administered"
//                     },
//                     {
//                         value: "Tamper-Evident Seal",

//                         x: 545,
//                         y: 317,
//                         radius: 22,

//                         nextQuestionId: "who_administered"
//                     },
//                     {
//                         value: "Large Viewing Window",

//                         x: 625,
//                         y: 250,
//                         radius: 22,

//                         nextQuestionId: "who_administered"
//                     },
//                     {
//                         value: "Activation Button",

//                         x: 750,
//                         y: 236,
//                         radius: 22,

//                         nextQuestionId: "button_stuck"
//                     },
//                     {
//                         value: "Easy-to-Grip Shape",

//                         x: 927,
//                         y: 300,
//                         radius: 22,

//                         nextQuestionId: "who_administered"
//                     },
//                     {
//                         value: "Expiration Date",

//                         x: 1055,
//                         y: 328,
//                         radius: 22,

//                         nextQuestionId: "who_administered"
//                     }
//                 ]
//             }
//         ];
//     }

//     set brandFilter(filter: ILetterRange | null) {
//         this.brandAlphaFilter$.next(filter);
//     }
//     get brandFilter() {
//         return this.brandAlphaFilter$.value;
//     }

//     onStepSelectionChange(event: StepperSelectionEvent) {
//         const selectedStep = event.selectedIndex;
//         const totalSteps = this.stepper._steps.length;
//         const newProgressValue = ((selectedStep + 1) / totalSteps) * 100;

//         this.progressBarService.setProgressValue(newProgressValue);
//     }

//     ngOnInit() {
//         const patientContactInfo = this.userDetailsFormGroup.get(
//             "patientInformation.patient.contactInformation"
//         );
//         const patientReporterContactInfo = this.userDetailsFormGroup.get(
//             "nonPatientInformation.patient.contactInformation"
//         );

//         if (this.complaintReportingFormGroup.controls?.["purchasedCountry"]) {
//             this.countriesList = this.complaintReportingFormGroup.controls?.[
//                 "purchasedCountry"
//             ].valueChanges.pipe(
//                 startWith(""),
//                 map((value) => this._filter(value || ""))
//             );
//         } else if (patientContactInfo?.get("country")) {
//             this.countriesList = patientContactInfo
//                 ?.get("country")
//                 ?.valueChanges.pipe(
//                     startWith(""),
//                     map((value) => this._filter(value || ""))
//                 );
//         } else if (patientReporterContactInfo?.get("country")) {
//             this.countriesList = patientReporterContactInfo
//                 ?.get("country")
//                 ?.valueChanges.pipe(
//                     startWith(""),
//                     map((value) => this._filter(value || ""))
//                 );
//         }
//     }

//     ngAfterViewInit(): void {
//         this.complaintReportingFormGroup.controls.formId.valueChanges
//             .pipe(filterTruthy(), takeUntil(this.destroy$))
//             .subscribe(() => {
//                 this.scrollToItemSection();
//             });

//         this.complaintReportingFormGroup.controls.brandId.valueChanges
//             .pipe(filterTruthy(), takeUntil(this.destroy$))
//             .subscribe(() => {
//                 this.scrollToStrengthSection();
//             });
//     }

//     onPatientRadioChange(value: boolean) {
//         const patientContactInfo = this.userDetailsFormGroup.get(
//             "patientInformation.patient.contactInformation"
//         );
//         const contactFields = [
//             "addressLine1",
//             "city",
//             "postalCode",
//             "state",
//             "telephone",
//             "emailAddress"
//         ];

//         contactFields.forEach((contact) => {
//             const control = patientContactInfo?.get(contact);
//             if (control) {
//                 control.setValidators(value ? [Validators.required] : []);
//                 control.updateValueAndValidity();
//             }
//         });
//     }

//     handleBatchLotNumberChange(value: boolean) {
//         const batchLotNumber =
//             this.complaintReportingFormGroup.get("batchLotNumber");
//         const noReason = this.complaintReportingFormGroup?.get("noReason");

//         if (!batchLotNumber) {
//             return;
//         }

//         if (!noReason) {
//             return;
//         }

//         if (value) {
//             this.clearValidatorsAndSetValue(noReason);
//             this.setRequiredValidator(batchLotNumber);
//         } else {
//             this.clearValidatorsAndSetValue(batchLotNumber);
//             this.setRequiredValidator(noReason);
//         }

//         this.updateFormControlValidity(batchLotNumber);
//         this.updateFormControlValidity(noReason);
//     }

//     onNonPatientReporterRadioChange(value: boolean) {
//         const patientReporterContactInfo = this.userDetailsFormGroup.get(
//             "nonPatientInformation.patient.contactInformation"
//         );
//         const contactFields = [
//             "addressLine1",
//             "city",
//             "postalCode",
//             "state",
//             "telephone",
//             "emailAddress"
//         ];

//         contactFields.forEach((contact) => {
//             const control = patientReporterContactInfo?.get(contact);
//             if (control) {
//                 control.setValidators(value ? [Validators.required] : []);
//                 control.updateValueAndValidity();
//             }
//         });
//     }

//     setRequiredValidator(control: AbstractControl) {
//         control?.setValidators(Validators.required);
//     }

//     clearValidatorsAndSetValue(control: AbstractControl) {
//         control?.setValue("");
//         control?.clearValidators();
//     }

//     updateFormControlValidity(control: AbstractControl) {
//         control?.updateValueAndValidity();
//     }

//     onUserTypeChange(value: string) {
//         if (value === UserTypes.HealthcareProfessional) {
//             this.initializeHcpFormGroup();
//         } else {
//             this.clearHcpFormGroup();
//         }
//         this.hcpFormGroup.updateValueAndValidity();
//     }

//     addConcomitantProductDetails() {
//         const cc = {
//             productName: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             formulation: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             indication: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             routeOfAdministration:
//                 this.fb.control<RouteOfAdministration | null>(null, {
//                     nonNullable: true,
//                     validators: [Validators.required]
//                 }),
//             startDate: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             endDate: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             dose: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             strength: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             frequency: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             frequencyTime: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             }),
//             optionalImage: this.fb.control<string>("", {
//                 nonNullable: true,
//                 validators: [Validators.required]
//             })
//         };
//         // this.complaintDetailsFormGroup.
//     }

//     addConcomitantProduct() {
//         this.showConcomitantProductDetails = true;
//     }

//     deleteConcomitantProduct() {
//         this.showConcomitantProductDetails = false;
//     }

//     onTabsChange() {
//         this.complaintReportingFormGroup.controls.formId.setValue(null);
//     }

//     onProductSelectionChange(index: number): void {
//         this.selectedBrandControl.setValue(null);
//         this.showAllProducts = false;
//     }

//     toggleProducts() {
//         this.showAllProducts = !this.showAllProducts;
//     }

//     // get concomitantProductDetails(): FormArray {
//     //   return this.complaintDetailsFormGroup.get('product.concomitantMedication.details') as FormArray;
//     // }

//     get hcpFormGroup() {
//         return this.complaintReportingFormGroup.get("hcp") as FormGroup;
//     }

//     get formControls(): { label: string; value: string }[] {
//         const controls = this.complaintReportingFormGroup.controls;
//         const entries = Object.keys(controls).map((key) => {
//             const control: AbstractControl =
//                 this.complaintReportingFormGroup.get(key) as AbstractControl;
//             let value: string;

//             if (Array.isArray(control.value)) {
//                 value = control.value.join(", ");
//             } else if (
//                 typeof control.value === "object" &&
//                 control.value !== null
//             ) {
//                 value = this.formatObjectValue(control.value);
//             } else if (control.value !== null) {
//                 value = control.value.toString();
//             } else {
//                 return null;
//             }
//             return {
//                 label: key,
//                 value: value
//             };
//         });
//         return entries.filter((entry) => entry !== null) as {
//             label: string;
//             value: string;
//         }[];
//     }

//     get selectedFormControl() {
//         return this.complaintReportingFormGroup.controls.formId;
//     }

//     get selectedBrandControl() {
//         return this.complaintReportingFormGroup.controls.brandId;
//     }

//     get productQualityComplaint() {
//         return this.productFormGroup.controls.productQualityComplaint.value;
//     }

//     ngOnDestroy() {
//         this.destroy$.next();
//         this.destroy$.complete();
//     }

//     nextStep() {
//         // const selectedReportType =
//         //   this.complaintReportingFormGroup.controls.complaintReportType.value;
//         // if (selectedReportType?.includes(this.ComplaintReportTypes.AdverseEvent)) {
//         //   this.showMedicalHistory = true;
//         // } else {
//         //   this.showMedicalHistory = false;
//         // }
//         // this.stepper.next();
//     }

//     resetProblemDetails() {
//         this.onProblemSummarySubmitted();
//     }

//     onProblemSummarySubmitted() {
//         for (const k in this.problemDetailsQuestionsFormGroup.controls) {
//             if (
//                 !Object.prototype.hasOwnProperty.call(
//                     this.problemDetailsQuestionsFormGroup.controls,
//                     k
//                 )
//             ) {
//                 continue;
//             }

//             this.problemDetailsQuestionsFormGroup.removeControl(k);
//         }

//         this.problemDetailsQuestions = [];

//         this.getNextQuestions();
//     }

//     isExpansionStepInvalid(
//         currentStep: number | null,
//         step: number,
//         formGroup: AbstractControl
//     ) {
//         if (formGroup.valid || currentStep === step) {
//             return false;
//         }

//         if (currentStep === null) {
//             return true;
//         }

//         if (currentStep < step) {
//             return formGroup.dirty;
//         }

//         return true;
//     }

//     showLotNumberHelp() {
//         this.bottomSheet.open(LotNumberHelpBottomSheetComponent);
//     }

//     submitComplaint(): void {
//         this.complaintSubmitted = true;
//     }

//     private _filter(value: string): string[] {
//         const filterValue = value.toLowerCase();

//         return this.countries.filter((country) =>
//             country.toLowerCase().includes(filterValue)
//         );
//     }

//     private scrollToItemSection(): void {
//         // this.brandsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
//     }

//     private scrollToStrengthSection(): void {
//         setTimeout(() => {
//             if (!this.strengthSection) {
//                 return;
//             }
//             this.strengthSection.nativeElement.scrollIntoView({
//                 behavior: "smooth"
//             });
//         }, 100);
//     }

//     private initializeHcpFormGroup() {
//         const reportedFromJNJProgramControl = this.hcpFormGroup.get(
//             "reportedFromJNJProgram"
//         );
//         const studyProgramControl = this.hcpFormGroup.get("studyProgram");
//         const siteNumberControl = this.hcpFormGroup.get("siteNumber");
//         const subjectNumberControl = this.hcpFormGroup.get("subjectNumber");

//         reportedFromJNJProgramControl?.setValidators([Validators.required]);

//         reportedFromJNJProgramControl?.valueChanges
//             .pipe(takeUntil(this.destroy$))
//             .subscribe((value) => {
//                 if (value) {
//                     studyProgramControl?.setValidators([Validators.required]);
//                     siteNumberControl?.setValidators([Validators.required]);
//                     subjectNumberControl?.setValidators([Validators.required]);
//                 } else {
//                     studyProgramControl?.updateValueAndValidity();
//                     siteNumberControl?.updateValueAndValidity();
//                     subjectNumberControl?.updateValueAndValidity();
//                 }
//             });
//         reportedFromJNJProgramControl?.updateValueAndValidity();
//     }

//     private clearHcpFormGroup() {
//         this.hcpFormGroup.clearValidators();
//     }

//     private formatObjectValue(obj: any): string {
//         const properties = Object.keys(obj).map(
//             (prop) => `${prop}: ${obj[prop]}`
//         );
//         return properties.join(", ");
//     }

//     private _filterGroup(value: string): StateGroup[] {
//         if (value) {
//             return this.stateGroups
//                 .map((group) => ({
//                     letter: group.letter,
//                     names: _filter(group.names, value)
//                 }))
//                 .filter((group) => group.names.length > 0);
//         }

//         return this.stateGroups;
//     }

//     private getNextQuestions() {
//         // this.readyForMoreQuestions$.next();
//     }
// }
