import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[] = []; // Array to hold product categories

  constructor(private productService: ProductService) { } // Inject ProductService to fetch product categories

  ngOnInit() {                    // Lifecycle hook that is called after the component has been initialized
    this.listProductCategories(); // Call the method to fetch product categories
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe( // Subscribe to the observable returned by getProductCategories method
      data => {
        console.log("Product Categories: " + JSON.stringify(data)); // Log the fetched product categories
        this.productCategories = data;

      }
    );
  }
}
