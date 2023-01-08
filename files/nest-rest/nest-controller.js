let nestControllerFile = (fileName, name) => {
  var data = `import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from "../../../../middle-wares/session-info.decorator"
import { Roles } from '../../../../middle-wares/roles.decorator';
import { ${name}Service } from "./${fileName}.service";
import { ${name}Input, ${name}SearchInput, ${name}EntityInput, ${name}ToggleInput } from './${fileName}.input';

@ApiTags('${name}')
@Controller('${fileName}')

export class ${name}Controller {

    constructor(private service: ${name}Service) { }

    @Roles() //'${fileName}', 'read_access'
    @ApiBearerAuth()
    @Post("/search")
    async search(@Body() body: ${name}SearchInput, @SessionInfo() sessionInfo: any) {
        try {
            let result = null;
            this.service.sessionInfo = sessionInfo;
            if (body && body.id) {
                result = await this.service.entity(body.id);
            } else {
                result = await this.service.search(body);
            }
            return { data: result };
        } catch (error) {
            console.log(error);
            return { error: error };
        }
    }

    @Roles() //'${fileName}', 'read_access'
    @ApiBearerAuth()
    @Post('/entity')
    async entity(@Body() body: ${name}EntityInput, @SessionInfo() sessionInfo: any) {
        try {
        let result = null;
        this.service.sessionInfo = sessionInfo;
        result = await this.service.entity(body.id);
        return { data: result };
        } catch (error) {
        console.log(error);
        return { error: error };
        }
    }

    @Roles() //'${fileName}', 'write_access'
    @ApiBearerAuth()
    @Post("/save")
    async save(@Body() body: ${name}Input, @SessionInfo() sessionInfo: any) {
        try {
            let result = null;
            this.service.sessionInfo = sessionInfo;
            result = await this.service.save(body);
            return { data: result };
        } catch (error) {
            console.error(error);
            return { error: error };
        }
    }

    @Roles() //'${fileName}', 'write_access'
    @ApiBearerAuth()
    @Post('/toggle')
    async toggle(@Body() body: ${name}ToggleInput, @SessionInfo() sessionInfo: any) {
        try {
        let result = null;
        this.service.sessionInfo = sessionInfo;
        result = await this.service.toggle(body.id);
        return { data: result };
        } catch (error) {
        console.error(error);
        return { error: error };
        }
    }
}`;
  return data;
};

module.exports = nestControllerFile;
