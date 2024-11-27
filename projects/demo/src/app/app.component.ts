import {Component} from '@angular/core';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NavigationComponent} from 'resource-components';

@Component({
  selector: 'app-setty',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  imports: [
    StaticComponentsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NavigationComponent
  ]
})
export class AppComponent {
}
