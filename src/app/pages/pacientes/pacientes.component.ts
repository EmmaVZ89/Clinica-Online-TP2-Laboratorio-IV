import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit {
  spinner: boolean = false;
  user: any = null;
  usersList: any[] = [];

  pacientesAtendidos: any[] = [];

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  historialClinicoDelEspecialista: any[] = [];
  hayPacientesAtendidos: boolean = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      this.spinner = false;
      if (user) {
        this.user = user;
        this.authService.isLogged = true;
      }
      this.authService.getUsers().subscribe((users) => {
        if (users) {
          this.usersList = users;
        }
        this.authService.getHistorialesClinicos().subscribe((historial) => {
          this.historialClinico = historial;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historial.forEach((h) => {
            for (let i = 0; i < this.usersList.length; i++) {
              const usuario = this.usersList[i];
              if (
                usuario.perfil == 'paciente' &&
                usuario.id == h.paciente.id &&
                this.user.id == h.especialista.id
              ) {
                this.usersList[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.id != usuario.id;
                  }
                );
                this.pacientesAtendidos.push(usuario);
                // console.log(this.usersList[i]);
              }
            }
          });

          this.historialClinicoDelEspecialista = this.historialClinico.filter(
            (h) => {
              return h.especialista.id == user.id;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          for (let i = 0; i < this.pacientesAtendidos.length; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.id == h.paciente.id) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (this.pacientesAtendidos.length == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
        });
      });
    });
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
}
