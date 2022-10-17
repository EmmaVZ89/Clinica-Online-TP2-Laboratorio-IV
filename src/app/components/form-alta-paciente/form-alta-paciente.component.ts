import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-alta-paciente',
  templateUrl: './form-alta-paciente.component.html',
  styleUrls: ['./form-alta-paciente.component.scss'],
})
export class FormAltaPacienteComponent implements OnInit {
  formPaciente: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formPaciente = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      obraSocial: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      imagen1: ['', [Validators.required]],
      imagen2: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  createPaciente(){

  }
}
