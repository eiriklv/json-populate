JSON-populate
=============

Tool for populating JSON data with infinitely recursive circular references. Sort of like Falcor, but for plain JSON.

[![npm version](https://badge.fury.io/js/json-populate.svg)](https://badge.fury.io/js/json-populate)

## Usage examples

Populating by naming convention:

```js
/**
 * Import lib
 */
const { populateByConvention } = require('json-populate');

/**
 * Example data
 */
const stories = [
  {
    type: 'story',
    id: 'story-1',
    author: {
      person: 'person-1',
    },
  },
  {
    type: 'story',
    id: 'story-2',
    author: {
      person: 'person-2',
    },
  },
];

const people = [
  {
    type: 'person',
    id: 'person-1',
    name: 'John Storywriter',
    authored: {
      stories: ['story-1'],
    },
    likes: {
      stories: [
        'story-1',
        'story-2',
      ],
    }
  },
  {
    type: 'person',
    id: 'person-2',
    name: 'Peter Telltale',
    authored: {
      stories: ['story-2'],
    },
    likes: {
      stories: [
        'story-1',
        'story-2',
      ],
    }
  }
];

/**
 * Consolidate the collections into a "graph"
 */
const graph = { people, stories };

/**
 * Choose an entry point to the graph
 */
const entry = people[0];

/**
 * Create ta populated entry point resolved against the graph with a specified depth
 */
const populatedItem = populateByConvention(2, graph, entry);

/**
 * Result
 */
console.log(JSON.stringify(populatedItem, null, 2));

/**
 * {
 *   "type": "person",
 *   "id": "person-1",
 *   "name": "John Storywriter",
 *   "authored": {
 *     "stories": [
 *       {
 *         "type": "story",
 *         "id": "story-1",
 *         "author": {
 *           "person": {
 *             "type": "person",
 *             "id": "person-1",
 *             "name": "John Storywriter",
 *             "authored": {
 *               "stories": [
 *                 "story-1"
 *               ]
 *             },
 *             "likes": {
 *               "stories": [
 *                 "story-1",
 *                 "story-2"
 *               ]
 *             }
 *           }
 *         }
 *       }
 *     ]
 *   },
 *   "likes": {
 *     "stories": [
 *       {
 *         "type": "story",
 *         "id": "story-1",
 *         "author": {
 *           "person": {
 *             "type": "person",
 *             "id": "person-1",
 *             "name": "John Storywriter",
 *             "authored": {
 *               "stories": [
 *                 "story-1"
 *               ]
 *             },
 *             "likes": {
 *               "stories": [
 *                 "story-1",
 *                 "story-2"
 *               ]
 *             }
 *           }
 *         }
 *       },
 *       {
 *         "type": "story",
 *         "id": "story-2",
 *         "author": {
 *           "person": {
 *             "type": "person",
 *             "id": "person-2",
 *             "name": "Peter Telltale",
 *             "authored": {
 *               "stories": [
 *                 "story-2"
 *               ]
 *             },
 *             "likes": {
 *               "stories": [
 *                 "story-1",
 *                 "story-2"
 *               ]
 *             }
 *           }
 *         }
 *       }
 *     ]
 *   }
 * }
 */
```

Populating by explicit reference:

```js
/**
 * Import lib
 */
const { populateByReference } = require('json-populate');

/**
 * Example data
 */
const stories = [
  {
    type: 'story',
    id: 'story-1',
    author: { $ref: 'people', id: 'person-1' }
  },
  {
    type: 'story',
    id: 'story-2',
    author: { $ref: 'people', id: 'person-2' }
  },
];

const people = [
  {
    type: 'person',
    id: 'person-1',
    name: 'John Storywriter',
    authored: [
      { $ref: 'stories', id: 'story-1' },
    ],
    likes: [
      { $ref: 'stories', id: 'story-1' },
      { $ref: 'stories', id: 'story-2' },
    ],
  },
  {
    type: 'person',
    id: 'person-2',
    name: 'Peter Telltale',
    authored: [
      { $ref: 'stories', id: 'story-2' },
    ],
    likes: [
      { $ref: 'stories', id: 'story-1' },
      { $ref: 'stories', id: 'story-2' },
    ],
  }
];

/**
 * Consolidate the collections into a "graph"
 */
const graph = { people, stories };

/**
 * Choose an entry point to the graph
 */
const entry = people[0];

/**
 * Create ta populated entry point resolved against the graph with a specified depth
 */
const populatedItem = populateByReference(2, graph, entry);

/**
 * Result
 */
console.log(JSON.stringify(populatedItem, null, 2));

/**
 * {
 *   "type": "person",
 *   "id": "person-1",
 *   "name": "John Storywriter",
 *   "authored": [
 *     {
 *       "type": "story",
 *       "id": "story-1",
 *       "author": {
 *         "type": "person",
 *         "id": "person-1",
 *         "name": "John Storywriter",
 *         "authored": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-1"
 *           }
 *         ],
 *         "likes": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-1"
 *           },
 *           {
 *             "$ref": "stories",
 *             "id": "story-2"
 *           }
 *         ]
 *       }
 *     }
 *   ],
 *   "likes": [
 *     {
 *       "type": "story",
 *       "id": "story-1",
 *       "author": {
 *         "type": "person",
 *         "id": "person-1",
 *         "name": "John Storywriter",
 *         "authored": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-1"
 *           }
 *         ],
 *         "likes": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-1"
 *           },
 *           {
 *             "$ref": "stories",
 *             "id": "story-2"
 *           }
 *         ]
 *       }
 *     },
 *     {
 *       "type": "story",
 *       "id": "story-2",
 *       "author": {
 *         "type": "person",
 *         "id": "person-2",
 *         "name": "Peter Telltale",
 *         "authored": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-2"
 *           }
 *         ],
 *         "likes": [
 *           {
 *             "$ref": "stories",
 *             "id": "story-1"
 *           },
 *           {
 *             "$ref": "stories",
 *             "id": "story-2"
 *           }
 *         ]
 *       }
 *     }
 *   ]
 * }
 */
```
