// import { Component } from '@angular/core';
// import { OrderHistory } from '../../common/order-history';
// import { OrderHistoryService } from '../../services/order-history.service';
// import { CurrencyPipe } from '@angular/common';

// @Component({
//   selector: 'app-order-history',
//   standalone: false,
//   templateUrl: './order-history.component.html',
//   styleUrl: './order-history.component.css',
// })
// export class OrderHistoryComponent {

//   orderHistoryList: OrderHistory[] = [];
//   expandedOrderId: number | null = null;
//   orderItemsMap: Map<number, any[]> = new Map(); // Map to store order items by order ID
//   currencyPipe: CurrencyPipe = new CurrencyPipe('en-US'); //
//   storage: Storage = sessionStorage;

//   constructor(private orderHistoryService: OrderHistoryService) { }

//   ngOnInit(): void {
//     this.handleOrderHistory();
//   }

//   handleOrderHistory() {

//     // read the user's email address from browser storage
//     const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

//     // retrieve data from the service
//     this.orderHistoryService.getOrderHistory(theEmail).subscribe(
//       (data:any) => {
//         this.orderHistoryList = data._embedded.orders;
//       }
//     );
//   }

//     toggleDetails(orderId: number) {
//     if (this.expandedOrderId === orderId) {
//       this.expandedOrderId = null; // collapse
//     } else {
//       this.expandedOrderId = orderId;

//       if (!this.orderItemsMap.has(orderId)) {
//         this.orderHistoryService.getOrderItems(orderId).subscribe(data => {
//           this.orderItemsMap.set(orderId, data._embedded.orderItems);
//         });
//       }
//     }
//   }

// }

import { Component, OnInit } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderItem } from '../../common/order-item';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  expandedOrderId: number | null = null;
  orderItemsMap: Map<number, OrderItem[]> = new Map();
  currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
  userEmail: string = '';
  storage: Storage = sessionStorage;

  constructor(
    private orderHistoryService: OrderHistoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Try to get the logged-in Auth0 user's email
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.userEmail = user.email;
        this.storage.setItem('userEmail', JSON.stringify(this.userEmail)); // store in sessionStorage
        console.log('✅ Logged-in email:', this.userEmail);
        this.handleOrderHistory(this.userEmail);
      } else {
        // fallback: if already stored in sessionStorage
        const storedEmail = JSON.parse(this.storage.getItem('userEmail') || 'null');
        if (storedEmail) {
          this.userEmail = storedEmail;
          console.log('📦 Using stored email:', this.userEmail);
          this.handleOrderHistory(this.userEmail);
        } else {
          console.warn('⚠️ No email found in Auth0 or sessionStorage');
        }
      }
    });
  }

  // ✅ Load orders for this user's email
  handleOrderHistory(theEmail: string) {
    this.orderHistoryService.getOrderHistory(theEmail).subscribe({
      next: (data: any) => {
        this.orderHistoryList = data._embedded.orders;
        console.log('📦 Orders fetched:', this.orderHistoryList);
      },
      error: (err) => {
        console.error('❌ Failed to load orders:', err);
      }
    });
  }

  // ✅ Toggle and fetch order items
  toggleDetails(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;

      if (!this.orderItemsMap.has(orderId)) {
        this.orderHistoryService.getOrderItems(orderId).subscribe({
          next: (data: any) => {
            this.orderItemsMap.set(orderId, data._embedded.orderItems);
            console.log(`🧾 Items for order ${orderId}:`, data._embedded.orderItems);
          },
          error: (err) => {
            console.error(`❌ Error loading order ${orderId} items:`, err);
          }
        });
      }
    }
  }
}
