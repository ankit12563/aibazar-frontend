import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthModule, OktaCallbackComponent, OKTA_CONFIG } from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { AuthGuard, AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';


//Define the routes for to search products by category
const routes: Routes = [

  {path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard]},
  {path: "checkout", component: CheckoutComponent}, // Route to handle checkout
  {path: "cart-details", component: CartDetailsComponent}, // Route to view cart details
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
    CartDetailsComponent,
    CheckoutComponent,
    LoginStatusComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes), 
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    OktaAuthModule,
    AuthModule.forRoot({
      ...myAppConfig.auth,
      httpInterceptor: {
      ...myAppConfig.httpInterceptor,
      },
       }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ProductService,
    {provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
