import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';

export interface IProductInformation {
  productQualityComplaint: boolean | null;

  userType: UserTypes;

  brand: string;
  lotNumber: string | null;
}

export interface IInitialReporting {
  userType: UserTypes;

  permission: string;
  contactInformartion: IContactData;
  product: string;
}

export interface IComplaintReporting {
  userType: UserTypes | null;
  purchasedCountry: Country | null;
  product: string;
  brand: string;
  strength: string;

  returnOption: ReturnOption | null;

  hasBatchLotNumber: boolean | null;
  batchLotNumber?: string;
  noReason?: string;

  gtin?: string;
  serial?: string;

  hcp: IHcpData;

  issueDescription: string;
  uploadImage?: File[];
}

export interface IHcpData {
  reportedFromJNJProgram: boolean | null;

  studyProgram?: string;
  siteNumber?: string;
  subjectNumber?: string;
}

// export interface IComplaintReporting {
//   complaintReportType: ComplaintReportTypes | null;

//   product: string;
//   brand: string;
//   strength: string;
//   purchasedCountry: Country | null;

//   lotNumber: string;

//   sameCountryReport: SameCountryReportStatus | null;

//   reportedCountry?: Country | null;
//   // productImage: string;
// }

export interface Product {
  name: string;
  type: ProductTypes;
  imagePath: string;
  brands: Brand[];
}

export interface Brand {
  name: string;
  imagePath: string;
}

export interface IUserDetails {
  userType: UserTypes | null;
  patientInformation: IPatientInformation;
  patientReporterInformation: IPatientReporterInformation;
  // reporterInformation?: IPatientReporterInformation | null;
}

export interface IPatientInformation {
  patient: IPatientDetails;
  awareOfComplaint: PhysicianAwareness | null;
  permissionToContact: ContactPermission | null;
  permissionToContactHCP: ContactPermissionHCP | null;
  hcp: IHCPDetails;

  // patientMedicalHistory: IPatientMedicalHistory;
}

export interface IPatientReporterInformation {
  patient: IPatientDetails;
  reporter: IReporterDetails;
  facilityName: string;
  reporterAdministeredProduct: ReporterAdministration | null;
  permissionToContactReporter: ContactPermissionReporter | null;

  // patientMedicalHistory: IPatientMedicalHistory;
}

export interface IPatientDetails {
  title?: Title | null;
  firstName: string;
  lastName: string;
  contactInformation: IContactInformation;
  isProductAvailable: boolean | null;
  additionalContactInformation: IContactInformation;
  dateOfBirth: DateTime;
  ageAtComplaint?: string | null;
}

export interface IReporterDetails {
  title?: Title | null;
  firstName: string;
  lastName: string;
  contactInformation: IContactInformation;
}

export interface IHCPDetails {
  title?: Title | null;
  firstName: string;
  lastName: string;
  contactInformation: IContactInformation;
}

export interface IContactInformation {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country: Country | null;
  postalCode?: string;
  state?: string;
  telephone?: string;
  emailAddress?: string;
}

export interface IPatientMedicalHistory {
  medicalHistory: string;
  allergies: AllergyStatus | null;
  allergyDetails: string;
  drugAbuse: DrugAbuseStatus | null;
  drugAbuseDetails: string;
  alcoholConsumption: AlcoholConsumptionStatus | null;
  alcoholConsumptionDetails: Consumption;
  smokingStatus: SmokingStatus | null;
  smokingDetails: Consumption;
}

export interface IProductDetails {
  tookProductAsDirected: string;

  administeredBy: AdministeredBy | null;
  concomitantMedication: ConcomitantMedication;
}

export interface IComplaintDetails {
  product: IProductDetails;
  reportedFromJNJProgram: string;

  studyProgram: string;
  siteNumber: string;
  subjectNumber: string;

  complaintDescription: string;
}

export interface ConcomitantMedication {
  status: ConcomitantMedicationStatus | null;
  details: ConcomitantMedicationDetails;
}

export interface ConcomitantMedicationDetails {
  productName: string;
  formulation: string;
  indication: string;
  routeOfAdministration: RouteOfAdministration | null;
  startDate: string;
  endDate: string;
  dose: string;
  strength: string;
  frequency: string;
  frequencyTime: string;
  optionalImage: string;
  // optionalImage?: string;
}

// export interface ConcomitantMedicationDetails {
//   productName: FormControl<string>;
//   formulation: FormControl<string>;
//   indication: FormControl<string>;
//   routeOfAdministration: FormControl<RouteOfAdministration | null>;
//   startDate: FormControl<string>;
//   endDate: FormControl<string>;
//   dose: FormControl<string>;
//   strength: FormControl<string>;
//   frequency: FormControl<string>;
//   frequencyTime: FormControl<string>;
//   optionalImage: FormControl<string>;
// }

export interface IContactData {
  name: string;
  facilityName: string;

  phoneNumber: string;
  email: string;

  address: string;
}

export interface IPersonalData {
  firstName: string;
  lastName: string;

  sex: string;
  pregnant?: string | null;

  birthdate: DateTime;
}

export interface IAddress {
  streetAddress: string;
  streetAddress2: string | null;
  city: string;
  state: string;
  zipPostal: string;
}

export interface IPersonalInformation {
  personalData: IPersonalData;
  physicalAddress: IAddress;
}

export enum UserTypes {
  Patient = 'patient',
  HealthcareProfessional = 'healthcareProfessional',
  NonHealthcareProfessional = 'nonHealthcareProfessional',
  Manufacturer = 'manufacturer',
  Employees = 'employees',
}

export enum ComplaintReportTypes {
  ProductQualityComplaint = 'productQualityComplaint',
  AdverseEvent = 'adverseEvent',
  ProductInformation = 'productInformation',
}

export enum ProductTypes {
  OnePressDevice = 'onePressDevice',
  PrefilledSyringe = 'prefilledSyringe',
  Autoinjector = 'autoinjector',
  Spray = 'spray',
  Tablet = 'tablet',
  Vial = 'vial',
  InjectionKit = 'injectionKit',
  Cream = 'cream',
  Patch = 'patch',
  Ampule = 'ampule',
  Other = 'other',
}

export enum AdministeredBy {
  DoctorOrNurse = 'Doctor/Nurse',
  FamilyMember = 'Family Member',
  Patient = 'Patient',
  Other = 'Other',
}

export enum RouteOfAdministration {
  Oral = 'Oral',
  Intravenous = 'Intravenous',
  Intramuscular = 'Intramuscular',
  Subcutaneous = 'Subcutaneous',
  Topical = 'Topical',
  Inhalation = 'Inhalation',
  Rectal = 'Rectal',
  Other = 'Other',
}

export enum AllergyStatus {
  Yes = 'Yes',
  NotAsked = 'Not asked',
  Refused = 'Refused',
  NoKnownAllergies = 'No known allergies',
  NoKnownDrugAllergies = 'No known drug allergies',
}

export enum DrugAbuseStatus {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  Refused = 'Refused',
  NotAsked = 'Not asked',
}

export enum AlcoholConsumptionStatus {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  Refused = 'Refused',
  NotAsked = 'Not asked',
}

export enum SmokingStatus {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  Refused = 'Refused',
  NotAsked = 'Not asked',
}

export enum PhysicianAwareness {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  NotAsked = 'Not asked',
}

export enum ReporterAdministration {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
}

export enum ContactPermission {
  Yes = 'Yes',
  No = 'No',
}

export enum ContactPermissionHCP {
  Yes = 'Yes',
  No = 'No',
}

export enum ContactPermissionReporter {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  NotAsked = 'Not asked',
}

export enum SameCountryReportStatus {
  Yes = 'Yes',
  No = 'No',
}

export enum ConcomitantMedicationStatus {
  Yes = 'Yes',
  No = 'No',
  Unknown = 'Unknown',
  Refused = 'Refused',
  NotAsked = 'Not asked',
}

export enum Country {
  Afghanistan = 'Afghanistan',
  Albania = 'Albania',
  Algeria = 'Algeria',
  Andorra = 'Andorra',
  Angola = 'Angola',
  AntiguaAndBarbuda = 'Antigua and Barbuda',
  Argentina = 'Argentina',
  Armenia = 'Armenia',
  Australia = 'Australia',
  Austria = 'Austria',
  Azerbaijan = 'Azerbaijan',
  Bahamas = 'Bahamas',
  Bahrain = 'Bahrain',
  Bangladesh = 'Bangladesh',
  Barbados = 'Barbados',
  Belarus = 'Belarus',
  Belgium = 'Belgium',
  Belize = 'Belize',
  Benin = 'Benin',
  Bhutan = 'Bhutan',
  Bolivia = 'Bolivia',
  BosniaAndHerzegovina = 'Bosnia and Herzegovina',
  Botswana = 'Botswana',
  Brazil = 'Brazil',
  Brunei = 'Brunei',
  Bulgaria = 'Bulgaria',
  BurkinaFaso = 'Burkina Faso',
  Burundi = 'Burundi',
  CaboVerde = 'Cabo Verde',
  Cambodia = 'Cambodia',
  Cameroon = 'Cameroon',
  Canada = 'Canada',
  CentralAfricanRepublic = 'Central African Republic',
  Chad = 'Chad',
  Chile = 'Chile',
  China = 'China',
  Colombia = 'Colombia',
  Comoros = 'Comoros',
  Congo = 'Congo',
  CostaRica = 'Costa Rica',
  Croatia = 'Croatia',
  Cuba = 'Cuba',
  Cyprus = 'Cyprus',
  CzechRepublic = 'Czech Republic',
  Denmark = 'Denmark',
  Djibouti = 'Djibouti',
  Dominica = 'Dominica',
  DominicanRepublic = 'Dominican Republic',
  EastTimor = 'East Timor',
  Ecuador = 'Ecuador',
  Egypt = 'Egypt',
  ElSalvador = 'El Salvador',
  EquatorialGuinea = 'Equatorial Guinea',
  Eritrea = 'Eritrea',
  Estonia = 'Estonia',
  Eswatini = 'Eswatini',
  Ethiopia = 'Ethiopia',
  Fiji = 'Fiji',
  Finland = 'Finland',
  France = 'France',
  Gabon = 'Gabon',
  Gambia = 'Gambia',
  Georgia = 'Georgia',
  Germany = 'Germany',
  Ghana = 'Ghana',
  Greece = 'Greece',
  Grenada = 'Grenada',
  Guatemala = 'Guatemala',
  Guinea = 'Guinea',
  GuineaBissau = 'Guinea-Bissau',
  Guyana = 'Guyana',
  Haiti = 'Haiti',
  Honduras = 'Honduras',
  Hungary = 'Hungary',
  Iceland = 'Iceland',
  India = 'India',
  Indonesia = 'Indonesia',
  Iran = 'Iran',
  Iraq = 'Iraq',
  Ireland = 'Ireland',
  Israel = 'Israel',
  Italy = 'Italy',
  Jamaica = 'Jamaica',
  Japan = 'Japan',
  Jordan = 'Jordan',
  Kazakhstan = 'Kazakhstan',
  Kenya = 'Kenya',
  Kiribati = 'Kiribati',
  KoreaNorth = 'Korea, North',
  KoreaSouth = 'Korea, South',
  Kosovo = 'Kosovo',
  Kuwait = 'Kuwait',
  Kyrgyzstan = 'Kyrgyzstan',
  Laos = 'Laos',
  Latvia = 'Latvia',
  Lebanon = 'Lebanon',
  Lesotho = 'Lesotho',
  Liberia = 'Liberia',
  Libya = 'Libya',
  Liechtenstein = 'Liechtenstein',
  Lithuania = 'Lithuania',
  Luxembourg = 'Luxembourg',
  Madagascar = 'Madagascar',
  Malawi = 'Malawi',
  Malaysia = 'Malaysia',
  Maldives = 'Maldives',
  Mali = 'Mali',
  Malta = 'Malta',
  MarshallIslands = 'Marshall Islands',
  Mauritania = 'Mauritania',
  Mauritius = 'Mauritius',
  Mexico = 'Mexico',
  Micronesia = 'Micronesia',
  Moldova = 'Moldova',
  Monaco = 'Monaco',
  Mongolia = 'Mongolia',
  Montenegro = 'Montenegro',
  Morocco = 'Morocco',
  Mozambique = 'Mozambique',
  Myanmar = 'Myanmar',
  Namibia = 'Namibia',
  Nauru = 'Nauru',
  Nepal = 'Nepal',
  Netherlands = 'Netherlands',
  NewZealand = 'New Zealand',
  Nicaragua = 'Nicaragua',
  Niger = 'Niger',
  Nigeria = 'Nigeria',
  NorthMacedonia = 'North Macedonia',
  Norway = 'Norway',
  Oman = 'Oman',
  Pakistan = 'Pakistan',
  Palau = 'Palau',
  Panama = 'Panama',
  PapuaNewGuinea = 'Papua New Guinea',
  Paraguay = 'Paraguay',
  Peru = 'Peru',
  Philippines = 'Philippines',
  Poland = 'Poland',
  Portugal = 'Portugal',
  Qatar = 'Qatar',
  Romania = 'Romania',
  Russia = 'Russia',
  Rwanda = 'Rwanda',
  SaintKittsAndNevis = 'Saint Kitts and Nevis',
  SaintLucia = 'Saint Lucia',
  SaintVincentAndTheGrenadines = 'Saint Vincent and the Grenadines',
  Samoa = 'Samoa',
  SanMarino = 'San Marino',
  SaoTomeAndPrincipe = 'Sao Tome and Principe',
  SaudiArabia = 'Saudi Arabia',
  Senegal = 'Senegal',
  Serbia = 'Serbia',
  Seychelles = 'Seychelles',
  SierraLeone = 'Sierra Leone',
  Singapore = 'Singapore',
  Slovakia = 'Slovakia',
  Slovenia = 'Slovenia',
  SolomonIslands = 'Solomon Islands',
  Somalia = 'Somalia',
  SouthAfrica = 'South Africa',
  SouthSudan = 'South Sudan',
  Spain = 'Spain',
  SriLanka = 'Sri Lanka',
  Sudan = 'Sudan',
  Suriname = 'Suriname',
  Sweden = 'Sweden',
  Switzerland = 'Switzerland',
  Syria = 'Syria',
  Taiwan = 'Taiwan',
  Tajikistan = 'Tajikistan',
  Tanzania = 'Tanzania',
  Thailand = 'Thailand',
  Togo = 'Togo',
  Tonga = 'Tonga',
  TrinidadAndTobago = 'Trinidad and Tobago',
  Tunisia = 'Tunisia',
  Turkey = 'Turkey',
  Turkmenistan = 'Turkmenistan',
  Tuvalu = 'Tuvalu',
  Uganda = 'Uganda',
  Ukraine = 'Ukraine',
  UnitedArabEmirates = 'United Arab Emirates',
  UnitedKingdom = 'United Kingdom',
  UnitedStates = 'United States',
  Uruguay = 'Uruguay',
  Uzbekistan = 'Uzbekistan',
  Vanuatu = 'Vanuatu',
  VaticanCity = 'Vatican City',
  Venezuela = 'Venezuela',
  Vietnam = 'Vietnam',
  Yemen = 'Yemen',
  Zambia = 'Zambia',
  Zimbabwe = 'Zimbabwe',
}

export enum Title {
  Cdr = 'Cdr.',
  Col = 'Col.',
  Cpl = 'Cpl.',
  Cpt = 'Cpt.',
  Docteur = 'Docteur',
  Docteure = 'Docteure',
  Dr = 'Dr.',
  Lcdr = 'Lcdr.',
  Lt = 'Lt.',
  Ltc = 'Ltc.',
  Maj = 'Maj.',
  Miss = 'Miss.',
  Mr = 'Mr.',
  Mrs = 'Mrs.',
  Ms = 'Ms.',
  Prof = 'Prof.',
  Rev = 'Rev.',
  Sgt = 'Sgt.',
  Sir = 'Sir',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export interface Height {
  value: string | null;
  unit: HeightUnit | null;
}

export enum HeightUnit {
  FEET = 'Feet',
  INCHES = 'Inches',
}

export interface Weight {
  value: string | null;
  unit: WeightUnit | null;
}

export enum WeightUnit {
  LBS = 'Lbs',
  Kg = 'Kg',
}

export interface Consumption {
  value: string | null;
  unit: ConsumptionUnit | null;
}

export enum ConsumptionUnit {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
}

export enum ReturnOption {
  Yes = "Yes",
  NoUnwillingToSend = "No - Unwilling to send",
  NoProductDiscarded = "No - Product was discarded",
  NoSampleWithAnotherParty = "No - Sample is with another party",
  NoProductAdministeredAtHCPFacility = "No - Product administered at HCP facility"
}

export interface IProblemSummary {
  issueVerbatim: string;

  images?: File[];
}
