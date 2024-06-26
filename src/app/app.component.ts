import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Plugins, StatusBarStyle, Capacitor } from "@capacitor/core";

const { StatusBar } = Plugins;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            if (Capacitor.isPluginAvailable('StatusBar')) {
                StatusBar.setBackgroundColor({
                    color: "white"
                })
                StatusBar.setStyle({
                    style: StatusBarStyle.Light
                })
            }

            this.splashScreen.hide();
        });
    }
}
