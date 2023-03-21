import { Add, AddAt, NOOP } from '@thaser/utils';

/**
 * List is a generic implementation of an ordered list which contains utility methods for retrieving, manipulating, and iterating items.
 */
export default class List<T> {
  /**
   *
   * @param parent The parent of this list.
   */
  constructor(parent: any) {
    this.parent = parent;
  }

  /**
   * The parent of this list.
   */
  parent: any;

  /**
   * The objects that belong to this collection.
   */
  list: T[] = [];

  /**
   * The index of the current element.
   *
   * This is used internally when iterating through the list with the {@link #first}, {@link #last}, {@link #get}, and {@link #previous} properties.
   */
  position = 0;

  /**
   * A callback that is invoked every time a child is added to this list.
   */
  addCallback = NOOP as Function;

  /**
   * A callback that is invoked every time a child is removed from this list.
   */
  removeCallback = NOOP as Function;

  /**
   * The property key to sort by.
   */
  _sortKey = '';

  /**
   * Adds the given item to the end of the list. Each item must be unique.
   * @param child The item, or array of items, to add to the list.
   * @param skipCallback Skip calling the List.addCallback if this child is added successfully. Default false.
   */
  add(child: T, skipCallback = false): T {
    if (skipCallback) return Add(this.list, child);
    else return Add(this.list, child, 0, this.addCallback, this as any);
  }

  /**
   * Adds an item to list, starting at a specified index. Each item must be unique within the list.
   * @param child The item, or array of items, to add to the list.
   * @param index The index in the list at which the element(s) will be inserted. Default 0.
   * @param skipCallback Skip calling the List.addCallback if this child is added successfully. Default false.
   */
  addAt(child: T, index = 0, skipCallback = false): T {
    if(skipCallback) return AddAt(this.list, child, index);
    else return AddAt(this.list, child, index, 0, this.addCallback, this as any);
  }

  /**
   * Retrieves the item at a given position inside the List.
   * @param index The index of the item.
   */
  getAt(index: number): T;

  /**
   * Locates an item within the List and returns its index.
   * @param child The item to locate.
   */
  getIndex(child: T): number;

  /**
   * Sort the contents of this List so the items are in order based on the given property.
   * For example, `sort('alpha')` would sort the List contents based on the value of their `alpha` property.
   * @param property The property to lexically sort by.
   * @param handler Provide your own custom handler function. Will receive 2 children which it should compare and return a boolean.
   */
  sort(property: string, handler?: Function): T[];

  /**
   * Searches for the first instance of a child with its `name`
   * property matching the given argument. Should more than one child have
   * the same name only the first is returned.
   * @param name The name to search for.
   */
  getByName(name: string): T | null;

  /**
   * Returns a random child from the group.
   * @param startIndex Offset from the front of the group (lowest child). Default 0.
   * @param length Restriction on the number of values you want to randomly select from. Default (to top).
   */
  getRandom(startIndex?: number, length?: number): T | null;

  /**
   * Returns the first element in a given part of the List which matches a specific criterion.
   * @param property The name of the property to test or a falsey value to have no criterion.
   * @param value The value to test the `property` against, or `undefined` to allow any value and only check for existence.
   * @param startIndex The position in the List to start the search at. Default 0.
   * @param endIndex The position in the List to optionally stop the search at. It won't be checked.
   */
  getFirst(
    property: string,
    value: any,
    startIndex?: number,
    endIndex?: number
  ): T | null;

  /**
   * Returns all children in this List.
   *
   * You can optionally specify a matching criteria using the `property` and `value` arguments.
   *
   * For example: `getAll('parent')` would return only children that have a property called `parent`.
   *
   * You can also specify a value to compare the property to:
   *
   * `getAll('visible', true)` would return only children that have their visible property set to `true`.
   *
   * Optionally you can specify a start and end index. For example if this List had 100 children,
   * and you set `startIndex` to 0 and `endIndex` to 50, it would return matches from only
   * the first 50 children in the List.
   * @param property An optional property to test against the value argument.
   * @param value If property is set then Child.property must strictly equal this value to be included in the results.
   * @param startIndex The first child index to start the search from.
   * @param endIndex The last child index to search up until.
   */
  getAll(
    property?: string,
    value?: T,
    startIndex?: number,
    endIndex?: number
  ): T[];

  /**
   * Returns the total number of items in the List which have a property matching the given value.
   * @param property The property to test on each item.
   * @param value The value to test the property against.
   */
  count(property: string, value: T): number;

  /**
   * Swaps the positions of two items in the list.
   * @param child1 The first item to swap.
   * @param child2 The second item to swap.
   */
  swap(child1: T, child2: T): void;

  /**
   * Moves an item in the List to a new position.
   * @param child The item to move.
   * @param index Moves an item in the List to a new position.
   */
  moveTo(child: T, index: number): T;

  /**
   * Moves the given array element above another one in the array.
   * @param child1 The element to move above base element.
   * @param child2 The base element.
   */
  moveAbove(child1: T, child2: T): void;

  /**
   * Moves the given array element below another one in the array.
   * @param child1 The element to move below base element.
   * @param child2 The base element.
   */
  moveBelow(child1: T, child2: T): void;

  /**
   * Removes one or many items from the List.
   * @param child The item, or array of items, to remove.
   * @param skipCallback Skip calling the List.removeCallback. Default false.
   */
  remove(child: T, skipCallback?: boolean): T;

  /**
   * Removes the item at the given position in the List.
   * @param index The position to remove the item from.
   * @param skipCallback Skip calling the List.removeCallback. Default false.
   */
  removeAt(index: number, skipCallback?: boolean): T;

  /**
   * Removes the items within the given range in the List.
   * @param startIndex The index to start removing from. Default 0.
   * @param endIndex The position to stop removing at. The item at this position won't be removed.
   * @param skipCallback Skip calling the List.removeCallback. Default false.
   */
  removeBetween(
    startIndex?: number,
    endIndex?: number,
    skipCallback?: boolean
  ): T[];

  /**
   * Removes all the items.
   * @param skipCallback Skip calling the List.removeCallback. Default false.
   */
  removeAll(skipCallback?: boolean): Phaser.Structs.List<T>;

  /**
   * Brings the given child to the top of this List.
   * @param child The item to bring to the top of the List.
   */
  bringToTop(child: T): T;

  /**
   * Sends the given child to the bottom of this List.
   * @param child The item to send to the back of the list.
   */
  sendToBack(child: T): T;

  /**
   * Moves the given child up one place in this group unless it's already at the top.
   * @param child The item to move up.
   */
  moveUp(child: T): T;

  /**
   * Moves the given child down one place in this group unless it's already at the bottom.
   * @param child The item to move down.
   */
  moveDown(child: T): T;

  /**
   * Reverses the order of all children in this List.
   */
  reverse(): Phaser.Structs.List<T>;

  /**
   * Shuffles the items in the list.
   */
  shuffle(): Phaser.Structs.List<T>;

  /**
   * Replaces a child of this List with the given newChild. The newChild cannot be a member of this List.
   * @param oldChild The child in this List that will be replaced.
   * @param newChild The child to be inserted into this List.
   */
  replace(oldChild: T, newChild: T): T;

  /**
   * Checks if an item exists within the List.
   * @param child The item to check for the existence of.
   */
  exists(child: T): boolean;

  /**
   * Sets the property `key` to the given value on all members of this List.
   * @param property The name of the property to set.
   * @param value The value to set the property to.
   * @param startIndex The first child index to start the search from.
   * @param endIndex The last child index to search up until.
   */
  setAll(
    property: string,
    value: T,
    startIndex?: number,
    endIndex?: number
  ): void;

  /**
   * Passes all children to the given callback.
   * @param callback The function to call.
   * @param context Value to use as `this` when executing callback.
   * @param args Additional arguments that will be passed to the callback, after the child.
   */
  each(callback: EachListCallback<T>, context?: any, ...args: any[]): void;

  /**
   * Clears the List and recreates its internal array.
   */
  shutdown(): void;

  /**
   * Destroys this List.
   */
  destroy(): void;

  /**
   * The number of items inside the List.
   */
  readonly length: number;

  /**
   * The first item in the List or `null` for an empty List.
   */
  readonly first: T;

  /**
   * The last item in the List, or `null` for an empty List.
   */
  readonly last: T;

  /**
   * The next item in the List, or `null` if the entire List has been traversed.
   *
   * This property can be read successively after reading {@link #first} or manually setting the {@link #position} to iterate the List.
   */
  readonly next: T;

  /**
   * The previous item in the List, or `null` if the entire List has been traversed.
   *
   * This property can be read successively after reading {@link #last} or manually setting the {@link #position} to iterate the List backwards.
   */
  readonly previous: T;
}
