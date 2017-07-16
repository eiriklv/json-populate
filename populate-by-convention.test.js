/**
 * Import test framework
 */
const test = require('tape');

/**
 * Import the functions we're testing
 */
const { populateByAssign, populateByProxy } = require('./populate-by-convention');

/**
 * Test data
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
      "authored": {
        "stories": [
          {
            "type": "story",
            "id": "story-1",
            "author": {
              "person": {
                "type": "person",
                "id": "person-1",
                "name": "John Storywriter",
                "authored": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-1",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-1",
                          "name": "John Storywriter",
                          "authored": {
                            "stories": [
                              "story-1"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                },
                "likes": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-1",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-1",
                          "name": "John Storywriter",
                          "authored": {
                            "stories": [
                              "story-1"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    },
                    {
                      "type": "story",
                      "id": "story-2",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-2",
                          "name": "Peter Telltale",
                          "authored": {
                            "stories": [
                              "story-2"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      },
      "likes": {
        "stories": [
          {
            "type": "story",
            "id": "story-1",
            "author": {
              "person": {
                "type": "person",
                "id": "person-1",
                "name": "John Storywriter",
                "authored": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-1",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-1",
                          "name": "John Storywriter",
                          "authored": {
                            "stories": [
                              "story-1"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                },
                "likes": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-1",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-1",
                          "name": "John Storywriter",
                          "authored": {
                            "stories": [
                              "story-1"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    },
                    {
                      "type": "story",
                      "id": "story-2",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-2",
                          "name": "Peter Telltale",
                          "authored": {
                            "stories": [
                              "story-2"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          {
            "type": "story",
            "id": "story-2",
            "author": {
              "person": {
                "type": "person",
                "id": "person-2",
                "name": "Peter Telltale",
                "authored": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-2",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-2",
                          "name": "Peter Telltale",
                          "authored": {
                            "stories": [
                              "story-2"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                },
                "likes": {
                  "stories": [
                    {
                      "type": "story",
                      "id": "story-1",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-1",
                          "name": "John Storywriter",
                          "authored": {
                            "stories": [
                              "story-1"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    },
                    {
                      "type": "story",
                      "id": "story-2",
                      "author": {
                        "person": {
                          "type": "person",
                          "id": "person-2",
                          "name": "Peter Telltale",
                          "authored": {
                            "stories": [
                              "story-2"
                            ]
                          },
                          "likes": {
                            "stories": [
                              "story-1",
                              "story-2"
                            ]
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    });
  });
}
