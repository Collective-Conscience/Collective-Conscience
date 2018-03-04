import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

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
    state: "",
    coord: ""
  };
  public myStreet = "";
  public myCity = "";
  public myState = "";
  public myCoord = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public geolocation: Geolocation) {
    this.myStreet = this.navParams.get("street");
    this.myCity = this.navParams.get("city");
    this.myState = this.navParams.get("state");
    this.myCoord = this.navParams.get("coord");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WhereModalPage');
  }

  checkAddress(street: String, city: String, state: String): Promise<any>{
    /*TODO: NOT WORKING; DOES NOT VALIDATE INPUT ADDRESS */

    return new Promise((resolve, result) => {
      var addressForm = street + " " + city + ", " + state;
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'address': addressForm}, function(results, status){
        if (status === 'OK'){
          if (results[0]){
            let newAddress = {
              coord: results[0].geometry.location,
              street: results[0].address_components[0].long_name + " " + results[0].address_components[1].short_name,
              city: results[0].address_components[2].long_name,
              state: results[0].address_components[4].short_name,
              valid: "true"
            }
            console.log("NEW LOCATION LAT", results[0].geometry.location.lat());
            console.log("NEW LOCATION LONG", results[0].geometry.location.lng());
            resolve(newAddress);
          }else{
            resolve("false");
          }
        }else {
          resolve('Geocoder failed due to: ' + status);
          // window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
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
    if (this.locationForm.coord === ""){
        this.locationForm.coord = this.myCoord;
    }



    this.checkAddress(this.locationForm.street, this.locationForm.city, this.locationForm.state).then(results => {
      if (results.valid === "true"){
        this.locationForm.coord = results.coord;
        this.viewCtrl.dismiss(this.locationForm);
      }else{
        /** Display invalid error **/
        invalidAddress.style.display = "block";
      }
    });

  }


}
