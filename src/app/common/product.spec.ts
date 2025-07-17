import { Product } from './product';

describe('Product', () => {
  it('should create an instance', () => {
    return expect(new Product(
      'sku', 
      'name', 
      'description', 
      100, 
      'imageUrl', 
      true, 
      10, 
      new Date(), 
      new Date()
    )).toBeTruthy();
  });
});
