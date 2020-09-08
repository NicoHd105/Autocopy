const fs = require('fs');
const chalk = require('chalk');
const ms = require('ms');
const manager = require('./functions.js');
const { SOURCE_FILE_PATH, SOURCE_FOLDER_PATH, DATA_FOLDER_NAME, DATA_FOLDER_SEPERATOR, DESTINATION_PATH, INTERVALTIME } = require('./config.json');


// Making sure the necessary properties have been provided and they are valid
if (!SOURCE_FILE_PATH && !SOURCE_FOLDER_PATH) return console.log(chalk.red.bold('Neither a source file or a source folder have been provided!'));
if (SOURCE_FILE_PATH && !fs.existsSync(SOURCE_FILE_PATH)) return console.log(chalk.red.bold(`The source file path ${chalk.yellow(SOURCE_FILE_PATH)} is not a valid path!`));
if (SOURCE_FOLDER_PATH && !fs.existsSync(SOURCE_FOLDER_PATH)) return console.log(chalk.red.bold(`The source folder path ${chalk.yellow(SOURCE_FOLDER_PATH)} is not a valid path!`));
if (!DATA_FOLDER_NAME) return console.log(chalk.red.bold('No name for the data folders has been provided!'));
if (!DATA_FOLDER_SEPERATOR) return console.log(chalk.red.bold('No seperator for the data folders has been provided!'));
if (!DESTINATION_PATH) {
  return console.log(chalk.red.bold('No destination path has been provided!'));
} else if (!fs.existsSync(DESTINATION_PATH.replace(/[^/]*$/, ''))) {
  return console.log(chalk.red.bold(`The destiantion path ${chalk.yellow(DESTINATION_PATH.replace(/[^/]*$/, ''))} is not a valid path!`));
}
if (!INTERVALTIME) {
  return console.log(chalk.red.bold('No interval time has been provided!'));
} else if (!ms(INTERVALTIME) || /^\d+$/.test(INTERVALTIME)) {
  return console.log(chalk.red.bold(`The interval time is not a valid number!\nYou can use ${chalk.yellow('d')} for days, ${chalk.yellow('h')} for hours, ${chalk.yellow('m')} for minutes, ${chalk.yellow('s')} for seconds and ${chalk.yellow('ms')} for milliseconds!`));
}


// Main process
console.log()
// Make a directory for the data if it does not exist
manager.mkdir(DESTINATION_PATH);

let n = 1; // This number gets used for making numbered data folders
while (fs.existsSync(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

manager.mkdir(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`); // Make a numbered data folder

// Copy the source file, if one was provided
if (SOURCE_FILE_PATH) manager.copy(SOURCE_FILE_PATH, `${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}/${SOURCE_FILE_PATH.split('/').pop()}`);
// Copy the source folder, if one was provided
if (SOURCE_FOLDER_PATH) manager.copyDir(SOURCE_FOLDER_PATH, `${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}/${SOURCE_FOLDER_PATH.split('/').pop()}`);

// Logging
const date = new Date(Date.now());
console.log(chalk.green.bold(`The ${SOURCE_FILE_PATH ? `${chalk.yellow.underline(SOURCE_FILE_PATH.split('/').pop())} file` : ''} ${SOURCE_FOLDER_PATH ? `${SOURCE_FILE_PATH ? 'and the ' : ''}${chalk.yellow.underline(SOURCE_FOLDER_PATH.split('/').pop())} folder ${SOURCE_FILE_PATH ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`)} directory! | #${n} | ${
  date.getFullYear() + "-" + 
  manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
  manager.dateTimePad(date.getDate(), 2) + " " +
  manager.dateTimePad(date.getHours(), 2) + ":" +
  manager.dateTimePad(date.getMinutes(), 2) + ":" +
  manager.dateTimePad(date.getSeconds(), 2)
}`));


setInterval(async () => { // Set an interval for copying the file and/or the folder after a specific amount of time
  // Making sure the necessary paths are are still valid
  if (SOURCE_FILE_PATH && !fs.existsSync(SOURCE_FILE_PATH)) throw console.log(chalk.red.bold(`The source file path ${chalk.yellow(SOURCE_FILE_PATH)} is not a valid path anymore!`));
  if (SOURCE_FOLDER_PATH && !fs.existsSync(SOURCE_FOLDER_PATH)) throw console.log(chalk.red.bold(`The source folder path ${chalk.yellow(SOURCE_FOLDER_PATH)} is not a valid path anymore!`));
  if (!fs.existsSync(DESTINATION_PATH.replace(/[^/]*$/, ''))) throw console.log(chalk.red.bold(`The destiantion path ${chalk.yellow(DESTINATION_PATH.replace(/[^/]*$/, ''))} is not a valid path anymore!`));


  while (fs.existsSync(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

  manager.mkdir(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`); // Make a numbered data folder
  
  // Copy the source file, if one was provided
  if (SOURCE_FILE_PATH) manager.copy(SOURCE_FILE_PATH, `${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}/${SOURCE_FILE_PATH.split('/').pop()}`);
  // Copy the source folder, if one was provided
  if (SOURCE_FOLDER_PATH) manager.copyDir(SOURCE_FOLDER_PATH, `${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}/${SOURCE_FOLDER_PATH.split('/').pop()}`);
    
  // Logging
  const date = new Date(Date.now());
  console.log(chalk.green.bold(`The ${SOURCE_FILE_PATH ? `${chalk.yellow.underline(SOURCE_FILE_PATH.split('/').pop())} file` : ''} ${SOURCE_FOLDER_PATH ? `${SOURCE_FILE_PATH ? 'and the ' : ''}${chalk.yellow.underline(SOURCE_FOLDER_PATH.split('/').pop())} folder ${SOURCE_FILE_PATH ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(`${DESTINATION_PATH}/${DATA_FOLDER_NAME}${DATA_FOLDER_SEPERATOR}${n}`)} directory! | #${n} | ${
    date.getFullYear() + "-" + 
    manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
    manager.dateTimePad(date.getDate(), 2) + " " +
    manager.dateTimePad(date.getHours(), 2) + ":" +
    manager.dateTimePad(date.getMinutes(), 2) + ":" +
    manager.dateTimePad(date.getSeconds(), 2)
  }`));
}, ms(INTERVALTIME)); // Interval time


// Handling errors 
process.on('unhandledRejection', async error => {
  if (!error) return process.exit();
  return console.error('Unhandled promise rejection:', error);
});