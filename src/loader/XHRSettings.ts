import { XHRSettingsObject } from "../types/loader";

/**
 * Creates an XHRSettings Object with default values.
 * @param responseType The responseType, such as 'text'. Default ''.
 * @param async Should the XHR request use async or not? Default true.
 * @param user Optional username for the XHR request. Default ''.
 * @param password Optional password for the XHR request. Default ''.
 * @param timeout Optional XHR timeout value. Default 0.
 * @param withCredentials Optional XHR withCredentials value. Default false.
 */
function XHRSettings(
  responseType: XMLHttpRequestResponseType = '',
  async: boolean = true,
  user: string = '',
  password: string = '',
  timeout: number = 0,
  withCredentials: boolean = false
): XHRSettingsObject {
    return {
        responseType,
        
        async,

        user,
        password,

        timeout,

        headers: undefined,
        header: undefined,
        headerValue: undefined,
        // @ts-ignore
        requestedWith: false,

        overrideMimeType: undefined,

        withCredentials
    }
}
export default XHRSettings;