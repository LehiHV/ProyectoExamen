import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  contrasena: string = '';

  constructor(
    public loginCtrl: ModalController,
    public alertController: AlertController,
    public navCtrl: NavController,
    private sharedDataService: SharedDataService,
    private http: HttpClient // Agregamos el servicio HttpClient
  ) {}

  irPagina2() {
    this.navCtrl.navigateForward('/registro');
    this.loginCtrl.dismiss();
  }

  async entrar() {
    if (this.usuario && this.contrasena) {
      // Realizar la llamada HTTP
      const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_USUARIOS.php';
      const params = {
        comando: 'Login',
        Nombre: this.usuario,
        Contrasena: this.contrasena,
      };

      this.http.get<any>(url, { params }).subscribe(
        (response) => {
          // Verificar la respuesta del servidor
          if (response) {
            const { Id, Nombre, Contrasena, Nombre_Tienda, Logo, Clientes } = response;

            if (Id && Nombre && Contrasena && Nombre_Tienda && Logo) {
              this.mostrarAlerta('Inicio de sesión', 'Usuario encontrado');

              // Almacenar datos en el servicio
              this.sharedDataService.userData = {
                Id,
                Nombre,
                Contrasena,
                Nombre_Tienda,
                Logo
              };

              // Navegar a la página de tienda
              this.navCtrl.navigateForward('/tienda');
              this.loginCtrl.dismiss();
            } else {
              this.mostrarAlerta('Inicio de sesión', 'Respuesta del servidor incompleta');
            }
          } else {
            this.mostrarAlerta('Error', 'Respuesta vacía del servidor');
          }
        },
        (error) => {
          // Manejar errores de la llamada HTTP
          console.error('Error en la llamada HTTP:', error);

          // Mostrar alerta de error
          this.mostrarAlerta('Error', 'Ocurrió un error al intentar iniciar sesión.');
        }
      );
    } else {
      // Mostrar alerta si faltan usuario o contraseña
      this.mostrarAlerta('Alerta', 'Por favor, ingrese usuario y contraseña.');
    }
  }
  
  
  

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: 'Inicio de sesión',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ngOnInit() {}
}
