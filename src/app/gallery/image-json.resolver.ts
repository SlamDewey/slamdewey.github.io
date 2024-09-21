import { Resolve } from "@angular/router";
import { ImageJson } from "../types/gallery";
import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { defaultHttpConfig } from "../util/http-config";
import { env } from "../../environments/environment";

const IMAGES_JSON_URI = "images.json";

@Injectable({ providedIn: "root" })
export class ImageJsonResolver implements Resolve<ImageJson> {
  private readonly httpClient = inject(HttpClient);

  resolve(): Observable<ImageJson> {
    const url = env.imageCdnUrl + IMAGES_JSON_URI;
    return this.httpClient.get<ImageJson>(url, defaultHttpConfig());
  }
}
