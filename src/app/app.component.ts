import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-ecommerce';

  mobileCategoriesVisible = false;

toggleMobileCategories(): void {
  this.mobileCategoriesVisible = !this.mobileCategoriesVisible;
}
}
