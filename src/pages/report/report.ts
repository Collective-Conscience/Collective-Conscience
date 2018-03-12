import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams, ModalController, Platform, AlertController } from 'ionic-angular';
import { CurrentCoordProvider } from "../../providers/current-coord/current-coord";
import { WhereModalPage } from '../where-modal/where-modal';
import { ReviewReportPage } from '../review-report/review-report';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {

  myDate: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0,-1);
  myTime: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0,-1);

  public myStreet = "Loading";
  public myCity = "Loading";
  public myState = "Loading";
  public myCoord;

  public issues = ['Verbal Abuse','Indecent Exposure','Inappropriate Touching','Leering','Cat Calling','Stalking','Racism', 'Flashing', 'Sexist Remarks', 'Sexually Explicit Comments', 'Other'];
  public activeIssue = [];

  constructor(public appCtrl: App, public viewCtrl: ViewController, private modalController: ModalController, public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private platform: Platform, public currentCoord: CurrentCoordProvider, public alertCtrl: AlertController) {
    this.platform.ready().then(() => {
        this.currentCoord.getCoord().then(locationResults => {
          this.myCoord = new google.maps.LatLng(locationResults.lat, locationResults.lng);
          this.setAddress(this.myCoord).then(results => {
            this.myStreet = results.myStreet;
            this.myCity = results.myCity;
            this.myState = results.myState;
          });
      });


    // });
  });
}

  setAddress(latLng: any): Promise<any>{
      return new Promise((resolve, result) => {
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': latLng}, function(results, status){
          if (status === 'OK'){
            if (results[0]){
              let address = {
                myStreet: results[0].address_components[0].long_name + " " + results[0].address_components[1].short_name,
                myCity: results[0].address_components[2].long_name,
                myState: results[0].address_components[4].short_name
              }
              resolve(address);
            }else {
              resolve('No results found');
              // window.alert('No results found');
            }
          }else {
            resolve('Geocoder failed due to: ' + status);
            // window.alert('Geocoder failed due to: ' + status);
          }
      });
    });
  }

  openWhereModal(){
    let locationStateFromReportPage = {
      street: this.myStreet,
      city: this.myCity,
      state: this.myState,
      coord: this.myCoord
    }

    let openWhereModal = this.modalController.create(WhereModalPage, locationStateFromReportPage);

    /**TODO: Need to check if user input is actual place **/
    openWhereModal.onDidDismiss((locationState) =>{
      this.myStreet = locationState.street;
      this.myCity = locationState.city;
      this.myState = locationState.state;
      this.myCoord = locationState.coord;
    })
    openWhereModal.present();
  }

  setIssue(id, issue){
    console.log("ISSUE", issue);
    console.log("ID", id);
    if (issue === "Other"){
      this.showOtherPrompt().then(result =>{
        if (result === "Save"){
            issue = this.issues[this.issues.length-2];
            this.editActiveIssue(id, issue);
        }
      });
    }else{
      this.editActiveIssue(id, issue);
    }
    // if(this.activeIssue.indexOf(issue)!=-1) {
    //   //if exist remove it.
    //   this.activeIssue.splice(this.activeIssue.indexOf(issue), 1);
    // } else {
    // //if don't add it.
    //   this.activeIssue.push(issue);
    // }
    // console.log(this.activeIssue);
  }

  editActiveIssue(id, issue){
    if(this.activeIssue.indexOf(issue)!=-1) {
      //if exist remove it.
      this.activeIssue.splice(this.activeIssue.indexOf(issue), 1);
    } else {
    //if don't add it.
      this.activeIssue.push(issue);
    }
    console.log(this.activeIssue);
  }

  showOtherPrompt(): Promise<any> {
      return new Promise((resolve, result) => {
        let prompt = this.alertCtrl.create({
          title: 'Other',
          message: "Enter a short phrase to categorize the issue",
          inputs: [
            {
              name: 'Other',
              placeholder: 'Hand Gestures'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
                resolve("Cancel");
              }
            },
            {
              text: 'Save',
              handler: data => {
                console.log('Saved clicked');
                this.issues[this.issues.length-1] = "Other: " + data.Other;
                this.issues[this.issues.length] = "Other";
                resolve("Save");
              }
            }
          ]
        });
        prompt.present();
      })

 }


  submitReport(){
    let reportData = {
      date: this.myDate,
      time: this.myTime,
      street: this.myStreet,
      city: this.myCity,
      state: this.myState,
      lat: this.myCoord.lat(),
      lng: this.myCoord.lng(),
      activeIssue: this.activeIssue
    }
    this.navCtrl.push(ReviewReportPage, reportData);
  }

  closeReport(){
    this.navCtrl.parent.select(0);
  }

  ionViewDidLeave(){
    console.log("ionViewDidLeave ReportPage");
    this.activeIssue = [];
  }

}
