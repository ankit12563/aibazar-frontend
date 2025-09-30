import { Component } from '@angular/core';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent {

  orderHistoryList: OrderHistory[] = [];
  expandedOrderId: number | null = null;
  orderItemsMap: Map<number, any[]> = new Map(); // Map to store order items by order ID
  currencyPipe: CurrencyPipe = new CurrencyPipe('en-US'); //
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    // retrieve data from the service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      (data:any) => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }

    toggleDetails(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null; // collapse
    } else {
      this.expandedOrderId = orderId;

      if (!this.orderItemsMap.has(orderId)) {
        this.orderHistoryService.getOrderItems(orderId).subscribe(data => {
          this.orderItemsMap.set(orderId, data._embedded.orderItems);
        });
      }
    }
  }

}