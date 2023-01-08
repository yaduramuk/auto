const { UpperPascalCase } = require('../../utils/props');

const nestModule = async (fileName) => {
  let UpperName = await UpperPascalCase(fileName);
  let data = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ${UpperName}Service } from './${fileName}/${fileName}.service';
import { ${UpperName}Resolver } from './${fileName}/${fileName}.resolver';
import { ${UpperName} } from './${fileName}/${fileName}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${UpperName}])],
  providers: [${UpperName}Resolver, ${UpperName}Service],
})
export class ${UpperName}Module {}`;
  return data;
};
module.exports = nestModule;
