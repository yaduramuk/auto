const { UpperPascalCase } = require('../../utils/props');

let entityFile = async (OriginalName, fileName, entityGen) => {
  let UpperName = await UpperPascalCase(fileName);
  var data = `import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
  \timport { Hotel } from "@hotel/hotel.entity";

@Entity("${OriginalName}")
export class ${UpperName} {

${entityGen}

}`;
  return data;
};
module.exports = entityFile;
