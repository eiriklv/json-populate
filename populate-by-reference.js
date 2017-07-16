/**
 * Dependencies
 */
const { getByIdFromCollection } = require('./utils');

/**
 * Object population / linking implemented with ES6 Proxies
 *
 * Creates a proxied object which will resolve
 * to the collections recursively by reference.
 *
 * NOTE: Lazy evaluation (faster) implemented using ES6 Proxies and getter traps
 */
const populateByProxy = module.exports.populateByProxy = function populateByProxy(
  depth = 0,
  collections = {},
  object
) {
  /**
   * Handle invalid input
   */
  if (!object || typeof object !== 'object') {
    return object;
  }

  /**
   * Check if the object contains the $ref key and populate agains the correct collection
   */
  if (
    typeof object === 'object' &&
    Object.keys(object).includes('$ref') &&
    Object.keys(object).includes('id')
  ) {
    return populateByProxy(
      depth - 1,
      collections,
      getByIdFromCollection(collections[object.$ref])(object.id)
    );
  }

  /**
   * Create proxy trap handler for all get calls
   */
  const handler = {
    get(target, key, receiver) {
      /**
       * Get the accessed value
       */
      const value = Reflect.get(target, key, receiver);

      /**
       * Handle symbol access
       */
      if (typeof key === 'symbol' || depth <= 0) {
        return value;
      }

      /**
       * Handle nested objects and arrays
       */
      if (value && typeof value === 'object') {
        return populateByProxy(depth, collections, value);
      }

      /**
       * Handle primitive values
       */
      return value;
    },
  };

  /**
   * Return a proxied object or a list of proxied object
   */
  return Array.isArray(object) ? (
    object.map((item) => populateByProxy(depth, collections, item))
  ) : (
    new Proxy(object, handler)
  );
}

/**
 * Object population / linking implemented with recursive Object.assign
 *
 * Creates a new object/array which has been populated
 * against the collections recursively by reference.
 *
 * NOTE: Eager evaluation (slow)
 * NOTE: Only for compatibility (very memory inefficient)
 */
const populateByAssign = module.exports.populateByAssign = function populateByAssign(
  depth = 0,
  collections = {},
  object
) {
  /**
   * Handle null/undefined/primitive values
   */
  if (!object || typeof object !== 'object' || depth <= 0) {
    return object;
  }

  /**
   * Check if the object contains the $ref key and populate agains the correct collection
   */
  if (
    typeof object === 'object' &&
    Object.keys(object).includes('$ref') &&
    Object.keys(object).includes('id')
  ) {
    return populateByAssign(
      depth - 1,
      collections,
      getByIdFromCollection(collections[object.$ref])(object.id)
    );
  }

  const objectKeys = Object.keys(object);

  /**
   * Handle both objects and array inputs
   */
  return Array.isArray(object) ? (
    object.map((item) => populateByAssign(depth, collections, item))
  ) : (
    objectKeys.reduce((result, key) => {
      return Object.assign({}, result, {
        [key]: populateByAssign(depth, collections, object[key]),
      });
    }, Object.assign({}, object))
  );
}