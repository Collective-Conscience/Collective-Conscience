import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ReportPage } from '../pages/report/report';
import { ViewMapPage } from '../pages/viewMap/viewMap';
import { HomePage } from '../pages/home/home';
import { ResourcesPage } from '../pages/resources/resources';
import { TabsPage } from '../pages/tabs/tabs';
import { WhereModalPage } from '../pages/where-modal/where-modal';
import { ReviewReportPage } from '../pages/review-report/review-report';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { DataProvider } from '../providers/data/data';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CurrentCoordProvider } from '../providers/current-coord/current-coord';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyBt3ni-ObaddY8UAMYjLXGVTVTqE4767J8",
  authDomain: "collective-consc-1519539441531.firebaseapp.com",
  databaseURL: "https://collective-consc-1519539441531.firebaseio.com",
  projectId: "collective-consc-1519539441531",
  storageBucket: "",
  messagingSenderId: "205147151561"
};

@NgModule({
  declarations: [
    MyApp,
    ReportPage,
    ViewMapPage,
    HomePage,
    ResourcesPage,
    TabsPage,
    WhereModalPage,
    ReviewReportPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReportPage,
    ViewMapPage,
    HomePage,
    ResourcesPage,
    TabsPage,
    WhereModalPage,
    ReviewReportPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    CurrentCoordProvider
  ]
})
export class AppModule {}
