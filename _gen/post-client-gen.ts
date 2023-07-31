const fs = require('fs');
const childProcess = require('child_process');
const path = require('path');

const outputDirPath = path.resolve(__dirname, '..', 'src', 'app', '_gen');
const outputOpenApiPath = path.resolve(outputDirPath, 'openapi.json');

const outputMetadataPath = path.join(outputDirPath, 'api-metadata.ts');

const specification = fs.readFileSync(
    outputOpenApiPath,
    { encoding: 'utf8' }
);

const defineSpecificationType = `export type ApiSpecificationFile = ${specification};`;

const newMetadataString = defineSpecificationType + '\n';

fs.writeFileSync(outputMetadataPath, newMetadataString);
