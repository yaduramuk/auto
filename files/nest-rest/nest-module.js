const nestModule = (fileName, name) => {
    var data = `import { Module } from '@nestjs/common';
      import { TypeOrmModule } from '@nestjs/typeorm';
      import { ${name}Service } from './${fileName}/${fileName}.service';
      import { ${name}Controller } from './${fileName}/${fileName}.controller';
      import { ${name} } from './${fileName}/${fileName}.entity';

      @Module({
        imports: [TypeOrmModule.forFeature([${name}])],
        providers: [${name}Service],
        controllers: [${name}Controller],
      })
      export class ${name}Module {}`;
    return data;
  }
  module.exports = nestModule