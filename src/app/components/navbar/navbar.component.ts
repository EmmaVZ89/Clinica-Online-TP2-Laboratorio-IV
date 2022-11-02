import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;
        } else {
          this.isEspecialista = true;
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/registro']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.userLogout();
    this.user = null;
    this.authService.isLogged = false;
    this.router.navigate(['']);
  }
}
