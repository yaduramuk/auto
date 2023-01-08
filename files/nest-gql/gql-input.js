const { UpperPascalCase, LowerPascalCase } = require('../../utils/props');

let nestInputFile = async (fileName, inputGen) => {
  let UpperName = await UpperPascalCase(fileName);
  var data = `import { InputType, Field } from '@nestjs/graphql';
\timport JSON from 'graphql-type-json'
\timport { HotelInput } from '@hotel/hotel.input';

@InputType()
export class ${UpperName}Input {

${inputGen}

}

@InputType()
export class ${UpperName}SearchInput {

${inputGen}

}

@InputType()
export class ${UpperName}EntityInput {

  @Field({ nullable: true })
  id: string;

}

@InputType()
export class ${UpperName}ToggleInput {

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  active:boolean

}
`;
  return data;
};

module.exports = nestInputFile;
