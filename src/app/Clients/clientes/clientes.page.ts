import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

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
    this.showClients();
  }

  ngOnInit() {
    this.showClients();
  }

  showClients() {
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
        this.sharedDataService.alert('Error al mostrar los Clientes', 'Porfavor de contactar al servicio tecnico' ,'Ocurrió un error al obtener la lista de clientes.');
      }
    );
  }

  ionViewDidEnter() {
    // Este método se ejecutará cada vez que la página entre en la vista
    this.showClients();
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

  edit(cliente: any) {
    this.editingClient[cliente.Id] = true;
  }

  save(cliente: any) {
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
            this.sharedDataService.alert('Actualizar Cliente', 'Cliente Actualizado' ,response.message);
            this.showClients();
            this.editingClient[cliente.Id] = false;
          } else {
            this.sharedDataService.alert('Actualizar Cliente', 'Error al Actualizar al Cliente' ,response.message);
          }
        } else {
          this.sharedDataService.alert('Error al Actualizar Cliente', 'Porfavor de rellenar todos los campos' ,'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert('Error al Actualizar Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }

  delete(cliente: any) {
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
              this.sharedDataService.alert('Eliminar Cliente', 'Cliente Eliminado' ,'Cliente eliminado correctamente.');
            } else {
              this.sharedDataService.alert('Error al Eliminar Cliente', 'Error al Eliminar Cliente' ,'No se encontró el cliente para eliminar.');
            }
          } else {
            this.sharedDataService.alert('Error al Eliminar Cliente', 'Porfavor de completar todos los campos del formulario' ,response.message);
          }
        } else {
          this.sharedDataService.alert('Error al Eliminar Cliente', 'Porfavor contactar al servicio tecnico' ,'Respuesta vacía del servidor');
        }
      },
      (error) => {
        console.error('Error en la llamada HTTP:', error);
        this.sharedDataService.alert('Error al Eliminar al Cliente', 'Porfavor contactar con el servicio tecnico' ,'Ocurrió un error al intentar eliminar al cliente.');
      }
    );
  }
  async delete_alert(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Eliminar Producto',
      message: '¿Está seguro de eliminar este Producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Sí',
          handler: () => {
            this.delete(cliente)
          },
        },
      ],
    });

    await alert.present();
  }
  cancel(cliente: any) {
    this.editingClient[cliente.Id] = false;
  }
  AddClient() {
    this.navCtrl.navigateForward('/agrega-cliente').then(() => {
      this.elim.dismiss();
    });
  }
}
