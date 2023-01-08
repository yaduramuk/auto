let nestInputFile = (inputGen, name) => {
  var data = `import { ApiProperty } from '@nestjs/swagger';
export class ${name}Input {
${inputGen}
}

export class ${name}SearchInput {
  @ApiProperty({ example: "" })
  id: string;
}
export class ${name}EntityInput {
    @ApiProperty({ required: true, example: "" })
    id: string;
}

export class ${name}ToggleInput {
    @ApiProperty({ required: true, example: "" })
    id: string;
}
`;
  return data;
};

module.exports = nestInputFile;
