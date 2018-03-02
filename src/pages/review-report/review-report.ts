import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DataProvider } from "../../providers/data/data";
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
    coord: "",
    activeIssue: []
  };

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public data: DataProvider) {
    this.reportData.date = this.navParams.get("date");
    this.reportData.time = this.navParams.get("time");
    this.reportData.street = this.navParams.get("street");
    this.reportData.city = this.navParams.get("city");
    this.reportData.state = this.navParams.get("state");
    this.reportData.coord = this.navParams.get("coord");
    this.reportData.activeIssue = this.navParams.get("activeIssue");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewReportPage');
  }

  goBack(){
    this.navCtrl.pop();
  }
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'THANK YOU FOR TAKING A STAND AGAINST STREET HARASSMENT',
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
            console.log('View clicked');
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
