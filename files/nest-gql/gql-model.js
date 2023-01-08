const { UpperPascalCase, LowerPascalCase } = require('../../utils/props');

let nestInputFile = async (fileName, inputGen) => {
  let UpperName = await UpperPascalCase(fileName);
  var data = `import { ObjectType, Field } from '@nestjs/graphql';
\timport JSON from 'graphql-type-json'
\timport { HotelModel } from '@hotel/hotel.model';
@ObjectType()
export class ${UpperName}Model {

${inputGen}

@Field({ nullable: true })
message: string | null;
}
`;
  return data;
};

module.exports = nestInputFile;
