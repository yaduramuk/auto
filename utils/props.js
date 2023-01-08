const UpperPascalCase = async (str) => {
  try {
    let x = str
      .toLowerCase()
      .split('-')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('');
    return x.charAt(0).toUpperCase() + x.slice(1);
  } catch (error) {
    throw error;
  }
};

const LowerPascalCase = async (str) => {
  try {
    let x = str
      .toLowerCase()
      .split('-')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('');
    return x.charAt(0).toLowerCase() + x.slice(1);
  } catch (error) {
    throw error;
  }
};

const Lower_PascalCase = async (str) => {
  try {
    let x = str
      .toLowerCase()
      .split('_')
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join('');
    return x.charAt(0).toLowerCase() + x.slice(1);
  } catch (error) {
    throw error;
  }
};

const firstLowerCase = async (str) => {
  try { 
    return str.charAt(0).toLowerCase() + str.slice(1);
  } catch (error) {
    throw error;
  }
};

module.exports = { UpperPascalCase, LowerPascalCase, Lower_PascalCase,firstLowerCase };
