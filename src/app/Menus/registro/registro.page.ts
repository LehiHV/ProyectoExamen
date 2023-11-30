  import { Component } from '@angular/core';
  import { NavController, AlertController } from '@ionic/angular';
  import { SharedDataService } from '../../shared-data.service';
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
      public sharedDataService: SharedDataService,
      private http: HttpClient
    ) { }

    GotoLogin() {
      this.navCtrl.navigateForward('/login');
    }
    

    Register() {
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
              this.sharedDataService.alert('Registro',"Registro Exitoso", response.message);
            } else {
              // Mensaje de error del servidor
              this.sharedDataService.alert('Registro',"Error al Registrar" ,response.message);
            }
          },
          (error) => {
            console.error('Error en la llamada HTTP:', error);
            this.sharedDataService.alert('Registro',"Error en el Servidor" ,'Ocurrió un error al intentar registrar.');
          }
        );
      } else {
        this.sharedDataService.alert('Registro',"Porfavor de completar los datos" ,'Por favor, complete todos los campos.');
      }
    }
  }
