const fs = require('fs');
const chalk = require('chalk');
const ms = require('ms');
const manager = require('./functions.js');
const { sourcefile, sourcefolder, datafoldername, datafolderspliter, destination, intervaltime } = require('./config.json');


// Making sure the necessary properties have been provided
if (!sourcefile && !sourcefolder) return console.log(chalk.bold.red('Neither a source file or a source folder have been provided!'));
if (sourcefile && (!/^[a-zA-Z]/.test(sourcefile) || !sourcefile.includes(':'))) return console.log(chalk.bold.red('The source file path is not a valid path!'));
if (sourcefolder && (!/^[a-zA-Z]/.test(sourcefolder) || !sourcefolder.includes(':'))) return console.log(chalk.bold.red('The source folder path is not a valid path!'));
if (!datafoldername) return console.log(chalk.bold.red('No name for the data folders has been provided!'));
if (!destination) {
  return console.log(chalk.bold.red('No destination has been provided!'));
} else if (!/^[a-zA-Z]/.test(destination) || !destination.includes(':')) {
  return console.log(chalk.bold.red('The destination path is not a valid path!'));
}
if (!intervaltime) {
  return console.log(chalk.bold.red('No interval time has been provided!'));
} else if (!ms(intervaltime) || /^\d+$/.test(intervaltime)) {
  return console.log(chalk.bold.red(`The interval time is not a valid number!\nYou can use ${chalk.yellow('d')} for days, ${chalk.yellow('h')} for hours, ${chalk.yellow('m')} for minutes, ${chalk.yellow('s')} for seconds and ${chalk.yellow('ms')} for milliseconds!`));
}


// Main process

// Make a directory for the data if it does not exist
manager.mkdir(destination);

let n = 1; // This number gets used for making numbered data folders
while (fs.existsSync(`${destination}/${datafoldername}${datafolderspliter}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

manager.mkdir(`${destination}/${datafoldername}${datafolderspliter}${n}`); // Make a numbered data folder

// Copy the source file, if one was provided
if (sourcefile) manager.copy(sourcefile, `${destination}/${datafoldername}${datafolderspliter}${n}/${sourcefile.split('/').pop()}`);
// Copy the source folder, if one was provided
if (sourcefolder) manager.copyDir(sourcefolder, `${destination}/${datafoldername}${datafolderspliter}${n}/${sourcefolder.split('/').pop()}`);

// Logging
const date = new Date(Date.now());
console.log(chalk.bold.green(`The ${sourcefile ? `${chalk.yellow.underline(sourcefile.split('/').pop())} file` : ''} ${sourcefolder ? `${sourcefile ? 'and the ' : ''}${chalk.yellow.underline(sourcefolder.split('/').pop())} folder ${sourcefile ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(destination.split('/').pop())} directory! | #${n} | ${
  date.getFullYear() + "-" + 
  manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
  manager.dateTimePad(date.getDate(), 2) + " " +
  manager.dateTimePad(date.getHours(), 2) + ":" +
  manager.dateTimePad(date.getMinutes(), 2) + ":" +
  manager.dateTimePad(date.getSeconds(), 2)
}`));


setInterval(async () => { // Set an interval for copying the file and/or the folder after a specific amount of time
  while (fs.existsSync(`${destination}/${datafoldername}${datafolderspliter}${n}`)) n++ // As long as a Data folder with with the number exists, increase the number by 1

  manager.mkdir(`${destination}/${datafoldername}${datafolderspliter}${n}`); // Make a numbered data folder
  
  // Copy the source file, if one was provided
  if (sourcefile) manager.copy(sourcefile, `${destination}/${datafoldername}${datafolderspliter}${n}/${sourcefile.split('/').pop()}`);
  // Copy the source folder, if one was provided
  if (sourcefolder) manager.copyDir(sourcefolder, `${destination}/${datafoldername}${datafolderspliter}${n}/${sourcefolder.split('/').pop()}`);
    
  // Logging
  const date = new Date(Date.now());
  console.log(chalk.bold.green(`The ${sourcefile ? `${chalk.yellow.underline(sourcefile.split('/').pop())} file` : ''} ${sourcefolder ? `${sourcefile ? 'and the ' : ''}${chalk.yellow.underline(sourcefolder.split('/').pop())} folder ${sourcefile ? 'were' : 'was'}` : 'was'} successfully copied to the ${chalk.yellow.underline(destination.split('/').pop())} directory! | #${n} | ${
    date.getFullYear() + "-" + 
    manager.dateTimePad((date.getMonth() + 1), 2) + "-" + 
    manager.dateTimePad(date.getDate(), 2) + " " +
    manager.dateTimePad(date.getHours(), 2) + ":" +
    manager.dateTimePad(date.getMinutes(), 2) + ":" +
    manager.dateTimePad(date.getSeconds(), 2)
  }`));
}, ms(intervaltime)); // Interval time