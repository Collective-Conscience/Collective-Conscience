import { Component } from '@angular/core';
import { App, ViewController, NavController, NavParams, ModalController } from 'ionic-angular';
import { WhereModalPage } from '../where-modal/where-modal';
import { ReviewReportPage } from '../review-report/review-report';

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

  public issues = ['Verbal Abuse','Indecent Exposure','Inappropriate Touching','Leering','Cat Calling','Stalking','Racism', 'Flashing', 'Sexist Remarks', 'Sexually Explicit Comments'];
  public activeIssue = [];

  constructor(public appCtrl: App, public viewCtrl: ViewController, private modalController: ModalController, public navCtrl: NavController, public navParams: NavParams) {

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

  setIssue(id, issue){
    console.log("ISSUE", issue);
    console.log("ID", id);
    if(this.activeIssue.indexOf(issue)!=-1) {
      //if exist remove it.
      this.activeIssue.splice(this.activeIssue.indexOf(issue), 1);
    } else {
    //if don't add it.
      this.activeIssue.push(issue);
    }
    console.log(this.activeIssue);
  }

  submitReport(){
    let reportData = {
      date: this.myDate,
      time: this.myTime,
      street: this.myStreet,
      city: this.myCity,
      state: this.myState,
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
