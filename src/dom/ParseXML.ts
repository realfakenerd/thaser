/**
 * Takes the given data string and parses it as XML.
 * First tries to use the window.DOMParser and reverts to the Microsoft.XMLDOM if that fails.
 * The parsed XML object is returned, or `null` if there was an error while parsing the data.
 * @param data The XML source stored in a string.
 */
function ParseXML(data: string): Document | null {
  let xml = null;

  try {
    if (typeof window.DOMParser !== 'undefined') {
      const domParser = new window.DOMParser();
      const parsedXml = domParser.parseFromString(data, 'text/xml');
      const parserErrors = parsedXml.getElementsByTagName('parsererror');
      if (parserErrors.length === 0) {
        xml = parsedXml;
      }
    }
  } catch (e) {
    xml = null;
  }

  return xml;
}


export default ParseXML;