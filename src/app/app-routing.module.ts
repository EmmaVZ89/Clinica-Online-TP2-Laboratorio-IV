import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { InformesComponent } from './pages/informes/informes.component';
import { LoginComponent } from './pages/login/login.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { RegisterComponent } from './pages/register/register.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { UsuariosAdminComponent } from './pages/usuarios-admin/usuarios-admin.component';

const routes: Routes = [
  { path: 'registro', component: RegisterComponent, data: { animation: 'Registro' } },
  { path: 'login', component: LoginComponent, data: { animation: 'Login' } },
  { path: 'usuarios-admin', component: UsuariosAdminComponent },
  { path: 'mi-perfil', component: MiPerfilComponent },
  { path: 'solicitar-turno', component: SolicitarTurnoComponent },
  { path: 'turnos', component: TurnosComponent },
  { path: 'mis-turnos', component: MisTurnosComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'informes', component: InformesComponent },
  { path: '', component: BienvenidaComponent, data: { animation: 'Home' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
