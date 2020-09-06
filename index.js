const fs = require('fs');
const chalk = require('chalk');
const ms = require('ms');
const manager = require('./functions.js');
const { sourcefilepath, sourcefolderpath, datafoldername, datafolderspliter, destinationpath, intervaltime } = require('./config.json');

4
// Making sure the necessary properties have been provided and they are valid
if (!sourcefilepath && !sourcefolderpath) return console.log(chalk.red.bold('Neither a source file or a source folder have been provided!'));
if (sourcefilepath && !fs.existsSync(sourcefilepath)) return console.log(chalk.red.bold('The source file path is not a valid path!'));
if (sourcefolderpath && !fs.existsSync(sourcefolderpath)) return console.log(chalk.red.bold('The source folder path is not a valid path!'));
if (!datafoldername) return console.log(chalk.red.bold('No name for the data folders has been provided!'));
if (!destinationpath) {
  return console.log(chalk.red.bold('No destinationpath has been provided!'));
} else if (!fs.existsSync(destinationpath)) {
  return console.log(chalk.red.bold('The destinationpath path is not a valid path!'));
}
if (!intervaltime) {
  return console.log(chalk.red.bold('No interval time has been provided!'));
} else if (!ms(intervaltime) || /^\d+$/.test(intervaltime)) {
  return console.log(chalk.red.bold(`The interval time is not a valid number!\nYou can use ${chalk.yellow('d')} for days, ${chalk.yellow('h')} for hours, ${chalk.yellow('m')} for minutes, ${chalk.yellow('s')} for seconds and ${chalk.yellow('ms')} for milliseconds!`));
}


// Main process

// Make a directory for the data if it does not exist
manager.mkdir(destinationpath);

let n = 1; // This number gets used for making numbered data folders
while (fs.existsSync(`${destinationpath}/${datafoldername}${datafolderspliter}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

manager.mkdir(`${destinationpath}/${datafoldername}${datafolderspliter}${n}`); // Make a numbered data folder

// Copy the source file, if one was provided
if (sourcefilepath) manager.copy(sourcefilepath, `${destinationpath}/${datafoldername}${datafolderspliter}${n}/${sourcefilepath.split('/').pop()}`);
// Copy the source folder, if one was provided
if (sourcefolderpath) manager.copyDir(sourcefolderpath, `${destinationpath}/${datafoldername}${datafolderspliter}${n}/${sourcefolderpath.split('/').pop()}`);

// Logging
const date = new Date(Date.now());
console.log(chalk.green.bold(`The ${sourcefilepath ? `${chalk.yellow.underline(sourcefilepath.split('/').pop())} file` : ''} ${sourcefolderpath ? `${sourcefilepath ? 'and the ' : ''}${chalk.yellow.underline(sourcefolderpath.split('/').pop())} folder ${sourcefilepath ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(destinationpath.split('/').pop())} directory! | #${n} | ${
  date.getFullYear() + "-" + 
  manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
  manager.dateTimePad(date.getDate(), 2) + " " +
  manager.dateTimePad(date.getHours(), 2) + ":" +
  manager.dateTimePad(date.getMinutes(), 2) + ":" +
  manager.dateTimePad(date.getSeconds(), 2)
}`));


setInterval(async () => { // Set an interval for copying the file and/or the folder after a specific amount of time
  while (fs.existsSync(`${destinationpath}/${datafoldername}${datafolderspliter}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

  manager.mkdir(`${destinationpath}/${datafoldername}${datafolderspliter}${n}`); // Make a numbered data folder
  
  // Copy the source file, if one was provided
  if (sourcefilepath) manager.copy(sourcefilepath, `${destinationpath}/${datafoldername}${datafolderspliter}${n}/${sourcefilepath.split('/').pop()}`);
  // Copy the source folder, if one was provided
  if (sourcefolderpath) manager.copyDir(sourcefolderpath, `${destinationpath}/${datafoldername}${datafolderspliter}${n}/${sourcefolderpath.split('/').pop()}`);
    
  // Logging
  const date = new Date(Date.now());
  console.log(chalk.green.bold(`The ${sourcefilepath ? `${chalk.yellow.underline(sourcefilepath.split('/').pop())} file` : ''} ${sourcefolderpath ? `${sourcefilepath ? 'and the ' : ''}${chalk.yellow.underline(sourcefolderpath.split('/').pop())} folder ${sourcefilepath ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(destinationpath.split('/').pop())} directory! | #${n} | ${
    date.getFullYear() + "-" + 
    manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
    manager.dateTimePad(date.getDate(), 2) + " " +
    manager.dateTimePad(date.getHours(), 2) + ":" +
    manager.dateTimePad(date.getMinutes(), 2) + ":" +
    manager.dateTimePad(date.getSeconds(), 2)
  }`));
}, ms(intervaltime)); // Interval time