import { Component, OnInit } from '@angular/core';
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
    public navCtrl: NavController,
    private sharedDataService: SharedDataService,
    private http: HttpClient // Agregamos el servicio HttpClient
  ) {}

  GotoRegister() {
    this.navCtrl.navigateForward('/registro');
    this.loginCtrl.dismiss();
  }

  async GotoShop() {
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
              this.sharedDataService.alert('Inicio de sesión','Acceso Concedido', 'Usuario encontrado');

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
              this.sharedDataService.alert('Inicio de sesión','Problemas con el Servidor' ,'Respuesta del servidor incompleta');
            }
          } else {
            this.sharedDataService.alert('Error del Servidor',"Error" ,'Respuesta vacía del servidor');
          }
        },
        (error) => {
          // Manejar errores de la llamada HTTP
          console.error('Error en la llamada HTTP:', error);

          // Mostrar alerta de error
          this.sharedDataService.alert('Error en la llamada HTTP',"Porfavor contactar con el servicio tecnico" ,'Ocurrió un error al intentar iniciar sesión.');
        }
      );
    } else {
      // Mostrar alerta si faltan usuario o contraseña
      this.sharedDataService.alert('Falta de Parametros', 'Atencion' ,'Por favor, ingrese usuario y contraseña.');
    }
  }

  ngOnInit() {}
}
