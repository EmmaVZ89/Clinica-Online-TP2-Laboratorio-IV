import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
// import firebase from 'firebase/compat/app';
import * as firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: any;
  isAdmin: boolean = false;
  isLogged: boolean = false;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private notifyService: NotificationService,
    private router: Router
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user: any) => {
        if (user) {
          return this.angularFirestore
            .doc<User>(`usuarios/${user.uid}`)
            .valueChanges();
        } else {
          return of(null);
        }
      })
    );
  } // end of constructor

  registerNewUser(newUser: User) {
    this.angularFireAuth
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then((data) => {
        data.user?.sendEmailVerification();
        this.angularFirestore
          .collection('usuarios')
          .doc(data.user?.uid)
          .set({
            id: data.user?.uid,
            perfil: newUser.perfil,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            edad: newUser.edad,
            dni: newUser.dni,
            obraSocial: newUser.obraSocial,
            especialidad: newUser.especialidad,
            email: newUser.email,
            password: newUser.password,
            imagen1: newUser.imagen1,
            imagen2: newUser.imagen2,
            aprobado: newUser.aprobado,
          })
          .then(() => {
            this.notifyService.showInfo(
              'Verifica tu email',
              'Registro exitoso'
            );
            // this.userLogout();
          })
          .catch((error) => {
            this.notifyService.showError(
              this.createMessage(error.code),
              'Error'
            );
          });
      })
      .catch((error) => {
        this.notifyService.showError(this.createMessage(error.code), 'Error');
      });
  } // end of registerNewUser

  updateUser(userMod: any) {
    this.angularFirestore
      .doc<any>(`usuarios/${userMod.id}`)
      .update(userMod)
      .then(() => {})
      .catch((error) => {
        this.notifyService.showError('Ocurrio un error', 'Administrador');
      });
  } // end of updateUser

  async userLogin(email: string, password: string) {
    try {
      return await this.angularFireAuth.signInWithEmailAndPassword(
        email,
        password
      );
    } catch (error: any) {
      console.log(error.code);
      this.notifyService.showError(
        'Email y/o contraseña invalidos',
        'Inicio fallido'
      );

      throw error;

      return null;
    }
  } // end of userLogin

  userLogout() {
    this.isAdmin = false;
    this.isLogged = false;
    this.angularFireAuth.signOut();
  } // end of logout

  createUserLog(collectionName: string, log: any) {
    return this.angularFirestore.collection(collectionName).add(log);
  } // end of createUserLog

  createTurnList(turn: any) {
    console.log('Entra al create');
    this.angularFirestore
      .collection<any>('turnos')
      .add(turn)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turn.especialista,
          turnos: turn.turnos,
        });
      });
  }

  updateTurnList(turn: any) {
    console.log('Entra al update');
    this.angularFirestore
      .doc<any>(`turnos/${turn.id}`)
      .update(turn)
      .then(() => {})
      .catch((error) => {
        console.log(error.message);
        this.notifyService.showError('Ocurrio un error', 'Administrador');
      });
  }

  getTurnList() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }

  private createMessage(errorCode: string): string {
    let message: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        message = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        message = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        message = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = 'Error al crear el usuario.';
        break;
    }

    return message;
  } // end of createMessage

  getUserLogged() {
    return this.angularFireAuth.authState;
  } // end of getUserLogged

  getUsers() {
    const collection = this.angularFirestore.collection<any>('usuarios');
    return collection.valueChanges();
  } // end of getUsers

  getCollection(collectionName: string) {
    const collection = this.angularFirestore.collection<any>(collectionName);
    return collection.valueChanges();
  } // end of getCollection
}
