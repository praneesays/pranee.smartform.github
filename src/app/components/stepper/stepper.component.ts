import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormRecord,
    ValidatorFn,
    Validators
} from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute } from "@angular/router";
import { DateTime } from "luxon";
import {
    filter,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap,
    takeUntil
} from "rxjs";
import { environment } from "src/environments/environment";
import { Question } from "../../questions";
import {
    IQuestionsRequest,
    IQuestionsRequestAnswer,
    QuestionsService
} from "../../services/questions.service";
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
    INonPatientInformation,
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
    IPersonName
} from "../../types";
import { ProgressBarService } from "src/app/services/progress-bar.service";
import { StepperSelectionEvent } from "@angular/cdk/stepper";

export type FormGroupType<T> = {
    [k in keyof T]: T[k] extends
        | string
        | DateTime
        | boolean
        | number
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
        name: "One-Press Device",
        type: ProductTypes.OnePressDevice,
        imagePath: "./assets/products/onepressdevice.png",
        brands: [{ name: "Tremfya", imagePath: "./assets/brands/Tremfya.png" }]
    },
    {
        name: "Prefilled Syringe",
        type: ProductTypes.PrefilledSyringe,
        imagePath: "./assets/products/prefilledsyringe.png",
        brands: [
            { name: "Stelara", imagePath: "./assets/brands/Stelara.png" },
            { name: "Tremfya", imagePath: "./assets/brands/Tremfya.png" },
            { name: "Invega", imagePath: "./assets/brands/Invega.png" }
        ]
    },
    {
        name: "Autoinjector",
        type: ProductTypes.Autoinjector,
        imagePath: "./assets/products/autoinjector.png",
        brands: [{ name: "Simponi", imagePath: "./assets/brands/Simponi.png" }]
    },
    {
        name: "Spray",
        type: ProductTypes.Spray,
        imagePath: "./assets/products/spray.png",
        brands: [
            { name: "Spravato", imagePath: "./assets/brands/Spravato.png" }
        ]
    },
    {
        name: "Tablet",
        type: ProductTypes.Tablet,
        imagePath: "./assets/products/tablet.png",
        brands: [
            { name: "Symtuza", imagePath: "./assets/brands/Symtuza.png" },
            { name: "Erleada", imagePath: "./assets/brands/Erleada.png" },
            { name: "Opsynvi", imagePath: "./assets/brands/Opsynvi.png" },
            { name: "Xarelto", imagePath: "./assets/brands/Xarelto.png" },
            { name: "Balversa", imagePath: "./assets/brands/Balversa.png" },
            {
                name: "RisperdalConsta",
                imagePath: "./assets/brands/RisperdalConsta.png"
            },
            { name: "Imbruvica", imagePath: "./assets/brands/Imbruvica.png" },
            { name: "Uptravi", imagePath: "./assets/brands/Uptravi.png" }
        ]
    },
    {
        name: "Vial",
        type: ProductTypes.Vial,
        imagePath: "./assets/products/vial.png",
        brands: [
            { name: "Velcade", imagePath: "./assets/brands/Velcade.png" },
            { name: "Remicade", imagePath: "./assets/brands/Remicade.png" },
            { name: "Darzalex", imagePath: "./assets/brands/Darzalex.png" },
            { name: "Simponi", imagePath: "./assets/brands/Simponi.png" },
            { name: "Uptravi", imagePath: "./assets/brands/Uptravi.png" },
            { name: "Ponvory", imagePath: "./assets/brands/Ponvory.png" },
            { name: "Stelara", imagePath: "./assets/brands/Stelara.png" },
            { name: "Tecvayli", imagePath: "./assets/brands/Tecvayli.png" },
            { name: "Rybrevant", imagePath: "./assets/brands/Rybrevant.png" }
        ]
    },
    {
        name: "Injection Kit",
        type: ProductTypes.InjectionKit,
        imagePath: "./assets/products/injectionkit.png",
        brands: [
            {
                name: "RisperdalConsta",
                imagePath: "./assets/brands/RisperdalConsta.png"
            }
        ]
    },
    {
        name: "Cream",
        type: ProductTypes.Cream,
        imagePath: "./assets/products/cream.png",
        brands: [
            { name: "Daktarin", imagePath: "./assets/brands/Daktarin.png" },
            { name: "Nizoral", imagePath: "./assets/brands/Nizoral.png" },
            { name: "Daktacort", imagePath: "./assets/brands/Daktacort.png" }
        ]
    },
    {
        name: "Patch",
        type: ProductTypes.Patch,
        imagePath: "./assets/products/patch.png",
        brands: [{ name: "Evra", imagePath: "./assets/brands/Evra.png" }]
    },
    {
        name: "Ampule",
        type: ProductTypes.Ampule,
        imagePath: "./assets/products/ampule.png",
        brands: [
            { name: "Daktarin", imagePath: "./assets/brands/Daktarin.png" }
        ]
    },
    {
        name: "Other",
        type: ProductTypes.Other,
        imagePath: "./assets/products/other.png",
        brands: [
            { name: "Carvykti", imagePath: "./assets/brands/Carvykti.png" },
            { name: "Cabenuva", imagePath: "./assets/brands/Cabenuva.png" },
            { name: "Akeega", imagePath: "./assets/brands/Akeega.png" }
        ]
    },
    {
        name: "Unknown",
        type: ProductTypes.Unknown,
        imagePath: "./assets/products/unknown.png",
        brands: [
            { name: "Tremfya", imagePath: "./assets/brands/Tremfya.png" },
            { name: "Stelara", imagePath: "./assets/brands/Stelara.png" },
            { name: "Invega", imagePath: "./assets/brands/Invega.png" },
            { name: "Simponi", imagePath: "./assets/brands/Simponi.png" },
            { name: "Spravato", imagePath: "./assets/brands/Spravato.png" },
            { name: "Symtuza", imagePath: "./assets/brands/Symtuza.png" },
            { name: "Erleada", imagePath: "./assets/brands/Erleada.png" },
            { name: "Opsynvi", imagePath: "./assets/brands/Opsynvi.png" },
            { name: "Xarelto", imagePath: "./assets/brands/Xarelto.png" },
            { name: "Balversa", imagePath: "./assets/brands/Balversa.png" },
            {
                name: "RisperdalConsta",
                imagePath: "./assets/brands/RisperdalConsta.png"
            },
            { name: "Imbruvica", imagePath: "./assets/brands/Imbruvica.png" },
            { name: "Uptravi", imagePath: "./assets/brands/Uptravi.png" },
            { name: "Velcade", imagePath: "./assets/brands/Velcade.png" },
            { name: "Remicade", imagePath: "./assets/brands/Remicade.png" },
            { name: "Darzalex", imagePath: "./assets/brands/Darzalex.png" },
            { name: "Ponvory", imagePath: "./assets/brands/Ponvory.png" },
            { name: "Tecvayli", imagePath: "./assets/brands/Tecvayli.png" },
            { name: "Rybrevant", imagePath: "./assets/brands/Rybrevant.png" },
            { name: "Daktarin", imagePath: "./assets/brands/Daktarin.png" },
            { name: "Nizoral", imagePath: "./assets/brands/Nizoral.png" },
            { name: "Daktacort", imagePath: "./assets/brands/Daktacort.png" },
            { name: "Evra", imagePath: "./assets/brands/Evra.png" },
            { name: "Carvykti", imagePath: "./assets/brands/Carvykti.png" },
            { name: "Cabenuva", imagePath: "./assets/brands/Cabenuva.png" },
            { name: "Akeega", imagePath: "./assets/brands/Akeega.png" }
        ]
    }
];

@Component({
    selector: "app-stepper",
    templateUrl: "./stepper.component.html",
    styleUrls: ["./stepper.component.scss"]
})
export class StepperComponent implements OnDestroy, OnInit, AfterViewInit {
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
    readonly userDetailsFormGroupBackup: IUserDetails;

    readonly patientInformationFormGroup: FormGroup<
        FormGroupType<IPatientInformation>
    >;

    readonly nonPatientInformationFormGroup: FormGroup<
        FormGroupType<INonPatientInformation>
    >;

    readonly nameInformationFormGroup: FormGroup<FormGroupType<IPersonName>>;
    readonly contactInformationFormGroup: FormGroup<
        FormGroupType<IContactInformation>
    >;

    readonly complaintDetailsFormGroup: FormGroup<
        FormGroupType<IComplaintDetails>
    >;

    readonly stateGroupOptions$: Observable<StateGroup[]>;

    readonly stateGroups: StateGroup[] = [
        {
            letter: "A",
            names: ["Alabama", "Alaska", "Arizona", "Arkansas"]
        },
        {
            letter: "C",
            names: ["California", "Colorado", "Connecticut"]
        },
        {
            letter: "D",
            names: ["Delaware"]
        },
        {
            letter: "F",
            names: ["Florida"]
        },
        {
            letter: "G",
            names: ["Georgia"]
        },
        {
            letter: "H",
            names: ["Hawaii"]
        },
        {
            letter: "I",
            names: ["Idaho", "Illinois", "Indiana", "Iowa"]
        },
        {
            letter: "K",
            names: ["Kansas", "Kentucky"]
        },
        {
            letter: "L",
            names: ["Louisiana"]
        },
        {
            letter: "M",
            names: [
                "Maine",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana"
            ]
        },
        {
            letter: "N",
            names: [
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota"
            ]
        },
        {
            letter: "O",
            names: ["Ohio", "Oklahoma", "Oregon"]
        },
        {
            letter: "P",
            names: ["Pennsylvania"]
        },
        {
            letter: "R",
            names: ["Rhode Island"]
        },
        {
            letter: "S",
            names: ["South Carolina", "South Dakota"]
        },
        {
            letter: "T",
            names: ["Tennessee", "Texas"]
        },
        {
            letter: "U",
            names: ["Utah"]
        },
        {
            letter: "V",
            names: ["Vermont", "Virginia"]
        },
        {
            letter: "W",
            names: ["Washington", "West Virginia", "Wisconsin", "Wyoming"]
        }
    ];

    readonly complaintType = [
        {
            name: "Product Quality Complaint",
            definition:
                "Concerns about the quality, safety, or effectiveness of a drug product",
            value: this.ComplaintReportTypes.ProductQualityComplaint
        },
        {
            name: "Adverse Event",
            definition:
                "Medical Concern- If this issue affected person's health then select Adverse Event",
            value: this.ComplaintReportTypes.AdverseEvent
        },
        {
            name: "Product Information",
            definition:
                "Comprehensive details and specifications about a particular product",
            value: this.ComplaintReportTypes.ProductInformation
        }
    ];

    countriesList?: Observable<string[]>;

    personalInformationStep: number | null = 0;

    showMedicalHistory: boolean = false;

    selectedValues: string[] = [];

    products: Product[] = products;

    showConcomitantProductDetails = false;

    activeStepIndex: number = 0;

    @ViewChild("brandsSection") brandsSection!: ElementRef;
    @ViewChild("strengthSection") strengthSection?: ElementRef;
    @ViewChild(MatStepper) stepper!: MatStepper;

    showAllProducts: boolean = true;
    selectedProductIndex: number = -1;

    filteredProducts: Product[] = products;

    filteredBrands: Brand[] = [];
    selectedBrand: string = "";

    // totalSteps = this.stepper._steps.length;

    private readonly destroy$ = new Subject<void>();
    private readonly readyForMoreQuestions$ = new Subject<void>();

    constructor(
        private readonly questionsService: QuestionsService,
        private readonly progressBarService: ProgressBarService,
        private readonly fb: FormBuilder,
        activedRoute: ActivatedRoute
    ) {
        this.productFormGroup = fb.group<FormGroupType<IProductInformation>>({
            productQualityComplaint: fb.control<boolean | null>(null, {
                nonNullable: true,
                validators: [Validators.requiredTrue]
            }),

            userType: fb.control<UserTypes>(UserTypes.Patient, {
                nonNullable: true,
                validators: [Validators.required]
            }),

            brand: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            lotNumber: fb.control<string>("", {})
        });

        this.initialReportingFormGroup = fb.group<
            FormGroupType<IInitialReporting>
        >({
            userType: fb.control<UserTypes>(UserTypes.Patient, {
                nonNullable: true,
                validators: [Validators.required]
            }),

            permission: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            contactInformartion: fb.group<FormGroupType<IContactData>>({
                name: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                facilityName: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),

                phoneNumber: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),

                email: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                address: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                })
            }),
            product: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            })
        });

        this.nameInformationFormGroup = fb.group<FormGroupType<IPersonName>>({
            title: fb.control<Title | null>(null, {
                nonNullable: true,
                validators: []
            }),
            firstName: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            lastName: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            })
        });

        this.contactInformationFormGroup = fb.group<
            FormGroupType<IContactInformation>
        >({
            addressLine1: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            addressLine2: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            city: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            country: fb.control<Country | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            postalCode: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            state: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            telephone: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            emailAddress: fb.control<string>("", {
                nonNullable: true,
                validators: [
                    Validators.pattern(
                        "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
                    )
                ]
            })
        });

        this.complaintReportingFormGroup = fb.group<
            FormGroupType<IComplaintReporting>
        >({
            userType: fb.control<UserTypes | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            purchasedCountry: fb.control<Country | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            product: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            brand: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            strength: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            returnOption: fb.control<ReturnOption | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            hasBatchLotNumber: fb.control<boolean | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            batchLotNumber: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            noReason: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            gtin: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            serial: fb.control<string>("", {
                nonNullable: true,
                validators: []
            }),
            hcp: fb.group<FormGroupType<IHcpData>>({
                reportedFromJNJProgram: fb.control<boolean | null>(null, {
                    nonNullable: true,
                    validators: []
                }),
                studyProgram: fb.control<string>("", {
                    nonNullable: true,
                    validators: []
                }),
                siteNumber: fb.control<number | null>(null, {
                    nonNullable: true,
                    validators: []
                }),
                subjectNumber: fb.control<number | null>(null, {
                    nonNullable: true,
                    validators: []
                })
            }),
            issueDescription: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            uploadImage: fb.control<File[]>([], {
                nonNullable: true,
                validators: []
            })
            // productImage: fb.control<string>("", { nonNullable: true, validators: [] }),
        });

        this.patientInformationFormGroup = fb.group<
            FormGroupType<IPatientInformation>
        >({
            permissionToContact: fb.control<ContactPermission | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            patient: fb.group<FormGroupType<IPatientDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup,
                isProductAvailable: fb.control<boolean | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                additionalContactInformation: this.contactInformationFormGroup,
                dateOfBirth: fb.control<DateTime>(
                    DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                    { nonNullable: true, validators: [] }
                ),
                ageAtComplaint: fb.control<string | null>(null, {
                    nonNullable: true,
                    validators: []
                })
            }),
            awareOfComplaint: fb.control<PhysicianAwareness | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            permissionToContactHCP: fb.control<ContactPermissionHCP | null>(
                null,
                {
                    nonNullable: true,
                    validators: [Validators.required]
                }
            ),
            hcp: fb.group<FormGroupType<IHCPDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup
            })
        });

        this.nonPatientInformationFormGroup = fb.group<
            FormGroupType<INonPatientInformation>
        >({
            permissionToContactReporter:
                fb.control<ContactPermissionReporter | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
            patient: fb.group<FormGroupType<IPatientDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup,
                isProductAvailable: fb.control<boolean | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                additionalContactInformation: this.contactInformationFormGroup,
                // additionalContactInformation: fb.group<
                //     FormGroupType<IContactInformation>
                // >({
                //     addressLine1: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     addressLine2: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: []
                //     }),
                //     city: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     country: fb.control<Country | null>(null, {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     postalCode: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     state: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     telephone: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     emailAddress: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [
                //             Validators.required,
                //             Validators.pattern(
                //                 "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
                //             )
                //         ]
                //     })
                // }),
                dateOfBirth: fb.control<DateTime>(
                    DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                    { nonNullable: true, validators: [] }
                ),
                ageAtComplaint: fb.control<string | null>(null, {
                    nonNullable: true,
                    validators: []
                })
            }),
            reporter: fb.group<FormGroupType<IReporterDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup
            }),
            facilityName: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            reporterAdministeredProduct:
                fb.control<ReporterAdministration | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                })
        });

        this.userDetailsFormGroup = fb.group<FormGroupType<IUserDetails>>({
            patientInformation: this.patientInformationFormGroup,

            nonPatientInformation: this.nonPatientInformationFormGroup
        });

        this.userDetailsFormGroupBackup = JSON.parse(
            JSON.stringify(this.userDetailsFormGroup.value)
        );

        this.complaintDetailsFormGroup = fb.group<
            FormGroupType<IComplaintDetails>
        >({
            product: fb.group<FormGroupType<IProductDetails>>({
                tookProductAsDirected: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                administeredBy: fb.control<AdministeredBy | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                concomitantMedication: fb.group<
                    FormGroupType<ConcomitantMedication>
                >({
                    status: fb.control<ConcomitantMedicationStatus | null>(
                        null,
                        {
                            nonNullable: true,
                            validators: [Validators.required]
                        }
                    ),
                    details: fb.group<
                        FormGroupType<ConcomitantMedicationDetails>
                    >({
                        productName: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        formulation: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        indication: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        routeOfAdministration:
                            this.fb.control<RouteOfAdministration | null>(
                                null,
                                {
                                    nonNullable: true,
                                    validators: [Validators.required]
                                }
                            ),
                        startDate: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        endDate: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        dose: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        strength: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        frequency: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        frequencyTime: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        }),
                        optionalImage: this.fb.control<string>("", {
                            nonNullable: true,
                            validators: [Validators.required]
                        })
                    })
                })
            }),
            reportedFromJNJProgram: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            studyProgram: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            siteNumber: fb.control<number | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            subjectNumber: fb.control<number | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            complaintDescription: fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            })
        });

        const stateControl = fb.control<string>("", {
            nonNullable: true,
            validators: [Validators.required]
        });

        this.personalInformationFormGroup = fb.group<
            FormGroupType<IPersonalInformation>
        >({
            personalData: fb.group<FormGroupType<IPersonalData>>({
                firstName: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                lastName: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),

                birthdate: fb.control<DateTime>(
                    DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                    { nonNullable: true, validators: [Validators.required] }
                ),

                sex: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                pregnant: fb.control<string>("", {
                    nonNullable: false,
                    validators: []
                })
            }),

            physicalAddress: fb.group<FormGroupType<IAddress>>({
                streetAddress: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                streetAddress2: fb.control<string>("", {}),
                city: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                state: stateControl,
                zipPostal: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                })
            })
        });

        this.stateGroupOptions$ = stateControl.valueChanges.pipe(
            startWith(""),
            map((value) => this._filterGroup(value || "")),
            takeUntil(this.destroy$)
        );

        this.problemSummaryFormGroup = fb.group<FormGroupType<IProblemSummary>>(
            {
                issueVerbatim: fb.control<string>("", {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                images: fb.control<File[]>([], { nonNullable: true })
            }
        );

        this.problemDetailsQuestionsFormGroup = fb.record({});
        this.problemDetailsFormGroup = fb.group<
            FormGroupType<IProblemDetailsWithDone>
        >({
            done: fb.control<boolean>(false, {
                nonNullable: true,
                validators: [Validators.requiredTrue]
            }),
            questions: this.problemDetailsQuestionsFormGroup as any,
            followUpOkay: fb.control<boolean>(false, { nonNullable: true })
        });

        this.problemDetailsQuestionsFormGroup.statusChanges
            .pipe(
                filter((c) => c === "VALID"),
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
                        brand: c.get("product.brand") ?? "",
                        lotNumber: c.get("product.lot") ?? ""
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
                        permission: c.get("report.permission") ?? "",
                        contactInformartion: {
                            name:
                                c.get("reportForm.contactInformartion?.name") ??
                                "",
                            facilityName:
                                c.get(
                                    "reportForm.contactInformartion?.facilityName"
                                ) ?? "",
                            phoneNumber:
                                c.get(
                                    "reportForm.contactInformartion?.phoneNumber"
                                ) ?? "",
                            email:
                                c.get(
                                    "reportForm.contactInformartion?.email"
                                ) ?? "",
                            address:
                                c.get(
                                    "reportForm.contactInformartion?.address"
                                ) ?? ""
                        },
                        product: c.get("report.product") ?? ""
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
                    const personalInformation =
                        this.personalInformationFormGroup.value;
                    const problemSummary = this.problemSummaryFormGroup.value;
                    const problemDetails =
                        this.problemDetailsQuestionsFormGroup.value;

                    const answeredQuestions: IQuestionsRequestAnswer[] = [];
                    for (const question of this.problemDetailsQuestions) {
                        const response = problemDetails[question.id];
                        answeredQuestions.push({
                            questionId: question.id,
                            response
                        });
                    }

                    return {
                        product: {
                            productQualityComplaint:
                                product.productQualityComplaint ?? null,
                            userType: product.userType!,
                            brand: product.brand!,
                            lotNumber: product.lotNumber ?? null
                        },
                        report: {
                            userType: reportForm.userType!,
                            permission: reportForm.permission!,
                            contactInformartion: {
                                name: reportForm.contactInformartion?.name!,
                                facilityName:
                                    reportForm.contactInformartion
                                        ?.facilityName!,
                                phoneNumber:
                                    reportForm.contactInformartion
                                        ?.phoneNumber!,
                                email: reportForm.contactInformartion?.email!,
                                address:
                                    reportForm.contactInformartion?.address!
                            },
                            product: reportForm.product! ?? null
                        },
                        userType: reportForm.userType!,
                        verbatim: problemSummary.issueVerbatim!,
                        answeredQuestions
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

                const problemDetailsQuestions = [
                    ...this.problemDetailsQuestions
                ];

                for (const question of resp.questions) {
                    const validators: ValidatorFn[] = [];
                    if (question.required) {
                        validators.push(Validators.required);
                    }

                    this.problemDetailsQuestionsFormGroup.addControl(
                        question.id,
                        fb.control<string>("", { validators })
                    );
                    problemDetailsQuestions.push(question);
                }

                this.problemDetailsQuestions = problemDetailsQuestions;
            });

        if (environment.token) {
            this.authorized$ = activedRoute.queryParamMap.pipe(
                map((c) => c.get("token")),
                map((c) => c === environment.token)
            );
        } else {
            this.authorized$ = of(true);
        }

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

        this.products.forEach((product) => {
            this.filteredBrands =
                product.name === "Unknown" ? product.brands : [];
            this.sortBrands(product.brands);
        });
    }

    sortBrands(brands: Brand[]) {
        brands.sort((a, b) => a.name.localeCompare(b.name));
    }

    onStepSelectionChange(event: StepperSelectionEvent) {
        const selectedStep = event.selectedIndex;
        // const totalSteps = this.stepper._steps.length;
        // const newProgressValue = ((selectedStep + 1) / totalSteps) * 100;

        // this.progressBarService.setProgressValue(newProgressValue);
        const userDetailsFormGroup = this.userDetailsFormGroup as FormGroup;

        const patientInformation = this.patientInformationFormGroup;
        const nonPatientInformation = this.nonPatientInformationFormGroup;
        const userType =
            this.complaintReportingFormGroup.get("userType")?.value;

        if (userType === UserTypes.Patient) {
            if (!userDetailsFormGroup.get("patientInformation")) {
                userDetailsFormGroup.addControl(
                    "patientInformation",
                    patientInformation
                );
            }

            userDetailsFormGroup.removeControl("nonPatientInformation");
        } else {
            if (!userDetailsFormGroup.get("nonPatientInformation")) {
                userDetailsFormGroup.addControl(
                    "nonPatientInformation",
                    nonPatientInformation
                );
            }

            userDetailsFormGroup.removeControl("patientInformation");
        }
        this.userDetailsFormGroup.updateValueAndValidity();
    }

    loadPatientDetailsFormGroup() {
        const patientInformation = this.fb.group<
            FormGroupType<IPatientInformation>
        >({
            permissionToContact: this.fb.control<ContactPermission | null>(
                null,
                {
                    nonNullable: true,
                    validators: [Validators.required]
                }
            ),
            patient: this.fb.group<FormGroupType<IPatientDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup,
                isProductAvailable: this.fb.control<boolean | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                additionalContactInformation: this.contactInformationFormGroup,
                dateOfBirth: this.fb.control<DateTime>(
                    DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                    { nonNullable: true, validators: [] }
                ),
                ageAtComplaint: this.fb.control<string | null>(null, {
                    nonNullable: true,
                    validators: []
                })
            }),
            awareOfComplaint: this.fb.control<PhysicianAwareness | null>(null, {
                nonNullable: true,
                validators: [Validators.required]
            }),
            permissionToContactHCP:
                this.fb.control<ContactPermissionHCP | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
            hcp: this.fb.group<FormGroupType<IHCPDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup
            })
        });

        this.userDetailsFormGroup.addControl(
            "patientInformation",
            patientInformation
        );
    }

    loadNonPatientDetailsFormGroup() {
        const nonPatientInformation = this.fb.group<
            FormGroupType<INonPatientInformation>
        >({
            permissionToContactReporter:
                this.fb.control<ContactPermissionReporter | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
            patient: this.fb.group<FormGroupType<IPatientDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup,
                isProductAvailable: this.fb.control<boolean | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
                additionalContactInformation: this.contactInformationFormGroup,
                // additionalContactInformation: fb.group<
                //     FormGroupType<IContactInformation>
                // >({
                //     addressLine1: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     addressLine2: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: []
                //     }),
                //     city: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     country: fb.control<Country | null>(null, {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     postalCode: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     state: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     telephone: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [Validators.required]
                //     }),
                //     emailAddress: fb.control<string>("", {
                //         nonNullable: true,
                //         validators: [
                //             Validators.required,
                //             Validators.pattern(
                //                 "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$"
                //             )
                //         ]
                //     })
                // }),
                dateOfBirth: this.fb.control<DateTime>(
                    DateTime.fromObject({ year: 1980, month: 1, day: 1 }),
                    { nonNullable: true, validators: [] }
                ),
                ageAtComplaint: this.fb.control<string | null>(null, {
                    nonNullable: true,
                    validators: []
                })
            }),
            reporter: this.fb.group<FormGroupType<IReporterDetails>>({
                name: this.nameInformationFormGroup,
                contactInformation: this.contactInformationFormGroup
            }),
            facilityName: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            reporterAdministeredProduct:
                this.fb.control<ReporterAdministration | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                })
        });

        this.userDetailsFormGroup.addControl(
            "nonPatientInformation",
            nonPatientInformation
        );
    }

    ngAfterViewInit(): void {
        this.complaintReportingFormGroup.controls.product.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((product) => {
                if (product) {
                    this.scrollToItemSection();
                }
            });

        this.complaintReportingFormGroup.controls.brand.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((brand) => {
                if (brand) {
                    this.scrollToStrengthSection();
                }
            });
    }

    ngOnInit(): void {
        this.complaintReportingFormGroup.controls.userType.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((user) => {
                if (user) {
                    this.userDetailsFormGroup.reset();
                }
                // if (user === UserTypes.Patient) {
                //     console.log(patientInformation);
                //     patientInformation?.setValidators(Validators.required);
                //     nonPatientInformation?.clearValidators();
                // } else {
                //     patientInformation?.clearValidators();
                //     nonPatientInformation?.setValidators(
                //         Validators.required
                //     );
                // }
                // patientInformation?.updateValueAndValidity();
                // nonPatientInformation?.updateValueAndValidity();
            });
    }

    addConcomitantProductDetails() {
        const cc = {
            productName: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            formulation: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            indication: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            routeOfAdministration:
                this.fb.control<RouteOfAdministration | null>(null, {
                    nonNullable: true,
                    validators: [Validators.required]
                }),
            startDate: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            endDate: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            dose: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            strength: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            frequency: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            frequencyTime: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            }),
            optionalImage: this.fb.control<string>("", {
                nonNullable: true,
                validators: [Validators.required]
            })
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
        this.complaintReportingFormGroup.controls.product.setValue("");
    }

    // get concomitantProductDetails(): FormArray {
    //   return this.complaintDetailsFormGroup.get('product.concomitantMedication.details') as FormArray;
    // }

    get formControls(): { label: string; value: string }[] {
        const controls = this.complaintReportingFormGroup.controls;
        const entries = Object.keys(controls).map((key) => {
            const control: AbstractControl =
                this.complaintReportingFormGroup.get(key) as AbstractControl;
            let value: string;

            if (Array.isArray(control.value)) {
                value = control.value.join(", ");
            } else if (
                typeof control.value === "object" &&
                control.value !== null
            ) {
                value = this.formatObjectValue(control.value);
            } else if (control.value !== null) {
                value = control.value.toString();
            } else {
                return null;
            }
            return {
                label: key,
                value: value
            };
        });
        return entries.filter((entry) => entry !== null) as {
            label: string;
            value: string;
        }[];
    }

    get productQualityComplaint() {
        return this.productFormGroup.controls.productQualityComplaint.value;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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

    private scrollToItemSection(): void {
        // this.brandsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }

    private scrollToStrengthSection(): void {
        setTimeout(() => {
            if (!this.strengthSection) {
                return;
            }
            this.strengthSection.nativeElement.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    }

    private formatObjectValue(obj: any): string {
        const properties = Object.keys(obj).map(
            (prop) => `${prop}: ${obj[prop]}`
        );
        return properties.join(", ");
    }

    private _filterGroup(value: string): StateGroup[] {
        if (value) {
            return this.stateGroups
                .map((group) => ({
                    letter: group.letter,
                    names: _filter(group.names, value)
                }))
                .filter((group) => group.names.length > 0);
        }

        return this.stateGroups;
    }

    private getNextQuestions() {
        this.readyForMoreQuestions$.next();
    }
}
