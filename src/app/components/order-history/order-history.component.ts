import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderHistory } from '../../common/order-history';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  expandedOrderId: number | null = null;
  orderItemsMap: Map<number, any[]> = new Map();
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory(): void {
    const theEmail = JSON.parse(this.storage.getItem('userEmail') || 'null');
    if (!theEmail) { return; }

    this.orderHistoryService.getOrderHistory(theEmail).subscribe((data: any) => {
      // If the backend sends id as string, normalize it to number here
      this.orderHistoryList = (data._embedded?.orders || []).map((o: any) => ({
        ...o,
        id: this.toNum(o.id),
      }));
    });
  }

  /** Helper usable from the template; safely converts id to number */
  toNum(id: unknown): number {
    if (typeof id === 'number') return id;
    const n = parseInt(String(id), 10);
    return Number.isFinite(n) ? n : 0;
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
      return;
    }

    this.expandedOrderId = orderId;

    if (!this.orderItemsMap.has(orderId)) {
      this.orderHistoryService.getOrderItems(orderId).subscribe((data: any) => {
        this.orderItemsMap.set(orderId, data._embedded?.orderItems || []);
      });
    }
  }
}
