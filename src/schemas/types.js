export const typeFormatChoices = [
  {
    'key': 'int32',
    'label': '32-bit integer',
    'conditions': {
      '../type': 'integer'
    }
  },
  {
    'key': 'int64',
    'label': '64-bit integer',
    'conditions': {
      '../type': 'integer'
    }
  },
  {
    'key': 'float',
    'label': '32-bit floating point',
    'conditions': {
      '../type': 'number'
    }
  },
  {
    'key': 'double',
    'label': '64-bit floating point',
    'conditions': {
      '../type': 'number'
    }
  },
  {
    'key': '',
    'i18nKey': 'string',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'byte',
    'label': 'Byte (Base64)',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'binary',
    'label': 'Binary (octet sequence)',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'date',
    'label': 'Date',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'date-time',
    'label': 'Date and Time',
    'conditions': {
      '../type': 'string'
    }
  },
  {
    'key': 'password',
    'label': 'Password',
    'conditions': {
      '../type': 'string'
    }
  }
];

// I18n config to make the label blank.
const blankLabel = {
  'keys': {
    'label': 'blank'
  }
};

export const enumItem = {
  'type': 'selectable',
  'i18n': {
    'path': 'form.enum.item',
    'keys': {
      'label': 'blank'
    }
  },
  'isCollapsible': false,
  'typeKey': '',
  'setValueListeners': [
    (field, newValue) => {
      if (!newValue) {
        return;
      }
      switch (typeof newValue) {
      case 'number':
        if (Number.isInteger(newValue)) {
          field.setType('integer');
        } else {
          field.setType('number');
        }
        break;
      case 'object':
        if (Array.isArray(newValue)) {
          field.setType('array');
        }
        // falls through
      case 'null':
        field.setType('string');
        break;
      default:
        field.setType(typeof newValue);
      }
    }
  ],
  'types': {
    'string': {
      'type': 'text',
      'i18n': blankLabel
    },
    'integer': {
      'type': 'text',
      'format': 'number',
      'i18n': blankLabel
    },
    'number': {
      'type': 'text',
      'format': 'number',
      'i18n': blankLabel
    },
    'boolean': {
      'type': 'option',
      'format': 'checkbox',
      'hideValueIfEmpty': false,
      'i18n': blankLabel
    },
    'array': {
      'type': 'array',
      'item': {
        'type': 'lazylink',
        'target': '/common/enum-item'
      },
      'hideValueIfEmpty': false,
      'i18n': blankLabel
    }
  }
};

const defaultValue = Object.assign({}, enumItem);
defaultValue.i18n = {
  'path': 'form.enum.item',
  'keys': {
    'label': 'form.defaultValue.label'
  }
};
defaultValue.conditions = {
  '../x-oad-type': ['string', 'integer', 'boolean', 'number', 'array', 'null']
};

export const enumArray = {
  'type': 'array',
  'i18n': {
    'path': 'form.enum'
  },
  'hideValueIfEmpty': true,
  'item': enumItem
};

const enumIfHasType = Object.assign({}, enumArray);
enumIfHasType.conditions = {
  '../x-oad-type': ['string', 'integer', 'boolean', 'number', 'array', 'null']
};

export const allOf = {
  'type': 'array',
  'hideValueIfEmpty': false,
  'i18n': {
    'path': 'form.types.allOf'
  },
  'item': {
    'type': 'lazylink',
    'target': '/global-definitions/types/:item',
    'overrides': {
      'i18n': {
        'path': 'form.types.item',
        'keys': {
          'label': 'form.types.allOf.item.label'
        },
        'interpolations': {
          'index': '${..:humanIndex}'
        }
      },
      'legendChildren/name': null,
      'legendChildren/x-oad-type/columns': 8
    }
  }
};

export const types = {
  'type': 'array',
  'format': 'map',
  'keyField': 'name',
  'showValueInParent': false,
  'addIndexToChildLabel': false,
  'collapseManagement': true,
  'isCollapsible': false,
  'newItemText': 'New Type',
  'i18n': {
    'path': 'form.types'
  },
  'item': {
    'type': 'object',
    'setValueListeners': [
      (field, newValue) => {
        if (newValue.hasOwnProperty('allOf')) {
          field.legendChildren['x-oad-type'].setValue('allOf');
        } else if (newValue.hasOwnProperty('$ref')) {
          field.legendChildren['x-oad-type'].setValue('reference');
        } else if (newValue.hasOwnProperty('type')) {
          field.legendChildren['x-oad-type'].setValue(newValue.type);
        }
      }
    ],
    'i18n': {
      'path': 'form.types.item',
      'interpolations': {
        'name': '${#/name}',
        'type': '${#/x-oad-type}'
      }
    },
    'label': 'Type #$index: ${#/name}',
    'legendChildren': {
      'x-oad-type': {
        'type': 'option',
        'columns': '4',
        'placeholder': 'Type name',
        'format': 'dropdown',
        'choices': [
          {'key': '', 'i18nKey': 'choose'},
          'string', 'integer', 'boolean', 'number', 'array', 'object', 'reference', 'allOf', 'null'
        ],
        'validation': ['required']
      },
      'name': {
        'type': 'text',
        'columns': '4',
        'label': 'Enter key...',
        'validation': ['required']
      }
    },
    'children': {
      '$ref': {
        'type': 'option',
        'format': 'dropdown',
        'label': 'Target',
        'hideIfNoChoices': false,
        'choices': [{
          'key': '',
          'i18nKey': 'choose'
        }],
        'dataSources': [{
          'source': '/global-definitions/types',
          'key': '#/definitions/${#/name}',
          'label': 'Type ${#/name}'
        }],
        'validation': ['requiredIfLegendTypeIsReference'],
        'conditions': {
          '../x-oad-type': 'reference'
        }
      },
      'allOf': {
        'type': 'lazylink',
        'target': '/common/types-allof',
        'conditions': {
          '../x-oad-type': 'allOf'
        }
      },
      'type': {
        'type': 'link',
        'target': '../x-oad-type',
        'conditions': {
          '../x-oad-type': ['string', 'integer', 'boolean', 'number', 'array', 'object', 'null']
        }
      },
      'title': {
        'type': 'text',
        'conditions': {
          '../x-oad-type': ['string', 'integer', 'boolean', 'number', 'array', 'object', 'null']
        }
      },
      'description': {
        'type': 'markdown',
        'conditions': {
          '../x-oad-type': ['string', 'integer', 'boolean', 'number', 'array', 'object', 'null']
        }
      },
      'format': {
        'type': 'option',
        'format': 'dropdown',
        'choices': typeFormatChoices
      },
      'enum': enumIfHasType,
      'default': defaultValue,
      'readOnly': {
        'type': 'option',
        'format': 'checkbox',
        'checkboxFormat': 'simple',
        'choices': [{'i18nKey': '/blank', 'key': ''}],
        'conditions': {
          // Check if the property this readOnly field is in is the child of a
          // object property/definition.
          '../../../../x-oad-type': 'object'
        }
      },
      'items': {
        'type': 'lazylink',
        'target': '/global-definitions/types/:item',
        'overrides': {
          'labelFormat': 'Array item',
          'i18n/keys': {
            'label': 'form.types.item.items.label'
          },
          'legendChildren/name': null,
          'legendChildren/x-oad-type/columns': 8
        },
        'conditions': {
          '../x-oad-type': 'array'
        }
      },
      'uniqueItems': {
        'type': 'option',
        'format': 'checkbox',
        'checkboxFormat': 'simple',
        'choices': [{'i18nKey': '/blank', 'key': ''}],
        'conditions': {
          '../x-oad-type': 'array'
        }
      },
      'properties': {
        'type': 'lazylink',
        'target': '/global-definitions/types',
        'overrides': {
          'i18n/keys': {
            'label': 'form.types.item.properties.label'
          },
          '#/:item;i18n': {
            'path': 'form.types.item',
            'keys': {
              'label': 'form.types.item.properties.item.label'
            },
            'interpolations': {
              'name': '${#/name}',
              'type': '${#/type}'
            }
          }
        },
        'conditions': {
          '../x-oad-type': 'object'
        }
      },
      'additionalProperties': {
        'type': 'lazylink',
        'target': '/global-definitions/types/:item',
        'overrides': {
          'i18n/keys': {
            'label': 'form.types.item.additionalProperties.label'
          },
          'legendChildren/name': null,
          'legendChildren/x-oad-type/columns': 8,
          'legendChildren/x-oad-type/validation': [],
          'collapsed': true
        },
        'conditions': {
          '../x-oad-type': 'object'
        }
      },
      'required': {
        'label': 'Required subfields',
        'type': 'array',
        'hideValueIfEmpty': true,
        'item': {
          'type': 'option',
          'format': 'dropdown',
          'hideIfNoChoices': false,
          'choices': [{
            'key': '',
            'i18nKey': 'choose'
          }],
          'dataSources': [{
            'source': '../../properties/:child',
            'key': '${#/name}',
            'label': 'Field ${#/name}'
          }],
          'label': 'Required subfield'
        },
        'conditions': {
          '../x-oad-type': 'object'
        }
      }
    }
  }
};
