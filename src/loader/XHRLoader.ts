import File from './File';
import { XHRSettingsObject } from '../types/loader';
import MergeXHRSettings from './MergeXHRSettings';
/**
 * Creates a new XMLHttpRequest (xhr) object based on the given File and XHRSettings
 * and starts the download of it. It uses the Files own XHRSettings and merges them
 * with the global XHRSettings object to set the xhr values before download.
 * @param file The File to download.
 * @param globalXHRSettings The global XHRSettings object.
 */
function XHRLoader(
  file: File,
  globalXHRSettings: XHRSettingsObject
): XMLHttpRequest {
  const config = MergeXHRSettings(globalXHRSettings, file.xhrSettings);
  const xhr = new XMLHttpRequest();

  xhr.open('GET', file.src, config.async!, config.user, config.password);
  xhr.responseType = file.xhrSettings.responseType;
  xhr.timeout = config.timeout!;

  if (config.headers) {
    for (const key in config.headers) {
      xhr.setRequestHeader(key, config.headers[key as keyof object]);
    }
  }
  if (config.requestedWith) {
    xhr.setRequestHeader('X-Requested-With', config.requestedWith);
  }
  if (config.overrideMimeType) {
    xhr.overrideMimeType(config.overrideMimeType);
  }
  if (config.withCredentials) {
    xhr.withCredentials = true;
  }

  xhr.onload = file.onLoad.bind(file, xhr);
  xhr.onerror = file.onError.bind(file, xhr);
  xhr.onprogress = file.onProgress.bind(file);

  xhr.send();

  return xhr;
}
export default XHRLoader;