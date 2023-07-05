export type ApiSpecificationFile = {
  "x-generator": "NSwag v13.18.2.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0))",
  "openapi": "3.0.0",
  "info": {
    "title": "Smart Form Consumer API",
    "version": "v1"
  },
  "paths": {
    "/api/v1/Image": {
      "post": {
        "tags": [
          "Image"
        ],
        "operationId": "Image_CreateImage",
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "Image": {
                    "type": "string",
                    "format": "binary",
                    "nullable": true
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ImageView"
                }
              }
            }
          }
        },
        "security": [
          {
            "Bearer": [
              "api://e22c24f0-5be5-44c1-8636-477247e61e2a/user_impersonation"
            ]
          }
        ]
      }
    },
    "/api/v1/Meta/deployment": {
      "get": {
        "tags": [
          "Meta"
        ],
        "operationId": "Meta_GetDeploymentVersion",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DeploymentVersionWithEnvironment"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/Meta/angular": {
      "get": {
        "tags": [
          "Meta"
        ],
        "operationId": "Meta_GetAngularMetadata",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AngularMetadata"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ImageView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "createdByUserId",
          "createdOn",
          "updatedOn"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "createdByUserId": {
            "type": "string",
            "minLength": 1
          },
          "createdOn": {
            "type": "string",
            "format": "date-time",
            "minLength": 1
          },
          "updatedOn": {
            "type": "string",
            "format": "date-time",
            "minLength": 1
          }
        }
      },
      "DeploymentVersionWithEnvironment": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "fullSemanticVersion",
          "buildMetadata",
          "buildTimestamp",
          "branchName",
          "environmentName",
          "isProduction"
        ],
        "properties": {
          "fullSemanticVersion": {
            "type": "string",
            "minLength": 1
          },
          "buildMetadata": {
            "type": "string",
            "minLength": 1
          },
          "buildTimestamp": {
            "type": "string",
            "format": "date-time",
            "minLength": 1
          },
          "branchName": {
            "type": "string",
            "minLength": 1
          },
          "environmentName": {
            "type": "string",
            "minLength": 1
          },
          "isProduction": {
            "type": "boolean"
          }
        }
      },
      "AngularMetadata": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "activeDirectory",
          "deploymentVersion",
          "applicationInsightsInstrumentationKey"
        ],
        "properties": {
          "activeDirectory": {
            "$ref": "#/components/schemas/ActiveDirectoryClientMetadata"
          },
          "deploymentVersion": {
            "$ref": "#/components/schemas/DeploymentVersionWithEnvironment"
          },
          "applicationInsightsInstrumentationKey": {
            "type": "string",
            "minLength": 1
          }
        }
      },
      "ActiveDirectoryClientMetadata": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "clientId",
          "tenant",
          "authority",
          "scopes"
        ],
        "properties": {
          "clientId": {
            "type": "string",
            "minLength": 1
          },
          "tenant": {
            "type": "string",
            "minLength": 1
          },
          "authority": {
            "type": "string",
            "minLength": 1
          },
          "scopes": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      },
      "KnownProblemDetailsTypes": {
        "type": "string",
        "x-enumNames": [
          "EntityNotFound",
          "EntityArchived",
          "EntityNameCollision",
          "EntityPatchFailed",
          "EntityVersionConflict",
          "EntityAccessDenied",
          "EntityCapabilityAccessDenied",
          "ClassificationNotFound",
          "FailedIngestion",
          "InvalidIngestionToken",
          "NoMatchingSources",
          "InvalidJsonFileExpression"
        ],
        "enum": [
          "/errors/entity-not-found",
          "/errors/entity-archived",
          "/errors/entity-name-collision",
          "/errors/entity-patch-failed",
          "/errors/entity-version-conflict",
          "/errors/entity-access-denied",
          "/errors/entity-capability-access-denied",
          "/errors/classification-not-found",
          "/errors/ingestion",
          "/errors/ingestion/invalid-token",
          "/errors/sources/no-matching",
          "/errors/invalid-json-file-expression"
        ]
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "oauth2",
        "flows": {
          "implicit": {
            "authorizationUrl": "https://login.microsoftonline.com/3ac94b33-9135-4821-9502-eafda6592a35/oauth2/v2.0/authorize",
            "scopes": {
              "api://e22c24f0-5be5-44c1-8636-477247e61e2a/user_impersonation": "api://e22c24f0-5be5-44c1-8636-477247e61e2a/user_impersonation"
            }
          }
        }
      }
    }
  }
};
