import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
        firstName: [''],
        middleName: [''],
        lastName: [''],
        birthDate: [''],
        age: [''],
        sex: [''],
        email: [''],
        phoneNumber: [''],
        
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
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup.get('payment')?.value);
  }

}
