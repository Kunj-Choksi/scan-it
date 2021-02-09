import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LandingPageRoutingModule } from './landing-routing.module';

import { LandingPage } from './landing.page';
import { CropperPageModule } from '../cropper/cropper.module';
import { LongPressModule } from "ionic-long-press";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LandingPageRoutingModule,
        CropperPageModule,
        LongPressModule
    ],
    declarations: [LandingPage]
})
export class LandingPageModule { }
