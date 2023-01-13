import { HttpParams } from '@angular/common/http';

export class HttpUtils {
  static createHttpParams(opts: { [key: string]: any }): HttpParams {
    let params = new HttpParams();

    if (opts) {
      for (const key of Object.keys(opts)) {
        params = opts[key] != null && opts[key] !== '' ? params.set(key, opts[key]) : params;
      }
    }

    return params;
  }
}
