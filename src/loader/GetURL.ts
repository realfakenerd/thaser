import File from './File';

/**
 * Given a File and a baseURL value this returns the URL the File will use to download from.
 * @param file The File object.
 * @param baseURL A default base URL.
 */
function GetURL(file: File, baseURL: string): string {
  if (!file.url) return false as any;
  if (
    (file.url as string).match(
      /^(?:blob:|data:|capacitor:\/\/|http:\/\/|https:\/\/|\/\/)/
    )
  )
    return file.url as string;
  else return (baseURL + file.url) as string;
}
export default GetURL;