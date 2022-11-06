import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userLog: any = null;
  formLogin: FormGroup;
  userLogin: User = new User();
  spinner: boolean = false;
  loadedField: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
    }, 1500);
  }

  loginUser() {
    if (this.formLogin.valid) {
      this.spinner = true;
      this.userLogin.email = this.formLogin.getRawValue().email;
      this.userLogin.password = this.formLogin.getRawValue().password;
      this.authService
        .userLogin(this.userLogin.email, this.userLogin.password)
        .then(async (data: any) => {
          setTimeout(() => {
            this.authService.createUserLog(this.userLog);
          }, 3000);
          this.authService.user$.subscribe((user: any) => {
            if (user) {
              if (user.test) {
                if (user.perfil == 'especialista' && user.aprobado == false) {
                  this.notificationService.showWarning(
                    'Tu Cuenta no esta aprobada por un Administrador',
                    'Inicio de Sesión'
                  );
                  this.spinner = false;
                  this.authService.userLogout();
                } else {
                  this.authService.isLogged = true;
                  // this.notificationService.showSuccess(
                  //   'Inicio exitoso, redirigiendo...',
                  //   'Inicio de Sesión'
                  // );
                  // this.authService.createUserLog(user);
                  this.userLog = user;
                  this.spinner = false;
                  this.router.navigate(['']);
                }
              } else {
                if (!data?.user?.emailVerified) {
                  data?.user?.sendEmailVerification();
                  this.notificationService.showWarning(
                    'Debes verificar tu email!',
                    'Inicio de Sesión'
                  );
                  this.spinner = false;
                  this.authService.userLogout();
                } else {
                  if (user.perfil == 'especialista' && user.aprobado == false) {
                    this.notificationService.showWarning(
                      'Tu Cuenta no esta aprobada por un Administrador',
                      'Inicio de Sesión'
                    );
                    this.spinner = false;
                    this.authService.userLogout();
                  } else {
                    this.authService.isLogged = true;
                    // this.notificationService.showSuccess(
                    //   'Inicio exitoso, redirigiendo...',
                    //   'Inicio de Sesión'
                    // );
                    // this.authService.createUserLog(user);
                    this.userLog = user;
                    this.spinner = false;
                    this.router.navigate(['']);
                  }
                }
              }
            }
          });
        })
        .catch((error) => {
          this.spinner = false;
        });
    } else {
      this.notificationService.showWarning(
        'Debes completar todos los campos requeridos',
        'Inicio de Sesión'
      );
    }
  } // end of loginUser

  loadUser(option: number) {
    this.loadedField = true;
    switch (option) {
      case 1:
        this.formLogin.setValue({
          email: 'pacienteTest1@mail.com',
          password: 'pacienteTest1',
        });
        break;
      case 2:
        this.formLogin.setValue({
          email: 'pacienteTest2@mail.com',
          password: 'pacienteTest2',
        });
        break;
      case 3:
        this.formLogin.setValue({
          email: 'pacienteTest3@mail.com',
          password: 'pacienteTest3',
        });
        break;
      case 4:
        this.formLogin.setValue({
          email: 'especialistaTest1@mail.com',
          password: 'especialistaTest1',
        });
        break;
      case 5:
        this.formLogin.setValue({
          email: 'especialistaTest2@mail.com',
          password: 'especialistaTest2',
        });
        break;
      case 6:
        this.formLogin.setValue({
          email: 'adminTest1@mail.com',
          password: 'adminTest1',
        });
        break;
    }
    this.notificationService.showInfo(
      'Usurario cargado, puedes iniciar sesión!',
      'Inicio de Sesión'
    );
    setTimeout(() => {
      this.loadedField = false;
    }, 1000);
  } // end of loadUser
}
