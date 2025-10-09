import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AiValidators } from '../../validators/ai-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), AiValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), AiValidators.notOnlyWhitespace]),
        email:     new FormControl('', [Validators.required, Validators.email])
      }),
      shippingAddress: this.formBuilder.group({
        country:   new FormControl('', [Validators.required])
      })
    });

    // Autofill email from Auth0 profile
    this.auth.user$.subscribe(user => {
      if (user?.email) {
        this.checkoutFormGroup.get('customer.email')?.setValue(user.email);
      }
    });
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(q => this.totalQuantity = q);
    this.cartService.totalPrice.subscribe(p => this.totalPrice = p);
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const order = new Order(this.totalQuantity, this.totalPrice);
    const orderItems: OrderItem[] = this.cartService.cartItems.map(ci => new OrderItem(ci));

    const purchase = new Purchase(
      this.checkoutFormGroup.controls['customer'].value,
      this.checkoutFormGroup.controls['shippingAddress'].value,
      this.checkoutFormGroup.controls['shippingAddress'].value, // billing same as shipping
      order,
      orderItems
    );

    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`There was an error processing your order: ${err.message}`);
      }
    });
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products');
    this.cartService.computeCartTotals();
  }

  // getters used by template
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName()  { return this.checkoutFormGroup.get('customer.lastName'); }
  get email()     { return this.checkoutFormGroup.get('customer.email'); }
  get country()   { return this.checkoutFormGroup.get('shippingAddress.country'); }
}
