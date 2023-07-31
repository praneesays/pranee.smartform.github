import { Injectable } from "@angular/core";
import { ProductsClientBase } from "@generated-api-clients";
@Injectable({
    providedIn: "root"
})
export class ProductsApiService extends ProductsClientBase {}
