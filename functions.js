const fs = require('fs');
const { ncp } = require('ncp');
const chalk = require('chalk');
const {
	SOURCE_FILE_PATH,
	SOURCE_FOLDER_PATH,
	DATA_FOLDER_NAME,
	DATA_FOLDER_SEPERATOR,
	DESTINATION_PATH,
} = require('./config.json');

// Make a directory and if it already exists do nothing
const mkdir = dir => {
	try {
		return fs.mkdirSync(dir);
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw new Error(error);
		} else {
			return undefined;
		}
	}
};
exports.mkdir = mkdir;

// Copy a file from the source to the destination
const copy = (src, dest) => {
	return fs.copyFile(src, dest, error => {
		if (error) {
			throw console.error(error);
		} else {
			return;
		}
	});
};
exports.copy = copy;

// Copy a directory === Copy all files from the source, then make a new directory with the same name in the destination and paste all the files in the new directory
const copyDir = (src, dest) => {
	return ncp(src, dest, error => {
		if (error) {
			throw console.error(error);
		} else {
			return;
		}
	});
};
exports.copyDir = copyDir;

// If needed, add 0s to the parts of a date
const dateTimePad = (value, digits) => {
	let number = value;

	while (number.toString().length < digits) number = `0${number}`;

	return number;
};
exports.dateTimePad = dateTimePad;

// Main function
const COPY = async () => {
	let i = 1; // This number gets used for making numbered data folders
	while (
		fs.existsSync(
			`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${i}`
		)
	)
		i++; // As long as a Data folder with with the number exists, increase the number by 1

	mkdir(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${i}`); // Make a numbered data folder

	// Copy the source file, if one was provided
	if (SOURCE_FILE_PATH)
		copy(
			SOURCE_FILE_PATH,
			`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${i}/${SOURCE_FILE_PATH.split(
				'/'
			).pop()}`
		);
	// Copy the source folder, if one was provided
	if (SOURCE_FOLDER_PATH)
		copyDir(
			SOURCE_FOLDER_PATH,
			`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${i}/${SOURCE_FOLDER_PATH.split(
				'/'
			).pop()}`
		);

	// Logging
	const date = new Date(Date.now());
	console.log(
		chalk.green.bold(
			`The ${
				SOURCE_FILE_PATH
					? `${chalk.yellow.underline(SOURCE_FILE_PATH.split('/').pop())} file`
					: ''
			} ${
				SOURCE_FOLDER_PATH
					? `${SOURCE_FILE_PATH ? 'and the ' : ''}${chalk.yellow.underline(
							SOURCE_FOLDER_PATH.split('/').pop()
					  )} folder ${SOURCE_FILE_PATH ? 'were' : 'was'}`
					: 'was'
			} successfully copied to the ${chalk.yellow.underline(
				`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${i}`
			)} directory! | #${i} | ${`${date.getFullYear()}-${dateTimePad(
				date.getMonth() + 1,
				2
			)}-${dateTimePad(date.getDate(), 2)} ${dateTimePad(
				date.getHours(),
				2
			)}:${dateTimePad(date.getMinutes(), 2)}:${dateTimePad(
				date.getSeconds(),
				2
			)}`}`
		)
	);
};
exports.COPY = COPY;
