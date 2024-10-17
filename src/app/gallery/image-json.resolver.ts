import { Resolve } from '@angular/router';
import { ImageJson } from '../shapes/gallery';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { defaultHttpConfig } from '../util/http-config';
import { env } from '../../environments/environment';

const IMAGES_JSON_URI = 'images.json';
const url = env.imageCdnUrl + IMAGES_JSON_URI;

@Injectable({ providedIn: 'root' })
export class ImageJsonResolver implements Resolve<ImageJson> {
  private cachedImageJson: ImageJson;
  private readonly httpClient = inject(HttpClient);

  resolve(): Observable<ImageJson> {
    if (this.cachedImageJson) {
      // we don't want anybody modifying our cached copy!
      return of({ ...this.cachedImageJson, img: { ...this.cachedImageJson.img } });
    } else {
      return this.httpClient.get<ImageJson>(url, defaultHttpConfig()).pipe(
        map((data: ImageJson) => {
          this.cachedImageJson = data;
          return { ...data, img: { ...data.img } };
        })
      );
    }
  }
}
