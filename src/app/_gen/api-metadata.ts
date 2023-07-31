export type ApiSpecificationFile = {
  "x-generator": "NSwag v13.19.0.0 (NJsonSchema v10.9.0.0 (Newtonsoft.Json v13.0.0.0))",
  "openapi": "3.0.0",
  "info": {
    "title": "Smart Form Management API -- Public (v1)",
    "version": "v1"
  },
  "paths": {
    "/api/public/v1/DeploymentVersion": {
      "get": {
        "tags": [
          "DeploymentVersion"
        ],
        "operationId": "DeploymentVersion_GetDeploymentVersion",
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
    "/api/public/v1/Image/{id}": {
      "get": {
        "tags": [
          "Image"
        ],
        "operationId": "Image_GetImage",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          },
          {
            "name": "token",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "x-position": 2
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/brands": {
      "get": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetBrands",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductBrandView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/brands/filter": {
      "post": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_FilterBrands",
        "requestBody": {
          "x-name": "filter",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductBrandsFilter"
              }
            }
          },
          "required": true,
          "x-position": 1
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductBrandView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/brands/{id}": {
      "get": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetBrand",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProductBrandView"
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/brands/{id}/forms": {
      "post": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetFormsForBrand",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductFormView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/forms": {
      "get": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetForms",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductFormView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/forms/filter": {
      "post": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_FilterForms",
        "requestBody": {
          "x-name": "filter",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ProductFormsFilter"
              }
            }
          },
          "required": true,
          "x-position": 1
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductFormView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/forms/{id}": {
      "get": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetForm",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ProductFormView"
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/forms/{id}/brands": {
      "post": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetBrandsForForm",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductBrandView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/Products/brands/{brandId}/forms/{formId}/strengths": {
      "get": {
        "tags": [
          "Products"
        ],
        "operationId": "Products_GetStrengthsForBrandAndForm",
        "parameters": [
          {
            "name": "brandId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 1
          },
          {
            "name": "formId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "guid"
            },
            "x-position": 2
          }
        ],
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ProductBrandFormStrengthView"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/public/v1/ui-localization/strings": {
      "get": {
        "tags": [
          "UiLocalization"
        ],
        "operationId": "UiLocalization_GetLocalizationStrings",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {}
              }
            }
          }
        }
      }
    },
    "/api/public/v1/ui-localization/config": {
      "get": {
        "tags": [
          "UiLocalization"
        ],
        "operationId": "UiLocalization_GetLocalizationConfig",
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UiLocalizationConfiguration"
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
      "DeploymentVersionWithEnvironment": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "fullSemanticVersion",
          "commitHash",
          "buildTimestamp",
          "branchName",
          "buildNumber",
          "environmentName",
          "isProduction"
        ],
        "properties": {
          "fullSemanticVersion": {
            "type": "string",
            "minLength": 1
          },
          "commitHash": {
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
          "buildNumber": {
            "type": "integer",
            "format": "int32"
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
      "ProductBrandView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "primaryImageUrl": {
            "type": "string",
            "format": "uri",
            "nullable": true
          }
        }
      },
      "ProductBrandsFilter": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "formIds": {
            "type": "array",
            "nullable": true,
            "items": {
              "type": "string",
              "format": "guid"
            }
          }
        }
      },
      "ProductFormView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "stages"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "stages": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProductFormStageView"
            }
          },
          "primaryImageUrl": {
            "type": "string",
            "format": "uri",
            "nullable": true
          }
        }
      },
      "ProductFormStageView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "productFormId",
          "name",
          "parts"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "productFormId": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "parts": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ProductFormStagePartView"
            }
          },
          "imageUrl": {
            "type": "string",
            "format": "uri",
            "nullable": true
          }
        }
      },
      "ProductFormStagePartView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "productFormStageId",
          "name"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "productFormStageId": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "stageImageCoordinates": {
            "type": "string",
            "nullable": true
          }
        }
      },
      "ProductFormsFilter": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "brandIds": {
            "type": "array",
            "nullable": true,
            "items": {
              "type": "string",
              "format": "guid"
            }
          }
        }
      },
      "ProductBrandFormStrengthView": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "id",
          "name"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "guid",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          }
        }
      },
      "UiLocalizationConfiguration": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "regions"
        ],
        "properties": {
          "regions": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UiLocalizationConfigurationRegion"
            }
          }
        }
      },
      "UiLocalizationConfigurationRegion": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "englishName",
          "countries"
        ],
        "properties": {
          "englishName": {
            "type": "string",
            "minLength": 1
          },
          "countries": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UiLocalizationConfigurationCountry"
            }
          }
        }
      },
      "UiLocalizationConfigurationCountry": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "englishName",
          "localizedName",
          "languages"
        ],
        "properties": {
          "englishName": {
            "type": "string",
            "minLength": 1
          },
          "localizedName": {
            "type": "string",
            "minLength": 1
          },
          "languages": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/UiLocalizationConfigurationCountryLanguage"
            }
          }
        }
      },
      "UiLocalizationConfigurationCountryLanguage": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "englishName",
          "localizedName",
          "localeCode"
        ],
        "properties": {
          "englishName": {
            "type": "string",
            "minLength": 1
          },
          "localizedName": {
            "type": "string",
            "minLength": 1
          },
          "localeCode": {
            "type": "string",
            "minLength": 1
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
    }
  }
};
