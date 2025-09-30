import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AiValidators } from '../../validators/ai-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { CartItem } from '../../common/cart-item';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';


@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,  // Constructor to initialize the form and subscribe to cart updates
              private chekoutService: CheckoutService,
              private router: Router) { } 

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), AiValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), AiValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'), AiValidators.notOnlyWhitespace]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$'), AiValidators.notOnlyWhitespace])
        
      }), 
      shippingAddress: this.formBuilder.group({
        zipCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{7}$/), AiValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required,  AiValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required, AiValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, AiValidators.notOnlyWhitespace]),
        street: new FormControl('', [Validators.required, AiValidators.notOnlyWhitespace]),
      }),

      payment: this.formBuilder.group({
        paymentMethod: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, AiValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^\\d{16}$'), AiValidators.notOnlyWhitespace]),
        expiryDate: new FormControl('', [Validators.required]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^\\d{3}$'), AiValidators.notOnlyWhitespace]),
      }),
    });
    
  }
  reviewCartDetails() {
    
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity // Subscribe to total quantity changes
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice // Subscribe to total price changes
    );
  }
  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order(this.totalQuantity, this.totalPrice); // Create a new Order instance with total quantity and price
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems; // Get the cart items from the CartService

    let orderItems: OrderItem[] = []; // Initialize an array to hold OrderItem instances
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    let purchase = new Purchase(
      this.checkoutFormGroup.controls['customer'].value,
      this.checkoutFormGroup.controls['shippingAddress'].value,
      this.checkoutFormGroup.controls['shippingAddress'].value, // Assuming billing address is the same as shipping address
      order,
      orderItems
    );
    
    console.log(purchase);   
    
    this.chekoutService.placeOrder(purchase).subscribe({
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
    this.cartService.cartItems = []; // Clear the cart items
    this.cartService.totalPrice.next(0); // Reset total price
    this.cartService.totalQuantity.next(0); // Reset total quantity

    this.checkoutFormGroup.reset(); // Reset the checkout form group

    this.router.navigateByUrl('/products'); // Navigate back to products page
    this.cartService.computeCartTotals(); // Recompute cart totals
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}
  get phoneNumber() {return this.checkoutFormGroup.get('customer.phoneNumber');}

  get zipCode() {return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get country() {return this.checkoutFormGroup.get('shippingAddress.country');}
  get state() {return this.checkoutFormGroup.get('shippingAddress.state');}
  get city() {return this.checkoutFormGroup.get('shippingAddress.city');}
  get street() {return this.checkoutFormGroup.get('shippingAddress.street');}

  get paymentMethod() {return this.checkoutFormGroup.get('payment.paymentMethod');}
  get nameOnCard() {return this.checkoutFormGroup.get('payment.nameOnCard');}
  get cardNumber() {return this.checkoutFormGroup.get('payment.cardNumber');}
  get expiryDate() {return this.checkoutFormGroup.get('payment.expiryDate');}
  get securityCode() {return this.checkoutFormGroup.get('payment.securityCode');}

}
