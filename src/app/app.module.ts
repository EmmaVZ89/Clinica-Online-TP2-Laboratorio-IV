import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormAltaPacienteComponent } from './components/form-alta-paciente/form-alta-paciente.component';
import { FormAltaEspecialistaComponent } from './components/form-alta-especialista/form-alta-especialista.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { UsuariosAdminComponent } from './pages/usuarios-admin/usuarios-admin.component';
import { FormAltaAdministradorComponent } from './components/form-alta-administrador/form-alta-administrador.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { DatePipe } from './pipes/date.pipe';
import { DayDatePipe } from './pipes/day-date.pipe';
import { TurnosComponent } from './pages/turnos/turnos.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { InformesComponent } from './pages/informes/informes.component';
import { DayWithHourPipe } from './pipes/day-with-hour.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent,
    UsuariosAdminComponent,
    FormAltaAdministradorComponent,
    MiPerfilComponent,
    SolicitarTurnoComponent,
    DatePipe,
    DayDatePipe,
    TurnosComponent,
    MisTurnosComponent,
    PacientesComponent,
    InformesComponent,
    DayWithHourPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
