/**
 * Dependencies
 */
const { plural } = require('pluralize');
const { getByIdFromCollection } = require('./utils');

/**
 * Common object population interface
 *
 * Function that can populate an object
 * according to a set of collections
 *
 * NOTE: See unit tests for usage and purpose
 */
module.exports = function populateByConvention() {
  return typeof Proxy !== 'undefined' ?
  populateByProxy.apply(null, arguments) :
  populateByAssign.apply(null, arguments);
}

/**
 * Object population / linking implemented with ES6 Proxies
 *
 * Creates a proxied object which will resolve
 * to the collections recursively by convention.
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
   * List collection keys
   */
  const collectionKeys = Reflect.ownKeys(collections);

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
       * For collection references (list of ids) (Array)
       */
      if (Array.isArray(value) && collectionKeys.includes(key)) {
        return value
        .map(getByIdFromCollection(collections[key]))
        .filter(function(x) { return x })
        .map(populateByProxy.bind(null, depth - 1, collections));
      }

      /**
       * For collection references (list of ids) (Map)
       */
      if (typeof value === 'object' && collectionKeys.includes(key)) {
        return Reflect.ownKeys(value)
        .map(getByIdFromCollection(collections[key]))
        .filter(function(x) { return x })
        .map(populateByProxy.bind(null, depth - 1, collections))
        .reduce(function(res, item) {
          return Object.assign({}, res, {
            [item.id]: item
          });
        }, {});
      }

      /**
       * For single value references (single id)
       */
      if (collectionKeys.includes(plural(key))) {
        return populateByProxy(
          depth - 1,
          collections,
          getByIdFromCollection(collections[plural(key)])(value)
        );
      }

      /**
       * Handle nested objects
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
 * against the collections recursively by convention.
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
  if (!object || typeof object !== 'object') {
    return object;
  }

  /**
   * List collection keys
   */
  const collectionKeys = Object.keys(collections);

  /**
   * Recursively populate sub-items
   */
  function populateRecursively(depthLeft, subItem) {
    /**
     * Handle null/undefined/primitive values
     */
    if (!subItem || typeof subItem !== 'object') {
      return subItem;
    }

    const objectKeys = Object.keys(subItem);

    /**
     * Extend / populate object
     */
    return objectKeys.reduce(function(result, key) {
      /**
       * For collection references (list of ids) (Array)
       */
      if (
        collectionKeys.includes(key) &&
        Array.isArray(subItem[key])
      ) {
        return Object.assign({}, result, {
          [key]: !depthLeft ? (
            subItem[key]
          ) : (
            subItem[key]
            .map(getByIdFromCollection(collections[key]))
            .filter(function(x) { return x })
            .map(function(item) { return populateRecursively(depthLeft - 1, item) })
          )
        });
      }

      /**
       * For collection references (list of ids) (Map)
       */
      if (
        collectionKeys.includes(key) &&
        subItem[key] &&
        typeof subItem[key] === 'object'
      ) {
        return Object.assign({}, result, {
          [key]: !depthLeft ? (
            subItem[key]
          ) : (
            Object.keys(subItem[key])
            .map(getByIdFromCollection(collections[key]))
            .filter(function(x) { return x })
            .reduce(function(result, item) {
              return Object.assign({}, result, {
                [item.id]: populateRecursively(depthLeft - 1, item)
              });
            }, {})
          )
        });
      }

      /**
       * For single value references (single id)
       */
      if (collectionKeys.includes(plural(key))) {
        return Object.assign({}, result, {
          [key]: !depthLeft ? (
            subItem[key]
          ) : (
            populateRecursively(depthLeft - 1, getByIdFromCollection(collections[plural(key)])(subItem[key]))
          )
        });
      }

      /**
       * Handle arrays objects
       */
      if (Array.isArray(subItem[key])) {
        return Object.assign({}, result, {
          [key]: !depthLeft ? (
            subItem[key]
          ) : (
            subItem[key]
            .filter(function(x) { return x })
            .map(function(item) { return populateRecursively(depthLeft, item) })
          )
        });
      }

      /**
       * Handle nested objects
       */
      if (subItem[key] && typeof subItem[key] === 'object') {
        return Object.assign({}, result, {
          [key]: !depthLeft ? (
            subItem[key]
          ) : (
            populateRecursively(depthLeft, subItem[key])
          )
        })
      }

      return result;
    }, Object.assign({}, subItem));
  }

  /**
   * Handle both objects and array inputs
   */
  return Array.isArray(object) ? (
    object.map(function(item) { return populateRecursively(depth, item) })
  ) : (
    populateRecursively(depth, object)
  );
}
