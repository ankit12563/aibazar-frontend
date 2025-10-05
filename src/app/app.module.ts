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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OktaAuthModule } from '@okta/okta-angular';

import { AuthGuard, AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

// 🔑 Import environment (auto switches between environment.ts and environment.prod.ts)
import { environment } from '../environments/environment';

const routes: Routes = [
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: "checkout", component: CheckoutComponent },
  { path: "cart-details", component: CartDetailsComponent },
  { path: "product/:id", component: ProductDetailsComponent },
  { path: "search/:keyword", component: ProductListComponent },
  { path: "category/:id", component: ProductListComponent },
  { path: "category", component: ProductListComponent },
  { path: "products", component: ProductListComponent },
  { path: '', redirectTo: "/products", pathMatch: "full" },
  { path: "**", redirectTo: "/products", pathMatch: "full" }
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
    OktaAuthModule, // If you are still mixing Okta and Auth0
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
    authorizationParams: {
        redirect_uri: environment.auth.authorizationParams.redirect_uri,
        audience: environment.auth.authorizationParams.audience
      },
      httpInterceptor: {
        allowedList: environment.httpInterceptor.allowedList
      }
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    ProductService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
