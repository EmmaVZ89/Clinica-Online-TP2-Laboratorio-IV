import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss'],
})
export class SolicitarTurnoComponent implements OnInit {
  user: any = null;
  isPaciente: boolean = false;
  spinner: boolean = false;

  especialistasList: any[] = [];
  pacientesList: any[] = [];
  activeEspecialista: any = null;
  activePaciente: any = null;
  speciality: any = null;
  specialistSelectionMenu: boolean = true;
  patientSelectionMenu: boolean = false;
  turnsSelectionMenu: boolean = false;

  currentSpecialistTurnList: any[] = [];
  turnosAMostrar: any[] = [];
  turnosDeUnDiaAMostrar: any[] = [];
  diasAMostrar: any[] = [];
  botonPedirTurno: boolean = false;
  turnoSeleccionado: any = null;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        // console.log(user);
        this.user = user;
        this.authService.isLogged = true;
        if (this.user.perfil == 'administrador') {
          this.authService.isAdmin = true;
          this.patientSelectionMenu = true;
        } else if (this.user.perfil == 'paciente') {
          this.isPaciente = true;
        } else {
          this.router.navigate(['']);
        }
        this.authService.getUsers().subscribe((users) => {
          this.spinner = false;
          if (users) {
            this.especialistasList = users.filter(
              (u) => u.perfil == 'especialista' && u.aprobado
            );
            this.pacientesList = users.filter((u) => u.perfil == 'paciente');
            // console.log(this.pacientesList);
            // console.log(this.especialistasList);
            this.authService.getTurnList().subscribe((turnosEspecialista) => {
              this.currentSpecialistTurnList = turnosEspecialista;
              // console.log(this.currentSpecialistTurnList);
            });
          }
        });
      }
    });
  }

  showSpeciality(esp: any) {
    this.specialistSelectionMenu = false;
    this.activeEspecialista = esp;
    console.log(esp);
  }

  showPatient(paciente: any) {
    this.patientSelectionMenu = false;
    this.activePaciente = paciente;
    console.log(paciente);
  }

  showTurns(especialidad: any) {
    this.turnsSelectionMenu = true;
    this.speciality = especialidad;
    this.loadFreeHours('');
    this.turnosAMostrar.forEach((t) => {
      this.diasAMostrar.push(t.fecha);
    });

    const aux: any[] = [];
    this.diasAMostrar.forEach((d) => {
      for (let i = 0; i < this.diasAMostrar.length; i++) {
        const fecha = this.diasAMostrar[i];
        if (
          d.getMonth() == fecha.getMonth() &&
          d.getDate() == fecha.getDate()
        ) {
          if (
            !aux.some((a) => {
              return d.getMonth() == a.getMonth() && d.getDate() == a.getDate();
            })
          ) {
            aux.push(d);
          }
        }
      }
    });
    aux.sort((a, b) => a - b);
    this.diasAMostrar = [...aux];
    // this.diasAMostrar.push(this.turnosAMostrar[0].fecha);
    // this.diasAMostrar.push(
    //   this.turnosAMostrar[this.turnosAMostrar.length - 1].fecha
    // );
  }

  loadFreeHours(day: string) {
    // console.log(day);
    const currentDate = new Date();
    const listaTurnosDelEspecialista = this.currentSpecialistTurnList.filter(
      (t) => t.especialista.email == this.activeEspecialista.email
    );
    const turnosEspecialidad =
      // listaTurnosDelEspecialista[0].turnos =
      listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
        return (
          t.especialidad == this.speciality.nombre &&
          currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
        );
      });
    // console.log(listaTurnosDelEspecialista[0].turnos);
    // console.log(turnosEspecialidad);
    const turnos15dias: any[] = [];
    for (let i = 0; i < turnosEspecialidad.length; i++) {
      const turno = { ...turnosEspecialidad[i] };
      if (
        new Date(turno.fecha.seconds * 1000).getTime() <=
          currentDate.getTime() + 84600000 * 15 &&
        turno.estado == 'disponible'
      ) {
        turno.fecha = new Date(turno.fecha.seconds * 1000);
        turnos15dias.push(turno);
      }
    }
    this.turnosAMostrar = [...turnos15dias];
  }

  loadFreeHoursOneDay(date: Date) {
    this.spinner = true;
    this.turnosDeUnDiaAMostrar = [];
    setTimeout(() => {
      const currentDate = new Date();
      const listaTurnosDelEspecialista = this.currentSpecialistTurnList.filter(
        (t) => t.especialista.email == this.activeEspecialista.email
      );
      const turnosEspecialidad =
        // listaTurnosDelEspecialista[0].turnos =
        listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
          return (
            t.especialidad == this.speciality.nombre &&
            currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
          );
        });
      // console.log(listaTurnosDelEspecialista[0].turnos);
      // console.log(turnosEspecialidad);
      const turnosDeUndia: any[] = [];
      for (let i = 0; i < turnosEspecialidad.length; i++) {
        const turno = { ...turnosEspecialidad[i] };
        if (
          new Date(turno.fecha.seconds * 1000).getTime() <=
            currentDate.getTime() + 84600000 * 15 &&
          new Date(turno.fecha.seconds * 1000).getDate() == date.getDate() &&
          turno.estado == 'disponible'
        ) {
          turno.fecha = new Date(turno.fecha.seconds * 1000);
          turnosDeUndia.push(turno);
        }
      }
      this.spinner = false;
      this.turnosDeUnDiaAMostrar = [...turnosDeUndia];
    }, 500);
  }

  seleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.botonPedirTurno = true;
    this.notificationService.showInfo('Turno seleccionado', 'Turnos');
  }

  solicitarTurno() {
    if (this.isPaciente) {
      this.turnoSeleccionado.paciente = this.user;
      this.turnoSeleccionado.estado = 'solicitado';
    } else {
      this.turnoSeleccionado.paciente = this.activePaciente;
      this.turnoSeleccionado.estado = 'solicitado';
    }
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
            this.turnoSeleccionado.fecha.getTime() &&
          t.especialidad == this.turnoSeleccionado.especialidad
        );
      });
      turnosEspecialista.turnos[index] = this.turnoSeleccionado;
      this.authService.updateTurnList(turnosEspecialista);
    }
    this.turnosAMostrar = [];
    this.turnosDeUnDiaAMostrar = [];
    this.botonPedirTurno = false;
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.notificationService.showSuccess('Turno Solicitado', 'Turnos');
      this.loadFreeHours('');
    }, 1000);
  }
}
