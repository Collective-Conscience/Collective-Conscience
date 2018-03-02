import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { DataProvider } from "../../providers/data/data";

declare var google: any;

@Component({
  selector: 'page-viewMap',
  templateUrl: 'viewMap.html'
})
export class ViewMapPage {

  public reportData: any;
  @ViewChild('map') mapRef: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps, public data: DataProvider, private toastCtrl: ToastController) {
    this.reportData = this.data.paramData;
  }

  ionViewDidLoad() {
    console.log(this.mapRef);
    this.loadMap();
 }

  loadMap() {
      let mapOptions = {
        center: this.reportData.coord,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
      this.addMarker();

  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    this.addInfoWindow(marker);

  }

  addInfoWindow(marker){

    google.maps.event.addListener(marker, 'click', () => {
      let toast = this.toastCtrl.create({
         message: 'When: ' + this.reportData.date + '\n \n' +
         'Where: ' + this.reportData.street + ' ' + this.reportData.city +
         ', ' + this.reportData.state + '\n \n' + 'What: ' + this.reportData.activeIssue,
         position: 'bottom',
         showCloseButton: true,
         dismissOnPageChange: true,
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    });

}

}
