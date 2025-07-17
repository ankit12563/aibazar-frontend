import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component'; 

//Define the routes for to search products by category
const routes: Routes = [
  {path: "cart-details", component: CartDetailsComponent},
  {path: "product/:id", component: ProductDetailsComponent}, // Route to view product details by ID
  {path: "search/:keyword", component: ProductListComponent}, // Route to search products by keyword
  {path: "category/:id", component: ProductListComponent}, // Route to search products by category ID
  {path: "category", component: ProductListComponent}, // Route to search products by category without ID
  {path: "products", component: ProductListComponent}, // Route to search by products
  {path: '', redirectTo: "/products", pathMatch: "full"},
  {path: "**", redirectTo: "/products", pathMatch: "full"} //routes to handle whlile above search methods doesnot match
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(routes), 
    BrowserModule,
    AppRoutingModule,
    NgbModule 
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
