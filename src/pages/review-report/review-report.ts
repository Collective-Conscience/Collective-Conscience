import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DataProvider } from "../../providers/data/data";
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the ReviewReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-review-report',
  templateUrl: 'review-report.html',
})
export class ReviewReportPage {


  public reportData = {
    date: "",
    time: "",
    street: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    activeIssue: []
  };

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public data: DataProvider, public afDatabase: AngularFireDatabase) {
    this.reportData.date = this.navParams.get("date");
    this.reportData.time = this.navParams.get("time");
    this.reportData.street = this.navParams.get("street");
    this.reportData.city = this.navParams.get("city");
    this.reportData.state = this.navParams.get("state");
    this.reportData.lat = this.navParams.get("lat");
    this.reportData.lng = this.navParams.get("lng");
    // this.reportData.coord = this.navParams.get("coord");
    this.reportData.activeIssue = this.navParams.get("activeIssue");
    // this.addressMarkers = afDatabase.list('/addressMarkers').valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewReportPage');
  }

  goBack(){
    this.navCtrl.pop();
  }
  showConfirm() {
    const newMarkerRef = this.afDatabase.list('/addressMarkers').push({});
    newMarkerRef.set({
      id: newMarkerRef.key,
      date: this.reportData.date,
      time: this.reportData.time,
      street: this.reportData.street,
      city: this.reportData.city,
      state: this.reportData.state,
      lat: this.reportData.lat,
      lng: this.reportData.lng,
      activeIssue: this.reportData.activeIssue
    });

    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Thank you for taking a stand against street harassment',
      buttons: [
        {
          text: 'DONE',
          handler: () => {
            console.log('Done clicked');
            this.navCtrl.pop();
            this.navCtrl.parent.select(0);
          }
        },
        {
          text: 'VIEW MAP',
          handler: () => {
            console.log('View Map clicked', this.reportData);
            this.data.paramData = this.reportData;
            this.navCtrl.pop();
            this.navCtrl.parent.select(2);
          }
        }
      ]
    });
    confirm.present();
  }

}
