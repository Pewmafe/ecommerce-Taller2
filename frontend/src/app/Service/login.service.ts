import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable()
export class LoginService {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  errorMessage: string;
  logueado: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {}

  loguearUsuario(email: string, contrasenia: string) {
    this.httpClient
      .post<any>(environment.productionUrl + '/usuario/loguear', {
        email: email,
        contrasenia: contrasenia,
      })
      .subscribe({
        next: (datos) => {
          this.accessToken = datos.accessToken.toString();
          this.idToken = datos.idToken;
          this.refreshToken = datos.refreshToken;
          this.logueado = true;
          this.router.navigate(['/home']);

          Swal.fire({
            title: 'Bienvenido!',
            text: '',
            icon: 'success',
            confirmButtonText: 'Cool',
          });
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.logueado = false;

          if (error.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: error.error,
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Usuario o contraseña incorrecta',
              icon: 'error',
              confirmButtonText: 'Cool',
            });
          }
        },
      });
  }

  cerrarSesion() {
    let headers = new HttpHeaders({
      accessToken: this.accessToken,
      idToken: this.idToken,
      refreshToken: this.refreshToken,
    });
    this.httpClient
      .post<any>(environment.productionUrl + '/usuario/desloguear', null, {
        headers: headers,
      })
      .subscribe({
        next: (datos) => {
          this.accessToken = '';
          this.idToken = '';
          this.refreshToken = '';
          this.logueado = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  isLogueado() {
    return this.logueado;
  }
}
