let entityFile = (OriginalName, entityGen, name) => {
  var data = `import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
@Entity("${OriginalName}")
export class ${name} {
${entityGen}
}`;
  return data;
};
module.exports = entityFile;
