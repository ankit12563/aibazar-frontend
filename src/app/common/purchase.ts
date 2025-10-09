// import { Address } from "./address";
// import { Customer } from "./customer";
// import { Order } from "./order";
// import { OrderItem } from "./order-item";

// export class Purchase {

//     customer: Customer;
//     shippingAddress: Address;
//     billingAddress: Address;
//     order: Order;
//     orderItems: OrderItem[];

//     constructor(customer: Customer, shippingAddress: Address, billingAddress: Address, order: Order, orderItems: OrderItem[]) {
//         this.customer = customer;
//         this.shippingAddress = shippingAddress;
//         this.billingAddress = billingAddress;
//         this.order = order;
//         this.orderItems = orderItems;
//     }
    
// }

import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

/**
 * Represents the full purchase request sent to the backend.
 * Includes customer info, addresses, order details, and items.
 */
export class Purchase {
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  order: Order;
  orderItems: OrderItem[];

  constructor(
    customer: Customer,
    shippingAddress: Address,
    billingAddress: Address,
    order: Order,
    orderItems: OrderItem[]
  ) {
    this.customer = customer;
    this.shippingAddress = shippingAddress;
    this.billingAddress = billingAddress;
    this.order = order;
    this.orderItems = orderItems;
  }
}
