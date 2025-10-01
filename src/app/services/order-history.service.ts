import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { OrderItem } from '../common/order-item';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = `${environment.apiUrl}/orders`;

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    // need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmail?email=${theEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
  getOrderItems(orderId: number): Observable<GetResponseOrderItems> {
  const orderItemsUrl = `${this.orderUrl}/${orderId}/orderItems`;
  return this.httpClient.get<GetResponseOrderItems>(orderItemsUrl);
}
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  }
}
interface GetResponseOrderItems {
  _embedded: {
    orderItems: OrderItem[];
  };
}