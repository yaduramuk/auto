const { UpperPascalCase } = require('../../utils/props');

const nestControllerFile = async (fileName) => {
  const UpperName = await UpperPascalCase(fileName);
  const data = `import { HttpException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { SessionInfo } from '@middle-wares/session-info.decorator';
import { Roles } from '@middle-wares/roles.decorator';

import { ${UpperName}Service } from "./${fileName}.service";
import { ${UpperName}Input, ${UpperName}SearchInput, ${UpperName}EntityInput, ${UpperName}ToggleInput } from './${fileName}.input';
import { ${UpperName}Model } from './${fileName}.model';

@Resolver()
export class ${UpperName}Resolver {

constructor(private service: ${UpperName}Service) { }

@Roles() //'${fileName}', 'read_access'
@Query(() => [${UpperName}Model]) // Search @SessionInfo() sessionInfo: any
async ${UpperName}Search(@Args('input') input: ${UpperName}SearchInput) {
    try {
        // this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.search(data);
    } catch (error) {
        console.log(error);
        throw new HttpException(error, 600)
    }
}

@Roles() //'${fileName}', 'read_access'
@Query(() => ${UpperName}Model) // Entity @SessionInfo() sessionInfo: any
async ${UpperName}Entity(@Args('input') input:  ${UpperName}EntityInput) {
    try {
        // this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.entity(data);
    } catch (error) {
        console.log(error);
        throw new HttpException(error, 600)
    }
}

@Roles('${fileName}', 'write_access') //'${fileName}', 'write_access'
@Mutation(() => ${UpperName}Model) // Save
async ${UpperName}Save(@Args('input') input: ${UpperName}Input, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.save(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('${fileName}', 'write_access') //'${fileName}', 'write_access'
@Mutation(() => [${UpperName}Model]) // Save Batch
async ${UpperName}SaveBatch(@Args('input', { type: () => [${UpperName}Input] }) input: ${UpperName}Input[], @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input));
        return await this.service.saveBatch(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('${fileName}', 'write_access') //'${fileName}', 'write_access'
@Mutation(() => ${UpperName}Model) // Toggle
async ${UpperName}Toggle(@Args('input') input: ${UpperName}ToggleInput, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.toggle(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

@Roles('${fileName}', 'write_access') //'${fileName}', 'write_access'
@Mutation(() => ${UpperName}Model) // Toggle
async ${UpperName}Delete(@Args('input') input: ${UpperName}ToggleInput, @SessionInfo() sessionInfo: any) {
    try {
        this.service.sessionInfo = sessionInfo;
        const data = JSON.parse(JSON.stringify(input.id));
        return await this.service.delete(data);
    } catch (error) {
        console.error(error);
        throw new HttpException(error, 600)
    }
}

}`;
  return data;
};

module.exports = nestControllerFile;
