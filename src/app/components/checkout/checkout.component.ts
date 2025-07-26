import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')])
        
      })
      , shippingAddress: this.formBuilder.group({
        zipCode: [''],
        country: [''],
        state: [''],
        city: [''],
        street: ['']
      }),
      payment: this.formBuilder.group({
        paymentMethod: [''],
        nameOnCard: [''],
        cardNumber: [''],
        expirydate: [''],
        securityCode: ['']
      }),
    });
    
  }
  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('payment')?.value);
  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstname');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}
  get phoneNumber() {return this.checkoutFormGroup.get('customer.phoneNumber');}

}
