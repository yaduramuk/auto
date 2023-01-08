const { UpperPascalCase, LowerPascalCase } = require('../../utils/props');

let nestInputFile = async (fileName, generateGql) => {
  let UpperName = await UpperPascalCase(fileName);
  var data = `query { ${UpperName}Search(input:{})
    {
    ${generateGql}
    }
}

query {
    ${UpperName}Entity(input: { id: "" }) {
    ${generateGql}
    }
}

mutation {
    ${UpperName}Save(input: {${generateGql}}) {
        id
        message
    }
}

mutation {
    ${UpperName}Toggle(input: { id: "ABCD" }) {
        id
        message
    }
}
`;
  return data;
};
module.exports = nestInputFile;
