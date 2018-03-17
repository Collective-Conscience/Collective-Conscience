import { Component } from '@angular/core';

import { ReportPage } from '../report/report';
import { ViewMapPage } from '../viewMap/viewMap';
import { HomePage } from '../home/home';
import { ResourcesPage } from '../resources/resources';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ReportPage;
  tab3Root = ViewMapPage;
  tab4Root = ResourcesPage;

  constructor() {

  }
}
