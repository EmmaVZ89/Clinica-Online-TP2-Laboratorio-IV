import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  hayHistorial: boolean = false;

  listaTurnos: any[] = [];

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
      this.authService.getHistorialesClinicos().subscribe((historial) => {
        this.historialClinico = historial;
        historial.forEach((h) => {
          for (let i = 0; i < this.usersList.length; i++) {
            const usuario = this.usersList[i];
            if (usuario.perfil == 'paciente' && usuario.id == h.paciente.id) {
              this.usersList[i].historial = true;
              // console.log(this.usersList[i]);
            }
          }
        });
      });
      this.authService.getTurnList().subscribe((turnos: any) => {
        this.listaTurnos = [];
        for (let i = 0; i < turnos.length; i++) {
          const turnoEspecialista = turnos[i].turnos;
          for (let j = 0; j < turnoEspecialista.length; j++) {
            const t = turnoEspecialista[j];
            this.listaTurnos.push(t);
          }
        }
        // console.log(this.listaTurnos);
      });
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

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.id == paciente.id) {
        this.historialActivo.push(historial);
      }
    }
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  descargarExcel() {
    this.exportAsExcelFile(this.usersList, 'listadoUsuarios');
    this.notificationService.showSuccess(
      'Listado de Usuarios descargado',
      'Usuarios'
    );
  }

  verTurnosUsuario(usuario: any) {
    const listaTurnosUsuario: any[] = [];
    if (usuario.perfil == 'paciente') {
      this.listaTurnos.forEach((t: any) => {
        if (usuario.id == t?.paciente?.id) {
          const turno: any = {};
          turno.nombrePaciente = usuario.nombre;
          turno.apellidoPaciente = usuario.apellido;
          turno.fecha = new Date(t.fecha.seconds * 1000);
          turno.especialidad = t.especialidad;
          turno.nombreEspecialista = t.especialista.nombre;
          turno.apellidoEspecialista = t.especialista.apellido;
          listaTurnosUsuario.push(turno);
        }
      });
      if (listaTurnosUsuario.length == 0) {
        this.notificationService.showWarning(
          'El PACIENTE no tiene turnos',
          'Usuarios'
        );
      } else {
        this.exportAsExcelFile(listaTurnosUsuario, 'turnosPaciente');
        this.notificationService.showSuccess(
          'Turnos del PACIENTE descargado',
          'Usuarios'
        );
      }
    } else {
      this.notificationService.showWarning(
        'Debes elegir un PACIENTE',
        'Usuarios'
      );
    }
  }
}
