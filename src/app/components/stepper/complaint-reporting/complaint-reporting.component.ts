import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { startWith, map, Observable } from 'rxjs';
import {
  IComplaintReporting,
  UserTypes,
  ReturnOption,
  IHcpData,
  Country,
  Brand,
  Product,
} from 'src/app/types';
import { Question } from 'src/app/questions';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LotNumberHelpBottomSheetComponent } from 'src/app/bottom-sheets/lot-number-help-bottom-sheet/lot-number-help-bottom-sheet.component';
import { FormGroupType } from '../stepper.component';

@Component({
  selector: 'app-complaint-reporting',
  templateUrl: './complaint-reporting.component.html',
  styleUrls: ['./complaint-reporting.component.scss'],
})
export class ComplaintReportingComponent {
  readonly complaintReportingFormGroup: FormGroup<
    FormGroupType<IComplaintReporting>
  >;

  readonly UserTypes = UserTypes;

  @Input()
  products!: Product[];

  @Output() dataChanged = new EventEmitter<any>();

  countries: Country[] = Object.values(Country);
  countriesList?: Observable<string[]>;

  returnOptionValues: string[] = Object.values(ReturnOption);

  showAllProducts: boolean = true;
  selectedProductIndex: number = -1;

  filteredProducts: Product[] = [];

  filteredBrands: Brand[] = [];
  selectedBrand: string = '';

  imageHotspotValues: Question[] = [];

  constructor(private readonly bottomSheet: MatBottomSheet, private readonly fb: FormBuilder) {
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
    });

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

    this.filteredProducts = this.products;
  }

  ngOnInit() {
    if (this.complaintReportingFormGroup.controls.purchasedCountry) {
      this.countriesList =
        this.complaintReportingFormGroup.controls.purchasedCountry.valueChanges.pipe(
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
    this.filteredProducts = this.products.filter(
      (product) =>
        product.brands.some(
          (brand) => brand.name.toLowerCase() === brandName
        ) && product.name !== 'Unknown'
    );
  }

  filterbrands(filter: string, productName: string) {
    const productList = this.products.find(
      (product) => product.name == productName
    );

    if (productList) {
      if (productName === 'Unknown') {
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

  showLotNumberHelp() {
    this.bottomSheet.open(LotNumberHelpBottomSheetComponent);
  }

  emitDataChanges() {
    const data = this.complaintReportingFormGroup;
    this.dataChanged.emit(data);
  }
}
