import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []; // Array to hold cart items

  totalPrice: Subject<number> = new Subject<number>(); // Subject to emit total price changes
  totalQuantity: Subject<number> = new Subject<number>(); // Subject to emit total quantity changes

  constructor() { }

  addToCart(theCartItem: CartItem) {
    // Check if the item already exists in the cart
    let alreadyExistsIncart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined; // Variable to hold the existing cart item if found

    if (this.cartItems.length > 0) {
      // Find the item in the cart
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem; // Found the item
          break; // Exit loop since we found the item
        }
      }
      // using .find() method to simplify the search 
      // existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    }

    // check if we found it
    alreadyExistsIncart = (existingCartItem != undefined);

    if (alreadyExistsIncart) {
      // Increment the quantity of the existing item
      existingCartItem!.quantity++; // Use non-null assertion operator to tell TypeScript that existingCartItem is not undefined
    }
    else {
      // Add the new item to the cart
      this.cartItems.push(theCartItem); // Add the new cart item to the cart items array
    }
    // Emit the total price and quantity
    this.computeCartTotals();

  }
  computeCartTotals() {

    let totalPriceValue: number = 0; //initialize total price
    let totalQuantityValue: number = 0; //initialize total quantity

    // Loop through cart items to calculate total price and quantity
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity; // Calculate total price
      totalQuantityValue += currentCartItem.quantity; // Calculate total quantity
    }
    // Emit the total price and quantity
    this.totalPrice.next(totalPriceValue); // Emit the total price
    this.totalQuantity.next(totalQuantityValue); // Emit the total quantity

  }

  decrementQuantity(theCartItem: CartItem) {
    if (theCartItem.quantity === 1) {
      const confirmDelete = window.confirm('Quantity is 1. Do you want to remove this item from the cart?');
      if (confirmDelete) {
        this.remove(theCartItem, false); // false = skip confirmation
      }
    } else {
      theCartItem.quantity--;
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem, confirm: boolean = true) {
    if (confirm) {
      const confirmDelete = window.confirm('Are you sure you want to delete this item?');
      if (!confirmDelete) {
        return;
      }
    }

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id); // Find the index of the item to remove
    // If the item exists in the cart, remove it
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
