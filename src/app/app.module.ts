import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { Camera } from "@ionic-native/camera/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { File } from "@ionic-native/file/ngx";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { LongPressModule } from "ionic-long-press";

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot()
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Camera,
        File,
        SocialSharing,
        LongPressModule
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
