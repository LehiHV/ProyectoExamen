import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {
  showDetails: { [key: string]: boolean } = {};
  editingClient: { [key: string]: boolean } = {};
  Clientes: any[] = [];
  searchText: string =''
  constructor(
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) {
    this.obtenerClientes();
  }

  ngOnInit() {
    this.obtenerClientes();
  }
  filterClientes(): any[] {
    if (!this.searchText) {
      return this.Clientes;
    }

    return this.Clientes.filter(cliente => {
      // Puedes ajustar esta lógica de búsqueda según tus necesidades
      return cliente.Nombre.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }
  esURLValida(url: string): boolean {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }
  
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  obtenerClientes() {
    this.sharedDataService.obtenerClientes().subscribe(
      (clientes) => {
        if (clientes && clientes.length > 0) {
          this.Clientes = Array.isArray(clientes) ? clientes : [clientes];
        } else {
          this.Clientes = [];
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.mostrarAlerta('Error', 'Ocurrió un error al obtener la lista de clientes.');
      }
    );
  }

  ionViewDidEnter() {
    // Este método se ejecutará cada vez que la página entre en la vista
    this.obtenerClientes();
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

  toggleDetails(cliente: any) {
    this.showDetails[cliente.Id] = !this.showDetails[cliente.Id];
  }

  editarCliente(cliente: any) {
    this.editingClient[cliente.Id] = true;
  }

  guardarCliente(cliente: any) {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_CLIENTES.php';
    const params = {
      comando: 'Update',
      Id: cliente.Id,
      Nombre: cliente.Nombre,
      Domicilio: cliente.Domicilio,
      Correo: cliente.Correo,
      Telefono: cliente.Telefono,
      Fotografia: cliente.Fotografia,
      PeriodoCobrar: cliente.PeriodoCobrar,
      DiaCobrar: cliente.DiaCobrar,
      HoraCobrar: cliente.HoraCobrar,
      IdTienda: this.sharedDataService.userData.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Cliente actualizado correctamente') {
            this.mostrarAlerta('Clientes', response.message);
            this.obtenerClientes();
            this.editingClient[cliente.Id] = false;
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

  eliminarCliente(cliente: any) {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_CLIENTES.php';
    const params = {
      comando: 'Delete',
      Id: cliente.Id
    };

    this.http.get<any>(url, { params }).subscribe(
      (response) => {
        if (response) {
          if (response.message === 'Cliente Eliminado correctamente') {
            const index = this.Clientes.findIndex(c => c.Id === cliente.Id);
            if (index !== -1) {
              this.Clientes.splice(index, 1);
              this.mostrarAlerta('Clientes', 'Cliente eliminado correctamente.');
            } else {
              this.mostrarAlerta('Error', 'No se encontró el cliente para eliminar.');
            }
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

  agregarCliente() {
    this.navCtrl.navigateForward('/agrega-cliente').then(() => {
      this.elim.dismiss();
    });
  }
}
