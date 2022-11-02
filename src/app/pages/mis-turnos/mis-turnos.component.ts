import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss'],
})
export class MisTurnosComponent implements OnInit {
  user: any = null;
  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  spinner: boolean = false;
  turnList: any[] = [];
  currentSpecialistTurnList: any[] = [];

  botonesEspecialidad: boolean = false;
  filtroEspecialidad: boolean = false;
  btnClinico: boolean = false;
  btnOdontologo: boolean = false;
  btnOftalmologo: boolean = false;
  listaPorEspecialidad: any[] = [];

  vistaListadoDeEspecialistas: boolean = false;
  listaDeEspecialistas: any[] = [];
  listaPorEspecialista: any[] = [];

  cancelacionTurno: boolean = false;
  comentarioCancelacion: string = '';
  turnoACancelar: any = {};

  turnosDelPaciente: any[] = [];
  turnosDelEspecialista: any[] = [];
  pacientesDelEspecialista: any[] = [];
  auxPacientesDelEspecialista: any[] = [];

  vistaComentario: boolean = false;
  turnoACalificar: any = {};
  vistaComentarioCalificacion: boolean = false;
  comentarioCalificacion: string = '';

  botonCancelar: boolean = true;
  botonRechazar: boolean = true;
  confirmacionRechazo: boolean = false;
  confirmacionFinalizacion: boolean = false;
  comentarioFinalizacion: string = '';
  turnoAFinalizar: any = {};

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;
        } else {
          this.isEspecialista = true;
        }

        this.authService.getTurnList().subscribe((turns: any) => {
          this.currentSpecialistTurnList = turns;
          this.turnList = [];
          this.turnosDelPaciente = [];
          this.turnosDelEspecialista = [];
          this.pacientesDelEspecialista = [];
          this.auxPacientesDelEspecialista = [];
          for (let i = 0; i < turns.length; i++) {
            const turnSpecialist = turns[i].turnos;
            for (let j = 0; j < turnSpecialist.length; j++) {
              const turn = turnSpecialist[j];
              if (turn.estado != 'disponible') {
                this.turnList.push(turn);
                if (turn.paciente.id == this.user.id) {
                  this.turnosDelPaciente.push(turn);
                }
                if (turn.especialista.id == this.user.id) {
                  this.turnosDelEspecialista.push(turn);
                  this.auxPacientesDelEspecialista.push(turn.paciente);
                }
              }
            }
          }

          for (let i = 0; i < this.auxPacientesDelEspecialista.length; i++) {
            const paciente = this.auxPacientesDelEspecialista[i];
            const index = this.pacientesDelEspecialista.findIndex((p) => {
              return paciente.id == p.id;
            });
            if (index == -1) {
              this.pacientesDelEspecialista.push(paciente);
            }
          }
          // console.log(this.pacientesDelEspecialista);
          // console.log(this.turnosDelEspecialista);
          // console.log(this.turnosDelPaciente);
          // console.log(this.turnList);
        });
      }
    });

    this.authService.getUsers().subscribe((users) => {
      this.spinner = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u) => u.perfil == 'especialista' && u.aprobado
        );
        console.log(this.listaDeEspecialistas);
      }
    });
  }

  verBotonesEspecialidades() {
    this.botonesEspecialidad = !this.botonesEspecialidad;
    this.btnClinico = false;
    this.btnOdontologo = false;
    this.btnOftalmologo = false;
    this.vistaListadoDeEspecialistas = false;
    this.filtroEspecialidad = false;
  }

  filtrarPorEspecialidad(especialidad: string) {
    this.spinner = true;
    setTimeout(() => {
      this.activarBoton(especialidad);
      this.spinner = false;
      this.listaPorEspecialidad = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelPaciente.length; i++) {
        const turno = this.turnosDelPaciente[i];
        if (turno.especialidad == especialidad) {
          this.listaPorEspecialidad.push(turno);
        }
      }
    }, 500);
  }

  filtrarPorEspecialidadDelEspecialista(especialidad: string) {
    this.spinner = true;
    setTimeout(() => {
      this.activarBoton(especialidad);
      this.spinner = false;
      this.listaPorEspecialidad = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        if (turno.especialidad == especialidad) {
          this.listaPorEspecialidad.push(turno);
        }
      }
    }, 500);
  }

  activarBoton(especialidad: string) {
    switch (especialidad) {
      case 'clinico':
        this.btnClinico = true;
        this.btnOdontologo = false;
        this.btnOftalmologo = false;
        break;
      case 'odontologo':
        this.btnClinico = false;
        this.btnOdontologo = true;
        this.btnOftalmologo = false;
        break;
      case 'oftalmologo':
        this.btnClinico = false;
        this.btnOdontologo = false;
        this.btnOftalmologo = true;
        break;
    }
  }

  verListaDeEspecialistas() {
    this.vistaListadoDeEspecialistas = !this.vistaListadoDeEspecialistas;
    this.listaPorEspecialista = [...this.turnosDelPaciente];
    this.botonesEspecialidad = false;
    this.btnClinico = false;
    this.btnOdontologo = false;
    this.btnOftalmologo = false;
    this.filtroEspecialidad = false;
  }

  elegirEspecialista(especialista: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.listaPorEspecialista = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelPaciente.length; i++) {
        const turno = this.turnosDelPaciente[i];
        if (turno.especialista.id == especialista.id) {
          this.listaPorEspecialista.push(turno);
        }
      }
    }, 500);
  }

  verListaDePacientes() {
    this.vistaListadoDeEspecialistas = !this.vistaListadoDeEspecialistas;
    this.listaPorEspecialista = [...this.turnosDelEspecialista];
    this.botonesEspecialidad = false;
    this.filtroEspecialidad = false;
  }

  elegirPaciente(paciente: any) {
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.listaPorEspecialista = [];
      this.filtroEspecialidad = true;
      for (let i = 0; i < this.turnosDelEspecialista.length; i++) {
        const turno = this.turnosDelEspecialista[i];
        if (turno.paciente.id == paciente.id) {
          this.listaPorEspecialista.push(turno);
        }
      }
    }, 500);
  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentarioPaciente = this.comentarioCancelacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
              new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.authService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }

  cancelarTurnoEspecialista(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.botonRechazar = !this.botonRechazar;
    this.confirmacionFinalizacion = false;
    console.log(turno);
  }

  confirmarCancelacionRechazoEspecialista(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación o rechazo',
        'Turnos'
      );
    } else {
      if (this.botonCancelar) {
        turno.estado = 'cancelado';
      } else {
        turno.estado = 'rechazado';
      }
      turno.comentario = this.comentarioCancelacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
              new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.authService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACancelar = {};
        this.cancelacionTurno = false;
        this.confirmacionRechazo = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }

  calificarTurno(turno: any) {
    this.turnoACalificar = { ...turno };
    this.vistaComentarioCalificacion = true;
    this.vistaComentario = false;
    this.confirmacionFinalizacion = false;
  }

  confirmarCalificacion(turno: any) {
    if (this.comentarioCalificacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario para calificar.',
        'Turnos'
      );
    } else {
      turno.comentarioPaciente = this.comentarioCalificacion;
      for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
        const turnosEspecialista = this.currentSpecialistTurnList[i];
        const index = turnosEspecialista.turnos.findIndex((t: any) => {
          return (
            new Date(t.fecha.seconds * 1000).getTime() ==
              new Date(turno.fecha.seconds * 1000).getTime() &&
            t.especialidad == turno.especialidad
          );
        });
        turnosEspecialista.turnos[index] = turno;
        this.authService.updateTurnList(turnosEspecialista);
      }

      this.spinner = true;
      setTimeout(() => {
        this.spinner = false;
        this.turnoACalificar = {};
        this.vistaComentarioCalificacion = false;
        this.confirmacionFinalizacion = false;
        this.notificationService.showSuccess('Turno Calificado', 'Turnos');
      }, 1000);
    }
  }

  verComentario(turno: any) {
    this.turnoACancelar = { ...turno };
    this.vistaComentario = true;
    this.cancelacionTurno = false;
    this.vistaComentarioCalificacion = false;
    this.botonCancelar = true;
    this.confirmacionFinalizacion = false;
  }

  rechazarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.botonCancelar = !this.botonCancelar;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;
    this.cancelacionTurno = true;
    this.confirmacionRechazo = true;
    this.confirmacionFinalizacion = false;
  }

  aceptarTurno(turno: any) {
    turno.estado = 'aceptado';
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.authService.updateTurnList(turnosEspecialista);
    }

    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.vistaComentario = false;
      this.vistaComentarioCalificacion = false;
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess('Turno Aceptado', 'Turnos');
    }, 1000);
  }

  finalizarTurno(turno: any) {
    this.turnoAFinalizar = { ...turno };
    this.confirmacionFinalizacion = true;
    this.vistaComentario = false;
    this.vistaComentarioCalificacion = false;    
  }

  confirmarFinalizacion(turno:any){
    turno.estado = "realizado"
    turno.comentario = this.comentarioFinalizacion;
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
            new Date(turno.fecha.seconds * 1000).getTime() &&
          t.especialidad == turno.especialidad
        );
      });
      turnosEspecialista.turnos[index] = turno;
      this.authService.updateTurnList(turnosEspecialista);
    }

    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.turnoACancelar = {};
      this.cancelacionTurno = false;
      this.confirmacionRechazo = false;
      this.confirmacionFinalizacion = false;
      this.notificationService.showSuccess('Turno Finalizado', 'Turnos');
    }, 1000);
  }
}