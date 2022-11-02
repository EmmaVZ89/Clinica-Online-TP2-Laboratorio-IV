import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss'],
})
export class TurnosComponent implements OnInit {
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

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.getTurnList().subscribe((turns: any) => {
      this.currentSpecialistTurnList = turns;
      this.turnList = [];
      for (let i = 0; i < turns.length; i++) {
        const turnSpecialist = turns[i].turnos;
        for (let j = 0; j < turnSpecialist.length; j++) {
          const turn = turnSpecialist[j];
          if (turn.estado != 'disponible') {
            this.turnList.push(turn);
          }
        }
      }
      // console.log(this.turnList);
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
      for (let i = 0; i < this.turnList.length; i++) {
        const turno = this.turnList[i];
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
    this.listaPorEspecialista = [...this.turnList];
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
      for (let i = 0; i < this.turnList.length; i++) {
        const turno = this.turnList[i];
        if (turno.especialista.id == especialista.id) {
          this.listaPorEspecialista.push(turno);
        }
      }
    }, 500);
  }

  cancelarTurno(turno: any) {
    this.turnoACancelar = { ...turno };
    this.cancelacionTurno = true;
    console.log(turno);
  }

  confirmarCancelacion(turno: any) {
    if (this.comentarioCancelacion == '') {
      this.notificationService.showWarning(
        'Debes ingresar un comentario sobre la razón de la cancelación',
        'Turnos'
      );
    } else {
      turno.estado = 'cancelado';
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
        this.notificationService.showSuccess('Turno Cancelado', 'Turnos');
      }, 1000);
    }
  }
}
