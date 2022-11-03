import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss'],
})
export class BienvenidaComponent implements OnInit {
  user: any = null;
  spinner: boolean = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        // console.log(user);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
