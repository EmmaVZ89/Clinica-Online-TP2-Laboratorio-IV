import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-form-alta-administrador',
  templateUrl: './form-alta-administrador.component.html',
  styleUrls: ['./form-alta-administrador.component.scss'],
})
export class FormAltaAdministradorComponent implements OnInit {
  formAdministrador: FormGroup;
  newAdministrador: User = new User();
  especialidad: boolean = false;
  spinner: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private angularFireStorage: AngularFireStorage,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.formAdministrador = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  registerAdministrador() {
    if (this.formAdministrador.valid) {
      if (this.newAdministrador.imagen1 != '') {
        this.spinner = true;
        this.newAdministrador.perfil = 'administrador';
        this.newAdministrador.nombre =
          this.formAdministrador.getRawValue().nombre;
        this.newAdministrador.apellido =
          this.formAdministrador.getRawValue().apellido;
        this.newAdministrador.edad = this.formAdministrador.getRawValue().edad;
        this.newAdministrador.dni = this.formAdministrador.getRawValue().dni;
        this.newAdministrador.email =
          this.formAdministrador.getRawValue().email;
        this.newAdministrador.password =
          this.formAdministrador.getRawValue().password;
        this.authService.registerNewUser(this.newAdministrador);
        setTimeout(() => {
          this.spinner = false;
          this.formAdministrador.reset();
          this.newAdministrador = new User();
        }, 2000);
      } else {
        this.notificationService.showWarning(
          'Debes elegir una im??gen para el perfil',
          'Registro Administrador'
        );
      }
    } else {
      this.notificationService.showWarning(
        'Debes completar todos los campos requeridos',
        'Registro newAdministrador'
      );
    }
  } // end of registerEspecialista

  async uploadImage($event: any) {
    this.spinner = true;
    const file = $event.target.files[0];
    const path = 'img ' + Date.now() + Math.random() * 10;
    const reference = this.angularFireStorage.ref(path);
    await reference.put(file).then(async () => {
      await reference.getDownloadURL().subscribe((urlImg) => {
        this.newAdministrador.imagen1 = urlImg;
        this.spinner = false;
      });
    });
  } // end of uploadImage
}
