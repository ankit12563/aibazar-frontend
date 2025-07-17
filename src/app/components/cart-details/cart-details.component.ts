import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css'
})
export class CartDetailsComponent implements OnInit{ 

  cartItems: CartItem[] = [];
  totalPrice:number = 0;
  totalQuantity: number = 0;

  constructor(private cartServive: CartService){}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    //get a handle to the cart items
    this.cartItems = this.cartServive.cartItems;

    // subscribe to the cart items Observable
    this.cartServive.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // get the total price and total quantity
    this.cartServive.totalQuantity.subscribe (
      data => this.totalQuantity = data
    );

    // assign the cart items to the local cartItems array
    this.cartServive.computeCartTotals();
  }

  increamentQuantity(theCartItem: CartItem) {
    this.cartServive.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartServive.decrementQuantity(theCartItem)
  }

  removeItem(theCartItem: CartItem) {
    this.cartServive.remove(theCartItem);
  }
}
