import { Injectable } from '@angular/core';

import { jsPDF } from "jspdf";
import { UserSelectedImage } from '../models/user-images.model';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    constructor() { }

    imageToPdfBlob(image: UserSelectedImage) {
        let baseImage = image.imageEncoded.replace("data:image/jpeg;base64,", "");
        let convertedPdf = new jsPDF('p', 'mm', 'a4');

        var width = convertedPdf.internal.pageSize.getWidth();
        var height = convertedPdf.internal.pageSize.getHeight();

        convertedPdf.addImage(baseImage, "JPEG", 0, 0, width, height);

        return new Blob([convertedPdf.output('blob')], { type: 'application/pdf' });
    }

    imagesToPdfBlob(images: UserSelectedImage[]) {
        let pdf = new jsPDF('p', 'mm', 'a4');
        for (const index in images) {
            const image = images[index];
            let baseImage = image.imageEncoded.replace("data:image/jpeg;base64,", "");
            var width = pdf.internal.pageSize.getWidth();
            var height = pdf.internal.pageSize.getHeight();
            pdf.addImage(baseImage, "JPEG", 5, 5, width - 10, height - 10);
            if (+index != (images.length - 1)) {
                pdf.addPage();
            }
        }

        return new Blob([pdf.output('blob')], { type: 'application/pdf' })
    }

    base64ToBlob(base64Data, contentType) {
        contentType = contentType || "";
        const sliceSize = 1024;
        const byteCharacters = atob(base64Data);
        const bytesLength = byteCharacters.length;
        const slicesCount = Math.ceil(bytesLength / sliceSize);
        const byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            const begin = sliceIndex * sliceSize;
            const end = Math.min(begin + sliceSize, bytesLength);

            const bytes = new Array(end - begin);
            for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    }

    getBrowserUrl(base64Data, contentType) {
        const newBlob = this.base64ToBlob(base64Data, contentType)
        return window.URL.createObjectURL(newBlob);
    }

    downloadWithAchor(blob) {
        const url = window.URL.createObjectURL(blob);
        console.log(url);
        var anc = document.createElement("a");
        anc.href = url;
        anc.download = "Pdf.pdf";
        anc.click();
    }

    base64toPDF(data) {
        var bufferArray = this.base64ToArrayBuffer(data);
        return new Blob([bufferArray], { type: "application/pdf" });
    }

    base64ToArrayBuffer(data) {
        var bString = window.atob(data);
        var bLength = bString.length;
        var bytes = new Uint8Array(bLength);
        for (var i = 0; i < bLength; i++) {
            var ascii = bString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    };

}
