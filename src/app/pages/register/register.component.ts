import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  spinner: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToRegistro() {
    this.formPaciente = false;
    this.formEspecialista = false;
  }
}
