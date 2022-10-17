interface FileConfig {
  /**
   * The file type string (image, json, etc) for sorting within the Loader.
   */
  type: string;
  /**
   * Unique cache key (unique within its file type)
   */
  key: string;
  /**
   * The URL of the file, not including baseURL.
   */
  url?: string;
  /**
   * The path of the file, not including the baseURL.
   */
  path?: string;
  /**
   * The default extension this file uses.
   */
  extension?: string;
  /**
   * The responseType to be used by the XHR request.
   */
  responseType?: XMLHttpRequestResponseType;
  /**
   * Custom XHR Settings specific to this file and merged with the Loader defaults.
   */
  xhrSettings?: XHRSettingsObject | false;
  /**
   * A config object that can be used by file types to store transitional data.
   */
  config?: any;
}

interface XHRSettingsObject {
  /**
   * The response type of the XHR request, i.e. `blob`, `text`, etc.
   */
  responseType: XMLHttpRequestResponseType;
  /**
   * Should the XHR request use async or not?
   */
  async?: boolean;
  /**
   * Optional username for the XHR request.
   */
  user?: string;
  /**
   * Optional password for the XHR request.
   */
  password?: string;
  /**
   * Optional XHR timeout value.
   */
  timeout?: number;
  /**
   * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
   */
  headers?: object | undefined;
  /**
   * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
   */
  header?: string | undefined;
  /**
   * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
   */
  headerValue?: string | undefined;
  /**
   * This value is used to populate the XHR `setRequestHeader` and is undefined by default.
   */
  requestedWith?: string | undefined;
  /**
   * Provide a custom mime-type to use instead of the default.
   */
  overrideMimeType?: string | undefined;
  /**
   * The withCredentials property indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates. Setting withCredentials has no effect on same-site requests.
   */
  withCredentials?: boolean;
}
