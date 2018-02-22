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
    IonicModule.forRoot(MyApp)
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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
