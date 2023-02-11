/* Defining a type for a function that takes a parent, key, value, and any number of other arguments. */
declare type DataEachCallback = (
  parent: any,
  key: string,
  value: any,
  ...args: any[]
) => void;

interface Window {
  FORCE_WEBGL: boolean;
  FORCE_CANVAS: boolean;
}