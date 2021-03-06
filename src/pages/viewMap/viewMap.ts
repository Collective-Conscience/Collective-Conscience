import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
import { DataProvider } from "../../providers/data/data";
import { CurrentCoordProvider } from "../../providers/current-coord/current-coord";
import { AngularFireDatabase } from 'angularfire2/database';

declare var google: any;

@Component({
  selector: 'page-viewMap',
  templateUrl: 'viewMap.html'
})
export class ViewMapPage {

  // addressMarkers: AngularFireListObservable<any>;
  public reportData: any;
  @ViewChild('map') mapRef: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public data: DataProvider, private toastCtrl: ToastController, public afDatabase: AngularFireDatabase, public currentCoord: CurrentCoordProvider) {
    this.reportData = this.data.paramData;
    // this.addressMarkers = this.afDatabase.list('/addressMarkers').valueChanges();
  }

  ionViewDidLoad() {
    this.loadMap();
 }

  loadMap() {
    /**TODO: FIX SO THAT IF MAP PAGE VISIT FIRST STILL DROPS PIN
    GET CURRENT GEOLOCATION NOT FROM OTHER PAGE **/
    this.currentCoord.getCoord().then(results => {
      console.log("RESULTS", results);
      let mapOptions = {
          center: {lat: results.lat, lng: results.lng},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
        this.addMarker();
    })



  }

  addMarker(){

    this.afDatabase.list('/addressMarkers').snapshotChanges()
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: {
                lat: snapshot.payload.val().lat,
                lng: snapshot.payload.val().lng
              }
            });
          this.addInfoWindow(marker, snapshot);
        });
    })

    // let marker = new google.maps.Marker({
    //   map: this.map,
    //   animation: google.maps.Animation.DROP,
    //   position: this.map.getCenter()
    // });
    //
    // this.addInfoWindow(marker);

  }

  addInfoWindow(marker, snapshot){

    google.maps.event.addListener(marker, 'click', () => {
      let toast = this.toastCtrl.create({
         message: 'When: ' + snapshot.payload.val().date + '\n \n' +
         'Where: ' + snapshot.payload.val().street + ' ' + snapshot.payload.val().city +
         ', ' + snapshot.payload.val().state + '\n \n' + 'What: ' + snapshot.payload.val().activeIssue,
         position: 'bottom',
         showCloseButton: true,
         dismissOnPageChange: true,
       });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });

      toast.present();
    });

    // google.maps.event.addListener(marker, 'click', () => {
    //   let toast = this.toastCtrl.create({
    //      message: 'When: ' + this.reportData.date + '\n \n' +
    //      'Where: ' + this.reportData.street + ' ' + this.reportData.city +
    //      ', ' + this.reportData.state + '\n \n' + 'What: ' + this.reportData.activeIssue,
    //      position: 'bottom',
    //      showCloseButton: true,
    //      dismissOnPageChange: true,
    //    });
    //
    //   toast.onDidDismiss(() => {
    //     console.log('Dismissed toast');
    //   });
    //
    //   toast.present();
    // });


}

}
