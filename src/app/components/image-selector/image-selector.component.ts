import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Brand, Product } from 'src/app/types';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss']
})
export class ImageSelectorComponent {
  @Input() products!: Product[];

  @Input() showAllProducts?: boolean;
  @Input() selectedProductIndex?: number;

  @Input() productValue?: string;
  @Input() filteredBrands?: Brand[];
  @Input() selectedBrand?: string;

  @Input() formControlName!: string;

  // @Output() onProductSelectionChange = new EventEmitter<boolean>;

  // onProductSelectionChange(index: number): void {
  //   this.selectedBrandControl.setValue(null);
  //   this.selectedProductIndex = index;
  //   this.showAllProducts = false;
  // }
}
