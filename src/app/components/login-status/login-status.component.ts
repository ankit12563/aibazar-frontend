import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  standalone: false,
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userEmail: string = '';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    // 🔹 Check login status
    this.auth.isAuthenticated$.subscribe((loggedIn) => {
      this.isAuthenticated = loggedIn;

      if (loggedIn) {
        // 🔹 Get user info (email)
        this.auth.user$.subscribe((user) => {
          this.userEmail = user?.email || 'Unknown User';
        });

        // 🔹 Get access token (debug check)
        this.auth.getAccessTokenSilently().subscribe((token) => {
          console.log('%c🔐 AUTH0 ACCESS TOKEN:', 'color: green; font-weight: bold;');
          console.log(token);
        });
      }
    });
  }

  // 🔹 Login and Logout functions
  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
