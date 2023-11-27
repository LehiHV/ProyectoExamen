import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { SharedDataService } from '../../shared-data.service';

@Component({
  selector: 'app-resumen-ticket',
  templateUrl: './resumen-ticket.page.html',
  styleUrls: ['./resumen-ticket.page.scss'],
})
export class ResumenTicketPage implements OnInit {
  IdTicket: string = this.sharedDataService.IdTicket;
  ticketData: any;

  constructor(
    private route: ActivatedRoute,
    public elim: ModalController,
    public sharedDataService: SharedDataService,
    public alertController: AlertController,
    private http: HttpClient,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.IdTicket = this.sharedDataService.IdTicket;
    
    if (this.IdTicket) {
      this.loadTicketDetails();
      
      this.loadTicketDetails();
    }
  }

  loadTicketDetails() {
    const url = 'https://movilesappslehi.000webhostapp.com/Apis_5E/REST_API_TICKETS.php';
    const params ={
      comando:'TicketId',
      Id : this.sharedDataService.IdTicket
    }
    this.http.get<any>(url, {params}).subscribe(
      (response) => {
        this.ticketData = response;
      },
      (error) => {
        console.error('Error obteniendo detalles del ticket:', error);
        this.presentAlert('Error', 'Ocurrió un error al obtener los detalles del ticket.');
      }
    );
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }
  onListoClick() {
    this.navCtrl.navigateForward('ventas')
  }
}
