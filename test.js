let result1 = [
  { value: '0', display: 'Jamsheer' },
  { value: '1', display: 'Muhammed' },
  { value: '2', display: 'Ravi' },
  { value: '3', display: 'Ajmal' },
  { value: '4', display: 'Ryan' },
];

// Result 2
let result2 = [
  { value: '0', display: 'Jamsheer' },
  { value: '1', display: 'Muhammed' },
  { value: '2', display: 'Ravi' },
  { value: '3', display: 'Ajmal' },
];

//Find values that are in result1 but not in result2
var uniqueResultOne = result1.filter(function (obj) {
  return !result2.some(function (obj2) {
    if (obj.value == obj2.value && obj.display == obj2.display) {
      return obj2;
    }
  });
});

//Find values that are in result2 but not in result1
// var uniqueResultTwo = result2.filter(function (obj) {
//   return !result1.some(function (obj2) {
//     return obj.value == obj2.value;
//   });
// });

//Combine the two arrays of unique entries
// var result = uniqueResultOne.concat(uniqueResultTwo);

console.log(uniqueResultOne);
