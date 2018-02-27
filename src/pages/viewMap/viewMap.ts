import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'page-viewMap',
  templateUrl: 'viewMap.html'
})
export class ViewMapPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  constructor(public navCtrl: NavController, private googleMaps: GoogleMaps) {

  }

  ionViewDidLoad() {
    console.log(this.mapRef);
    this.loadMap();
 }

 loadMap() {

   let latLng = new google.maps.LatLng(-34.9290, 138.6010);

   let mapOptions = {
     center: latLng,
     zoom: 15,
     mapTypeId: google.maps.MapTypeId.ROADMAP
   }

   this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);

   // let mapOptions: GoogleMapOptions = {
   //   camera: {
   //     target: {
   //       lat: 43.0741904,
   //       lng: -89.3809802
   //     },
   //     zoom: 18,
   //     tilt: 30
   //   }
   // };
   //
   // this.map = new google.maps.Map(this.mapRef.navtiveElement, mapOptions);
   //
   // // Wait the MAP_READY before using any methods.
   // this.map.one(GoogleMapsEvent.MAP_READY)
   //   .then(() => {
   //     console.log('Map is ready!');
   //
   //     // Now you can use all methods safely.
   //     this.map.addMarker({
   //         title: 'Ionic',
   //         icon: 'blue',
   //         animation: 'DROP',
   //         position: {
   //           lat: 43.0741904,
   //           lng: -89.3809802
   //         }
   //       })
   //       .then(marker => {
   //         marker.on(GoogleMapsEvent.MARKER_CLICK)
   //           .subscribe(() => {
   //             alert('clicked');
   //           });
   //       });
   //
   //   });
 }

}
