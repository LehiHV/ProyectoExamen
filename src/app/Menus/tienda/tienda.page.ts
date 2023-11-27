import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class TiendaPage implements OnInit {
  id: number=0;
  nombre: string='';
  contrasena: string='';
  nombreTienda: string='';
  logo: string='';

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private sharedDataService : SharedDataService,
    private close : ModalController
    ) {}
    ionViewWillEnter() {
      this.actualizarDatosUsuario();
    }
  
    private actualizarDatosUsuario() {
      const userData = this.sharedDataService.userData;
      this.id = userData.Id;
      this.nombre = userData.Nombre;
      this.contrasena = userData.Contrasena;
      this.nombreTienda = userData.Nombre_Tienda;
      this.logo = userData.Logo;
    }

  confirmarSalir() {
    this.presentarAlerta();
  }
  ngOnInit() {
    // Obtener los parámetros de la URL
    const userData = this.sharedDataService.userData;
    this.id = this.sharedDataService.userData.Id;
    this.nombre = this.sharedDataService.userData.Nombre;
    this.contrasena = this.sharedDataService.userData.Contrasena;
    this.nombreTienda = this.sharedDataService.userData.Nombre_Tienda;
    this.logo = this.sharedDataService.userData.Logo;
  }

  isValidUrl(str: string): boolean {
    // Verificar si la cadena es una URL válida
    try {
      new URL(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  async presentarAlerta() {
    const alert = await this.alertController.create({
      header: 'Confirmar salida',
      message: '¿Está seguro de que desea salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.irHome(); // Ajusta según tu lógica de redirección
          },
        },
      ],
    });

    await alert.present();
  }

  irHome() {
    // Lógica para ir a la página de inicio ("/home") o cualquier otra página
    this.navCtrl.navigateForward('/login')
    this.id = 0;
    this.nombre = "";
    this.contrasena = "";
    this.nombreTienda = "";
    this.logo = "";
  }


  irClientes() {
    // Agrega la lógica para navegar a la página de clientes
    this.navCtrl.navigateForward('/clientes');
  }
  
  irProductos() {
    // Agrega la lógica para navegar a la página de productos
    this.navCtrl.navigateForward('/productos');
  }
  
  irVender() {
    // Agrega la lógica para navegar a la página de vender
    this.navCtrl.navigateForward('/ventas');
  }
  
  irReportes() {
    // Agrega la lógica para navegar a la página de reportes
    this.navCtrl.navigateForward('/reportes');
  }
  
}
