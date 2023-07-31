import { Provider } from "@angular/core";
import {
    IProductsClientBase,
    ProductBrandFormStrengthView,
    ProductBrandsFilter,
    ProductBrandView,
    ProductFormsFilter,
    ProductFormView
} from "@generated-api-clients";
import { delay, Observable, of } from "rxjs";
import { Product, ProductTypes } from "../types";
import { ProductsApiService } from "./products-api.service";

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
    }
    // {
    //     name: "Unknown",
    //     type: ProductTypes.Unknown,
    //     imagePath: "./assets/products/unknown.png",
    //     brands: [
    //         { name: "Tremfya", imagePath: "./assets/brands/Tremfya.png" },
    //         { name: "Stelara", imagePath: "./assets/brands/Stelara.png" },
    //         { name: "Invega", imagePath: "./assets/brands/Invega.png" },
    //         { name: "Simponi", imagePath: "./assets/brands/Simponi.png" },
    //         { name: "Spravato", imagePath: "./assets/brands/Spravato.png" },
    //         { name: "Symtuza", imagePath: "./assets/brands/Symtuza.png" },
    //         { name: "Erleada", imagePath: "./assets/brands/Erleada.png" },
    //         { name: "Opsynvi", imagePath: "./assets/brands/Opsynvi.png" },
    //         { name: "Xarelto", imagePath: "./assets/brands/Xarelto.png" },
    //         { name: "Balversa", imagePath: "./assets/brands/Balversa.png" },
    //         {
    //             name: "RisperdalConsta",
    //             imagePath: "./assets/brands/RisperdalConsta.png"
    //         },
    //         { name: "Imbruvica", imagePath: "./assets/brands/Imbruvica.png" },
    //         { name: "Uptravi", imagePath: "./assets/brands/Uptravi.png" },
    //         { name: "Velcade", imagePath: "./assets/brands/Velcade.png" },
    //         { name: "Remicade", imagePath: "./assets/brands/Remicade.png" },
    //         { name: "Darzalex", imagePath: "./assets/brands/Darzalex.png" },
    //         { name: "Ponvory", imagePath: "./assets/brands/Ponvory.png" },
    //         { name: "Tecvayli", imagePath: "./assets/brands/Tecvayli.png" },
    //         { name: "Rybrevant", imagePath: "./assets/brands/Rybrevant.png" },
    //         { name: "Daktarin", imagePath: "./assets/brands/Daktarin.png" },
    //         { name: "Nizoral", imagePath: "./assets/brands/Nizoral.png" },
    //         { name: "Daktacort", imagePath: "./assets/brands/Daktacort.png" },
    //         { name: "Evra", imagePath: "./assets/brands/Evra.png" },
    //         { name: "Carvykti", imagePath: "./assets/brands/Carvykti.png" },
    //         { name: "Cabenuva", imagePath: "./assets/brands/Cabenuva.png" },
    //         { name: "Akeega", imagePath: "./assets/brands/Akeega.png" }
    //     ]
    // }
];

const strengths: ProductBrandFormStrengthView[] = [
    new ProductBrandFormStrengthView({
        id: "1",
        name: "50.00 MG"
    }),
    new ProductBrandFormStrengthView({
        id: "2",
        name: "5 doses of 0.50 mL"
    }),
    new ProductBrandFormStrengthView({
        id: "3",
        name: "100.00 MG"
    })
];

const data = (() => {
    const formsMap = new Map<
        string,
        {
            form: ProductFormView;
            brandIds: string[];
        }
    >();

    const brandsMap = new Map<
        string,
        {
            brand: ProductBrandView;
            formIds: string[];
        }
    >();

    for (const product of products) {
        const formId = product.name;

        const form = new ProductFormView({
            id: formId,
            name: product.name,
            primaryImageUrl: product.imagePath,
            stages: []
        });
        const brandIds: string[] = [];
        formsMap.set(form.id, {
            form,
            brandIds
        });

        for (const productBrand of product.brands) {
            const brandId = productBrand.name;
            let brand = brandsMap.get(brandId);
            if (!brand) {
                brand = {
                    formIds: [],
                    brand: new ProductBrandView({
                        id: productBrand.name,
                        name: productBrand.name,
                        primaryImageUrl: productBrand.imagePath
                    })
                };
                brandsMap.set(brandId, brand);
            }

            brand.formIds.push(formId);
            brandIds.push(brandId);
        }
    }

    return {
        brands: Array.from(brandsMap.values()),
        forms: Array.from(formsMap.values())
    };
})();

export class ProductsApiServiceMock implements IProductsClientBase {
    static makeProvider(
        decorate?: (obj: IProductsClientBase) => IProductsClientBase
    ): Provider {
        let val: IProductsClientBase = new ProductsApiServiceMock();

        if (decorate) {
            val = decorate(val);
        }

        return {
            provide: ProductsApiService,
            useClass: ProductsApiServiceMock
        };
    }

    getBrand(id: string): Observable<ProductBrandView> {
        throw new Error("Method not implemented.");
    }
    getForm(id: string): Observable<ProductFormView> {
        throw new Error("Method not implemented.");
    }

    getBrands(): Observable<ProductBrandView[]> {
        return this.filterBrands(new ProductBrandsFilter());
    }

    getForms(): Observable<ProductFormView[]> {
        return this.filterForms(new ProductFormsFilter());
    }

    getFormsForBrand(id: string): Observable<ProductFormView[]> {
        return this.filterForms(new ProductFormsFilter({ brandIds: [id] }));
    }

    filterBrands(filter: ProductBrandsFilter): Observable<ProductBrandView[]> {
        let ret = data.brands;

        if (filter.formIds?.length) {
            ret = ret.filter((x) =>
                this.hasIntersection(filter.formIds!, x.formIds)
            );
        }

        const brands = ret.map((x) => x.brand);
        return this.randomDelayObservable(brands);
    }

    getBrandsForForm(id: string): Observable<ProductBrandView[]> {
        return this.filterBrands(new ProductBrandsFilter({ formIds: [id] }));
    }

    filterForms(filter: ProductFormsFilter): Observable<ProductFormView[]> {
        let ret = data.forms;

        if (filter.brandIds?.length) {
            ret = ret.filter((x) =>
                this.hasIntersection(filter.brandIds!, x.brandIds)
            );
        }

        const forms = ret.map((x) => x.form);
        return this.randomDelayObservable(forms);
    }

    getStrengthsForBrandAndForm(
        brandId: string,
        formId: string
    ): Observable<ProductBrandFormStrengthView[]> {
        return this.randomDelayObservable(strengths, 1000, 2000);
    }

    private randomDelayObservable<T>(val: T): Observable<T>;
    private randomDelayObservable<T>(
        val: T,
        min: number,
        max: number
    ): Observable<T>;
    private randomDelayObservable<T>(val: T, min = 200, max = 500) {
        return of(val).pipe(delay(Math.random() * (max - min) + min));
    }

    private hasIntersection<T>(l: T[], r: T[]) {
        for (const a of l) {
            for (const b of r) {
                if (a === b) {
                    return true;
                }
            }
        }

        return false;
    }
}
