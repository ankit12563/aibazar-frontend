import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1; // Default category ID, can be changed based on routing or user input
  previousCategoryId: number = 1; // Previous category ID to track changes in category selection;
  searchMode: boolean = false; // Flag to indicate if search mode is active

  // new elements for pageination
  thePageNumber: number = 1; // Current page number
  thePageSize: number = 10; // Number of products per page
  theTotalElements: number = 0; // Total number of products available
  


  constructor(private productService: ProductService,
              private cartService: CartService,  // Inject the CartService to manage cart operations
              private route: ActivatedRoute) { } // that loades the component with the product list and
  


  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }

    else {
      this.handleListProducts();
    }

  }

  // Function to handle search products by keyword
  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // If keyword is present, search products by keyword
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  // Function to handle list products by category ID

  handleListProducts() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // Get the category ID from the route parameters
    }
    else {
      this.currentCategoryId = 1; // Default category ID when not specified in the route
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1
    }
    this.previousCategoryId = this.currentCategoryId; // Update the previous category ID to the current one
    console.log(`currentCategoryId=${this.currentCategoryId}, previousCategoryId=${this.previousCategoryId}, thePageNumber=${this.thePageNumber}`);


    this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                              this.thePageSize, 
                                              this.currentCategoryId).subscribe(
                                                data => {
                                                  this.products = data._embedded.products; // Assign the products from the response to the component's products array
                                                  this.thePageNumber = data.page.number + 1; // Update the current page number
                                                  this.thePageSize = data.page.size; // Update the page size
                                                  this.theTotalElements = data.page.totalElements; // Update the total number of elements
                                                });
                                                
     }

    addToCart(theProduct: Product) {
      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
      const theCartItem = new CartItem(theProduct); // Create a new CartItem instance with the selected product
      this.cartService.addToCart(theCartItem); // Add the CartItem to the cart using the CartService
    }
  }



  // handleListProducts() {

  //   const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

  //   if (hasCategoryId) {
  //     this.categoryId = +this.route.snapshot.paramMap.get('id')!;
  //     this.productService.getProductList(this.categoryId).subscribe(data => {
  //       this.products = data;
  //       setTimeout(() => window.scrollTo(0, 0), 50);
  //     });
  //   } else {
  //     // When no category id in route, load all products for homepage
  //     this.productService.getAllProducts().subscribe(
  //       data => {
  //         this.products = data; // Load all products when no category ID is present
  //         this.products = this.shuffleArray(data); // Uncomment to shuffle products randomly
  //         setTimeout(() => window.scrollTo(0, 0), 50);
  //       });
  //   }

  // }

  // //Function to show product randomly in the product list
  // shuffleArray(array: Product[]): Product[] { // Function to shuffle the array of products
  //   for (let i = array.length - 1; i > 0; i--) { // Loop through the array from the last element to the first
  //     const j = Math.floor(Math.random() * (i + 1));// Generate a random index from 0 to i
  //     [array[i], array[j]] = [array[j], array[i]]; // Swap the elements at indices i and j
  //   }
  //   return array;
  // }