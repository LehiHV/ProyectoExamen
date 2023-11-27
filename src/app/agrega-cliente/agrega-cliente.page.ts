import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from '../shared-data.service';
import { ModalController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-agrega-cliente',
  templateUrl: './agrega-cliente.page.html',
  styleUrls: ['./agrega-cliente.page.scss'],
})
export class AgregaClientePage implements OnInit {
  nuevoCliente: any = {
    Nombre: '',
    Domicilio: '',
    Correo: '',
    Telefono: '',
    Fotografia: '',
    PeriodoCobrar: '',
    DiaCobrar: '',
    HoraCobrar: '',
  };
  Clientes: any[] = [];
  constructor(
    public elim : ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    public sharedDataService: SharedDataService,
    public navCtrl: NavController
    ) { }

  ngOnInit() {
  }

  registrarCliente() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_CLIENTES.php';
    const params = {
      comando: 'Add',
      Nombre: this.nuevoCliente.Nombre,
      Domicilio: this.nuevoCliente.Domicilio,
      Correo: this.nuevoCliente.Correo,
      Telefono: this.nuevoCliente.Telefono,
      Fotografia: this.nuevoCliente.Fotografia,
      PeriodoCobrar: this.nuevoCliente.PeriodoCobrar,
      DiaCobrar: this.nuevoCliente.DiaCobrar,
      HoraCobrar: this.nuevoCliente.HoraCobrar,
      IdTienda: this.sharedDataService.userData.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Cliente agregado correctamente') {
              this.mostrarAlerta('Clientes', 'Cliente Registrado');
              this.navCtrl.navigateBack('/clientes');
          } else {
            this.mostrarAlerta('Clientes', response.message);
          }
        } else {
          this.mostrarAlerta('Error', 'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }
  esURLValida(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }
  periodoCobrarChanged(cliente: any) {
    switch (cliente.PeriodoCobrar) {
      case 'semanal':
        cliente.opcionesDiaCobrar = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        break;

      case 'quincenal':
        cliente.opcionesDiaCobrar = ['15', '16'];
        break;

      case 'mensual':
        cliente.opcionesDiaCobrar = Array.from({ length: 28 }, (_, i) => (i + 1).toString());
        break;

      default:
        cliente.opcionesDiaCobrar = [];
        break;
    }
  }
  cancelarAgregarCliente() {
    this.nuevoCliente = {
      Nombre: '',
      Domicilio: '',
      Correo: '',
      Telefono: '',
      Fotografia: '',
      PeriodoCobrar: '',
      DiaCobrar: '',
      HoraCobrar: '',
    };
    this.navCtrl.navigateForward('/clientes')
    this.obtenerClientes();
    
  }
  obtenerClientes() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_CLIENTES.php';
    const params = {
      comando: 'ClientId',
      TiendaId: this.sharedDataService.userData.Id
    };

    this.http.get<any[]>(url, { params }).subscribe(
      (clientes) => {
        this.Clientes = Array.isArray(clientes) ? clientes : [clientes];
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al obtener la lista de clientes.');
      }
    );
  }
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
