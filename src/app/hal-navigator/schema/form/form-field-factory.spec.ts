import {FormFieldFactory} from '@hal-navigator/schema/form/form-field-factory';
import {FormFieldType} from '@hal-navigator/schema/form/form-field-type';
import {SchemaReferenceFactory} from '@hal-navigator/schema/schema-reference-factory';
import {JsonSchemaDocument} from '@hal-navigator/schema/json-schema';
import {AlpsDocument} from '@hal-navigator/alp-document/alps-document';
import {AlpsDocumentAdapter} from '@hal-navigator/alp-document/alps-document-adapter';

describe('FormFieldFactory', () => {
  it('should create form fields', () => {

    const testee = new FormFieldFactory(null, jsonSchema, true, new SchemaReferenceFactory(jsonSchema.definitions),
      new AlpsDocumentAdapter(alps).getRepresentationDescriptor(), {});

    const meetingGroup = testee.toFormField();
    const fields = meetingGroup.options.getSubFields();

    expect(fields.length).toBe(5);
    expect(fields[0].type).toEqual(FormFieldType.ARRAY);
    expect(fields[1].type).toEqual(FormFieldType.DATE_PICKER);
    expect(fields[2].type).toEqual(FormFieldType.ARRAY);
    expect(fields[3].type).toEqual(FormFieldType.TEXT);
    expect(fields[4].type).toEqual(FormFieldType.DATE_PICKER);

    const preferences = fields[0].options.getArraySpec();
    expect(fields[0].name).toEqual('preferences');
    expect(preferences).toBeDefined();
    expect(preferences.options.getSubFields()).toBeDefined();

    expect(fields[2].options.getArraySpec().type).toEqual(FormFieldType.LINK);
    expect(fields[2].options.getArraySpec().options.getLinkedResource()).toEqual('users');
  });
});

const jsonSchema: JsonSchemaDocument = JSON.parse(`
  {
  "title" : "Meeting group",
  "properties" : {
    "preferences" : {
      "title" : "Preferences",
      "readOnly" : false,
      "type" : "array",
      "items" : {
        "$ref" : "#/definitions/meetingPreference"
      }
    },
    "created" : {
      "title" : "Created",
      "readOnly" : false,
      "type" : "string",
      "format" : "date-time"
    },
    "members" : {
      "title" : "Members",
      "readOnly" : false,
      "type" : "array",
      "uniqueItems" : true,
      "items" : {
        "format" : "uri",
        "type" : "string"
      }
    },
    "name" : {
      "title" : "Name",
      "readOnly" : false,
      "type" : "string"
    },
    "lastModified" : {
      "title" : "Last modified",
      "readOnly" : false,
      "type" : "string",
      "format" : "date-time"
    }
  },
  "requiredProperties" : [ "name" ],
  "definitions" : {
    "meetingPreference" : {
      "type" : "object",
      "properties" : {
        "timeSpan" : {
          "title" : "Time span",
          "readOnly" : false,
          "type" : "object",
          "$ref" : "#/definitions/timeSpan"
        },
        "day" : {
          "title" : "Day",
          "readOnly" : false,
          "type" : "string",
          "format" : "date-time",
          "enum" : [ "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY" ]
        }
      },
      "requiredProperties" : [ "day", "timeSpan" ]
    },
    "timeSpan" : {
      "type" : "object",
      "properties" : {
        "days" : {
          "title" : "Days",
          "readOnly" : false,
          "type" : "integer"
        },
        "from" : {
          "title" : "From",
          "readOnly" : false,
          "type" : "string",
          "format" : "date-time"
        },
        "to" : {
          "title" : "To",
          "readOnly" : false,
          "type" : "string",
          "format" : "date-time"
        }
      },
      "requiredProperties" : [ "from", "to" ]
    }
  },
  "type" : "object",
  "$schema" : "http://json-schema.org/draft-04/schema#"
}
`);

const alps: AlpsDocument = JSON.parse(`
{
  "alps" : {
    "version" : "1.0",
    "descriptors" : [ {
      "id" : "meetingGroup-representation",
      "href" : "http://localhost:4200/profile/meetingGroups",
      "descriptors" : [ {
        "name" : "preferences",
        "type" : "SEMANTIC"
      }, {
        "name" : "name",
        "type" : "SEMANTIC"
      }, {
        "name" : "version",
        "type" : "SEMANTIC"
      }, {
        "name" : "created",
        "type" : "SEMANTIC"
      }, {
        "name" : "lastModified",
        "type" : "SEMANTIC"
      }, {
        "name" : "members",
        "type" : "SAFE",
        "rt" : "http://localhost:4200/profile/users#user-representation"
      } ]
    }, {
      "id" : "get-meetingGroups",
      "name" : "meetingGroups",
      "type" : "SAFE",
      "rt" : "#meetingGroup-representation",
      "descriptors" : [ {
        "name" : "page",
        "doc" : {
          "value" : "The page to return.",
          "format" : "TEXT"
        },
        "type" : "SEMANTIC"
      }, {
        "name" : "size",
        "doc" : {
          "value" : "The size of the page to return.",
          "format" : "TEXT"
        },
        "type" : "SEMANTIC"
      }, {
        "name" : "sort",
        "doc" : {
          "value" : "The sorting criteria to use to calculate the content of the page.",
          "format" : "TEXT"
        },
        "type" : "SEMANTIC"
      } ]
    }, {
      "id" : "create-meetingGroups",
      "name" : "meetingGroups",
      "type" : "UNSAFE",
      "rt" : "#meetingGroup-representation"
    }, {
      "id" : "get-meetingGroup",
      "name" : "meetingGroup",
      "type" : "SAFE",
      "rt" : "#meetingGroup-representation"
    }, {
      "id" : "update-meetingGroup",
      "name" : "meetingGroup",
      "type" : "IDEMPOTENT",
      "rt" : "#meetingGroup-representation"
    }, {
      "id" : "delete-meetingGroup",
      "name" : "meetingGroup",
      "type" : "IDEMPOTENT",
      "rt" : "#meetingGroup-representation"
    }, {
      "id" : "patch-meetingGroup",
      "name" : "meetingGroup",
      "type" : "UNSAFE",
      "rt" : "#meetingGroup-representation"
    } ]
  }
}
`);
