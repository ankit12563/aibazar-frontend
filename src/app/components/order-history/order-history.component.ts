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
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  orderItemsMap: Map<number, OrderItem[]> = new Map();
  expandedOrderId: number | null = null;
  userEmail: string = '';

  constructor(
    private orderHistoryService: OrderHistoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (user && user.email) {
        this.userEmail = user.email;
        console.log('✅ Logged in as:', this.userEmail);
        this.loadOrderHistory();
      } else {
        console.warn('⚠️ No Auth0 user email found');
      }
    });
  }

  loadOrderHistory() {
    if (!this.userEmail) return;

    this.orderHistoryService.getOrderHistory(this.userEmail).subscribe({
      next: (response) => {
        this.orderHistoryList = response._embedded?.orders || [];
        console.log('📦 Orders:', this.orderHistoryList);

        this.orderHistoryList.forEach(order => {
          this.orderHistoryService.getOrderItems(Number(order.id)).subscribe(itemRes => {

            this.orderItemsMap.set(Number(order.id), itemRes._embedded?.orderItems || []);
          });
        });
      },
      error: (err) => {
        console.error('❌ Failed to fetch order history:', err);
      }
    });
  }

  toggleOrderDetails(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }
}
