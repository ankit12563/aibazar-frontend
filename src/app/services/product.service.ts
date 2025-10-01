import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = `${environment.apiUrl}/products`;
  private categoryUrl = `${environment.apiUrl}/product-category`;

  constructor(private httpClient: HttpClient) { } // Inject HttpClient to make HTTP requests

  getProductView(theProductId: number): Observable<Product> {

    const productViewUrl = `${this.baseUrl}/${theProductId}`; // Construct the product view URL using the product ID
    return this.httpClient.get<Product>(productViewUrl);

  }

  getProductList(thecategoryId: number,): Observable<Product[]> {  // Method to get the list of products by category ID

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}&size=100`; //&size=100 Construct the search URL using the category ID

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe( // Make an HTTP GET request to the base URL
      map(response => response._embedded.products), // Map the response to extract the products array
    );
  }
  getProductListPaginate(thePage: number,
    thePageSize: number,
    thecategoryId: number): Observable<GetResponseProducts> {  // Method to get the list of products by category ID

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${thecategoryId}`
      + `&page=${thePage}&size=${thePageSize}`; // Construct the search URL using the category ID

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`; // Construct the search URL using the category ID

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe( // Make an HTTP GET request to the base URL
      map(response => response._embedded.products), // Map the response to extract the products array
    );

  }

  getProductCategories(): Observable<ProductCategory[]> { // Method to get the list of product categories
    // Make an HTTP GET request to the category URL and return an observable of ProductCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory),
    );
  }
  getAllProducts(page: number = 0, size: number = 100): Observable<Product[]> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }
}


interface GetResponseProducts { // Interface to define the structure of the response from the API
  _embedded: {  // Embedded property containing the products array
    products: Product[];  // Array of Product objects
  };
  page: {
    size: number;  // Size of the page
    totalElements: number;  // Total number of elements
    totalPages: number;  // Total number of pages
    number: number;  // Current page number
  }
}

interface GetResponseProductCategory {  // Interface to define the structure of the response for product category
  _embedded: {  // Embedded property containing the product categories array
    productCategory: ProductCategory[];  // Array of ProductCategory objects
  };
}
