/**
 * Dependencies
 */
const { getByIdFromCollection } = require('./utils');

/**
 * Common object population interface
 *
 * Function that can populate an object
 * according to a set of collections
 *
 * NOTE: See unit tests for usage and purpose
 */
module.exports = function populateByReference() {
  return typeof Proxy !== 'undefined' ?
  populateByProxy.apply(null, arguments) :
  populateByAssign.apply(null, arguments);
}

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
  if ((!object || typeof object !== 'object') && typeof object === null) {
    return object;
  }

  /**
   * Check if the object contains the $ref key and populate agains the correct collection
   */
  if (
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
       * Handle dates (Date methods are not supported by proxies)
       */
      if (typeof value === 'object' && !!value.getTime) {
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
    object.map(function(item) { return populateByProxy(depth, collections, item) })
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
    object.map(function(item) { return populateByAssign(depth, collections, item) })
  ) : (
    objectKeys.reduce(function(result, key) {
      return Object.assign({}, result, {
        [key]: populateByAssign(depth, collections, object[key]),
      });
    }, Object.assign({}, object))
  );
}
