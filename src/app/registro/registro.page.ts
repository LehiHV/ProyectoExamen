  import { Component } from '@angular/core';
  import { NavController, AlertController } from '@ionic/angular';
  import { HttpClient } from '@angular/common/http';

  @Component({
    selector: 'app-registro',
    templateUrl: './registro.page.html',
    styleUrls: ['./registro.page.scss'],
  })
  export class RegistroPage {

    usuario: string = '';
    contrasena: string = '';
    nombreTienda: string = '';
    logo: string = '';

    constructor(
      public navCtrl: NavController,
      public alertController: AlertController,
      private http: HttpClient
    ) { }

    irPagina1() {
      this.navCtrl.navigateForward('/login');
    }
    isValidUrl(url: string): boolean {
      const urlPattern = /^https?:\/\/.+\..+/i;
      return urlPattern.test(url);
    }

    registrar() {
      if (this.usuario && this.contrasena && this.nombreTienda && this.logo) {
        // Realizar la llamada HTTP para registrar al usuario
        const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_USUARIOS.php'; // Reemplaza con tu URL de registro
        const params = {
          comando: 'Add',
          Nombre: this.usuario,
          Contrasena: this.contrasena,
          Nombre_Tienda: this.nombreTienda,
          Logo: this.logo,
        };

        this.http.get<any>(url, { params }).subscribe(
          (response) => {
            // Verificar la respuesta del servidor
            if (response.message === 'Usuario agregado correctamente') {
              // Registro exitoso, puedes redirigir a la página de inicio de sesión u otra página
              this.navCtrl.navigateForward('/login');
              this.mostrarAlerta('Registro', response.message);
            } else {
              // Mensaje de error del servidor
              this.mostrarAlerta('Registro', response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.mostrarAlerta('Error', 'Ocurrió un error al intentar registrar.');
          }
        );
      } else {
        this.mostrarAlerta('Alerta', 'Por favor, complete todos los campos.');
      }
    }

    async mostrarAlerta(header: string, message: string) {
      const alert = await this.alertController.create({
        header: header,
        subHeader: 'Registro',
        message: message,
        buttons: ['OK']
      });

      await alert.present();
    }
  }
