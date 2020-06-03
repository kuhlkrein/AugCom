import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {UsertoolbarComponent} from './components/usertoolbar/usertoolbar.component';
import {EditionComponent} from './components/edition/edition.component';
import {KeyboardComponent} from './components/keyboard/keyboard.component';
import {DialogbarComponent} from './components/dialogbar/dialogbar.component';
import {ShareComponent} from './components/share/share.component';
import {PopupComponent} from './components/popup/popup.component';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {SettingsComponent} from './components/settings/settings.component';
import {DragulaModule} from 'ng2-dragula';
import {SnapBarComponent} from './components/snap-bar/snap-bar.component';
import {AccountComponent} from './components/account/account.component';
import {AccountInformationComponent} from './components/account-information/account-information.component';
import {PalettesComponent} from './components/palettes/palettes.component';
import {LanguageComponent} from './components/langue/language.component';
import {SavesComponent} from './components/saves/saves.component';
import {ContactComponent} from './components/contact/contact.component';
import {ActualitesComponent} from './components/actualites/actualites.component';
import {BackHomeBarComponent} from './components/back-home-bar/back-home-bar.component';
import {EventComponent} from './components/event/event.component';
import {AlternativeFormsComponent} from './components/alternative-forms/alternative-forms.component';
import {ImageSelectionPageComponent} from './components/image-selection-page/image-selection-page.component';
import {InformationEditionPageComponent} from './components/information-edition-page/information-edition-page.component';
import {AVenirComponent} from './components/a-venir/a-venir.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ErrorOnEditComponent } from './components/error-on-edit/error-on-edit.component';
import { PrintComponent } from './components/print/print.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {OverlayModule} from "@angular/cdk/overlay";

@NgModule({
  declarations: [
    AppComponent,
    UsertoolbarComponent,
    EditionComponent,
    KeyboardComponent,
    DialogbarComponent,
    ShareComponent,
    PopupComponent,
    SettingsComponent,
    SnapBarComponent,
    AccountComponent,
    AccountInformationComponent,
    PalettesComponent,
    LanguageComponent,
    SavesComponent,
    ContactComponent,
    ActualitesComponent,
    BackHomeBarComponent,
    EventComponent,
    AlternativeFormsComponent,
    ImageSelectionPageComponent,
    InformationEditionPageComponent,
    AVenirComponent,
    ErrorOnEditComponent,
    PrintComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    Ng2ImgMaxModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AppRoutingModule,
    DragulaModule,
    DragulaModule.forRoot(),
    BrowserAnimationsModule,
    MatTooltipModule,
    OverlayModule
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
