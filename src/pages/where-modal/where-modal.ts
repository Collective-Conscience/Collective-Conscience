import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WhereModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-where-modal',
  templateUrl: 'where-modal.html',
})
export class WhereModalPage {

  public locationForm = {
    street: "",
    city: "",
    state: ""
  };
  public myStreet = "";
  public myCity = "";
  public myState = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.myStreet = this.navParams.get("street");
    this.myCity = this.navParams.get("city");
    this.myState = this.navParams.get("state");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhereModalPage');
  }

  closeModal(){
    /*TODO: check when user only puts one input in
    should all inputs be required?*/

    // if (Object.keys(this.locationForm).length === 0){
    //   this.locationForm.street = this.myStreet;
    //   this.locationForm.city = this.myCity;
    //   this.locationForm.state = this.myState;
    // }

    if (this.locationForm.street === ""){
      this.locationForm.street = this.myStreet;
    }
    if (this.locationForm.city === ""){
      this.locationForm.city = this.myCity;
    }
    if (this.locationForm.state === ""){
      this.locationForm.state = this.myState;
    }

    this.viewCtrl.dismiss(this.locationForm);
  }


}
