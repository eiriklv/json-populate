/**
 * Import test framework
 */
const test = require('tape');

/**
 * Import the functions we're testing
 */
const { populateByAssign, populateByProxy } = require('./populate-by-reference');

/**
 * Test data
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

const graph = { stories, people };

const functionality = [
  { name: 'populateByProxy', populate: populateByProxy },
  { name: 'populateByAssign', populate: populateByAssign },
];

for (let func of functionality) {
  const { name, populate } = func;

  test(`${name} (case 1)`, function(t) {
    t.plan(1);

    const populatedObject = populate(4, graph, people[0]);

    t.deepEqual(populatedObject, {
      "type": "person",
      "id": "person-1",
      "name": "John Storywriter",
      "authored": [
        {
          "type": "story",
          "id": "story-1",
          "author": {
            "type": "person",
            "id": "person-1",
            "name": "John Storywriter",
            "authored": [
              {
                "type": "story",
                "id": "story-1",
                "author": {
                  "type": "person",
                  "id": "person-1",
                  "name": "John Storywriter",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ],
            "likes": [
              {
                "type": "story",
                "id": "story-1",
                "author": {
                  "type": "person",
                  "id": "person-1",
                  "name": "John Storywriter",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              },
              {
                "type": "story",
                "id": "story-2",
                "author": {
                  "type": "person",
                  "id": "person-2",
                  "name": "Peter Telltale",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ]
          }
        }
      ],
      "likes": [
        {
          "type": "story",
          "id": "story-1",
          "author": {
            "type": "person",
            "id": "person-1",
            "name": "John Storywriter",
            "authored": [
              {
                "type": "story",
                "id": "story-1",
                "author": {
                  "type": "person",
                  "id": "person-1",
                  "name": "John Storywriter",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ],
            "likes": [
              {
                "type": "story",
                "id": "story-1",
                "author": {
                  "type": "person",
                  "id": "person-1",
                  "name": "John Storywriter",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              },
              {
                "type": "story",
                "id": "story-2",
                "author": {
                  "type": "person",
                  "id": "person-2",
                  "name": "Peter Telltale",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "type": "story",
          "id": "story-2",
          "author": {
            "type": "person",
            "id": "person-2",
            "name": "Peter Telltale",
            "authored": [
              {
                "type": "story",
                "id": "story-2",
                "author": {
                  "type": "person",
                  "id": "person-2",
                  "name": "Peter Telltale",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ],
            "likes": [
              {
                "type": "story",
                "id": "story-1",
                "author": {
                  "type": "person",
                  "id": "person-1",
                  "name": "John Storywriter",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              },
              {
                "type": "story",
                "id": "story-2",
                "author": {
                  "type": "person",
                  "id": "person-2",
                  "name": "Peter Telltale",
                  "authored": [
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ],
                  "likes": [
                    {
                      "$ref": "stories",
                      "id": "story-1"
                    },
                    {
                      "$ref": "stories",
                      "id": "story-2"
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    });
  });
}
