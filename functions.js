const fs = require('fs');
const ncp = require('ncp').ncp;


// Functions

// Make a directory and if it already exists do nothing
var mkdir = dir => {
	try {
		return fs.mkdirSync(dir);
	} catch (error) {
	  if (error.code !== 'EEXIST') {
			throw console.error(error);
		} else {
      return
    }
	}
};
exports.mkdir = mkdir;

// Copy a file from the source to the destination
var copy = (src, dest) => {
	return fs.copyFile(src, dest, error => {
    if (error) {
      throw console.error(error);
    } else {
      return
    }
  });
};
exports.copy = copy;

// Copy a directory === Copy all files from the source, then make a new directory with the same name in the destination and paste all the files in the new directory
var copyDir = (src, dest) => {
  return ncp(src, dest, error => {
    if (error) {
      throw console.error(error);
    } else {
      return
    }
  });
};
exports.copyDir = copyDir;

// If needed, add 0s to the parts of a date
var dateTimePad = (value, digits) => {
  let number = value;

  while (number.toString().length < digits) number = '0' + number

  return number;
};
exports.dateTimePad = dateTimePad;