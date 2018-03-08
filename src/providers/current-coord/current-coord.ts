import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
/*
  Generated class for the CurrentCoordProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var google: any;

@Injectable()
export class CurrentCoordProvider {

  constructor(public geolocation: Geolocation) {
    console.log('Hello CurrentCoordProvider Provider');

  }

  getCoord(): Promise<any>{
    return new Promise((resolve, result) => {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        resolve(latLng);
      });

    })

  }

}
