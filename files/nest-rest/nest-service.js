function LowerCase(str) {
  if (str.indexOf(' ') >= 0) {
    return titleCase(str, ' ');
  } else if (str.indexOf('-') >= 0) {
    return titleCase(str, '-');
  } else {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

function titleCase(str, char) {
  let x = str
    .toLowerCase()
    .split(char)
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join('');
  return x.charAt(0).toLowerCase() + x.slice(1);
}

let nestServiceFile = async (fileName, name) => {
  let lowername = LowerCase(name);
  var data = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Transaction, TransactionRepository } from 'typeorm';
import { App } from '../../../../common/App';
import { Props } from '../../../../constants/Props';
import { ${name} } from "./${fileName}.entity";

@Injectable()
export class ${name}Service {

    @InjectRepository(${name})
    private ${lowername}Repository: Repository<${name}>;
    public sessionInfo: any;

    constructor() {}

    async entity(id: any) {
        try {
            let query:any =  { id: id};
            let data: any = await this.${lowername}Repository.findOne(query, {
                relations: [],
                join: {
                    alias: "${name}",
                    leftJoinAndSelect: {
                    }
                }
            });

            return data ? data : null;
        } catch (error) {
            throw error;
        }
    }

    async search(item: any) {
        try {
            let query: any = {};
            if (item) {
              query = item
          }
            // if(item.fromDate && item.toDate){
            //     query.updatedOn = Between(new Date(item.fromDate).toISOString(), new Date(item.toDate).toISOString());
            // } else {
            //     throw { message: Props.INVALID_DATA };
            // }
            let data: any[] = await this.${lowername}Repository.find({
                relations: [],
                where: query
            });

            return data ? data : null;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async save(item: any,
        @TransactionRepository(${name}) ${lowername}Repository?: Repository<${name}>
        ) {
        try {
            await this.validate(item);
            let ${name}Data: any = await ${lowername}Repository.save(item);
            let returnData = { id: item.id, message: Props.SAVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    @Transaction()
    async toggle(id: any, @TransactionRepository(${name}) ${lowername}Repository?: Repository<${name}>) {
        try {
            let data: any = await ${lowername}Repository.findOne(id);
            if (!data) throw { message: Props.RECORD_NOT_EXISTS };
            data.active = !data.active;
            data.updatedBy = this.sessionInfo.id;
            data.updatedOn = new Date(App.DateNow());
            let result: any = await ${lowername}Repository.save(data);
            let returnData = { id: id, message: Props.REMOVED_SUCCESSFULLY };
            return returnData;
        } catch (error) {
            throw error;
        }
    }

    async validate(item: ${name}){
        let previousItem: any = null;
        if (!item.id || item.id.toString() == "" || item.id.toString() == "0") {
            item.id = null;
        } else{
            // previousItem = await this.${lowername}Repository.findOne(item.id);
        }
        // let condData = await this.${lowername}Repository.find( { where : { id: item.id } });
        if (!item.id) {
          let uid = App.uuidv4();
          item.id = uid;
          item.createdBy = this.sessionInfo ? this.sessionInfo.id : 'system';
          item.createdOn = new Date(App.DateNow());
        } else {
            // if (item.updatedOn && previousItem.updatedOn.toISOString() != new Date(item.updatedOn).toISOString()) {
            //     throw { message: Props.MISS_MATCH_MESSAGE };
            // }
        }
        item.updatedBy = this.sessionInfo ? this.sessionInfo.id : 'system';
        item.updatedOn = new Date(App.DateNow());
    }
}`;
  return data;
};

module.exports = nestServiceFile;
