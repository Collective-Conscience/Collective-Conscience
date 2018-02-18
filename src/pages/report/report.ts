import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { WhereModalPage } from '../where-modal/where-modal';
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  myDate: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0,-1);
  myTime: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0,-1);
  public myStreet = "123 Street Rd.";
  public myCity = "City";
  public myState = "State";
  constructor(private modalController: ModalController, public navCtrl: NavController, public navParams: NavParams) {

  }

  openWhereModal(){
    let locationStateFromReportPage = {
      street: this.myStreet,
      city: this.myCity,
      state: this.myState
    }
    let openWhereModal = this.modalController.create(WhereModalPage, locationStateFromReportPage);
    openWhereModal.onDidDismiss((locationState) =>{
      this.myStreet = locationState.street;
      this.myCity = locationState.city;
      this.myState = locationState.state;
    })
    openWhereModal.present();
  }
}
