import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StaticComponentsModule} from './static-components/static-components.module';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DocumentComponentsModule} from './document-components/document-components.module';
import {HalNavigatorModule} from './hal-navigator/hal-navigator.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    StaticComponentsModule,
    AppRoutingModule,
    DocumentComponentsModule,
    HalNavigatorModule,

    BrowserModule,
    BrowserAnimationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
