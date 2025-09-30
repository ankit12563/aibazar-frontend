import { OrderHistory } from './order-history';

describe('OrderHistory', () => {
  it('should create an instance', () => {
    expect(new OrderHistory(
      'id123',
      'TRACK123',
      100.0,
      2,
      new Date()
    )).toBeTruthy();
  });
});