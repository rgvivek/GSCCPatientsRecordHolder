import { Component, ContentChildren, QueryList, AfterContentInit, Attribute } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'tabs',
  properties: {"isVertical":"isVertical", "customWidth":"customWidth"},
  template:`
    <ul class="nav {{tabsStyle}}">
      <li *ngFor="let tab of tabs" (click)="selectTab(tab)" [class.active]="tab.active" class="take-all-space-you-can">
        <a>{{tab.title}}</a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class Tabs implements AfterContentInit {
  
  @ContentChildren(Tab) tabs: QueryList<Tab>;
  
  tabsStyle:string = 'nav-tabs';
 
  constructor(@Attribute('isVertical') isVertical:boolean, @Attribute('customWidth') customWidth:number) { 
      if(isVertical){
        this.tabsStyle = 'nav-pills nav-stacked col-xs-' + (customWidth || 2);
      }
  };

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: Tab){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
