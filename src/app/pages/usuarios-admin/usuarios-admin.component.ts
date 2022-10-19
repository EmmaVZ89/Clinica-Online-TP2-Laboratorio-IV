import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.scss'],
})
export class UsuariosAdminComponent implements OnInit {
  usersList: any[] = [];
  createrUserMenu: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  spinner: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.authService.getUsers().subscribe((users) => {
      this.spinner = false;
      if (users) {
        this.usersList = users;
      }
    });
  }

  updateUser(user: User, option: number) {
    if (user.perfil == 'especialista') {
      if (option == 1) {
        user.aprobado = true;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Habilitado',
          'Administrador'
        );
      } else if (option == 2) {
        user.aprobado = false;
        this.authService.updateUser(user);
        this.notificationService.showSuccess(
          'Especialista Deshabilitado',
          'Administrador'
        );
      }
    }
  } // end of updateUser

  showCreateUserMenu() {
    this.createrUserMenu = true;
  }

  showUserList() {
    this.createrUserMenu = false;
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToFormAdministrador() {
    this.formAdministrador = true;
  }

  goToRegistro() {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }
}
