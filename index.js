const fs = require('fs');
const path = require('path')


// Functions
var mkdir = function(dir) {
	// making directory without exception if exists
	try {
		fs.mkdirSync(dir, 0755);
	} catch (error) {
		if (error.code != "EEXIST") {
			throw error;
		}
	}
};

var copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};

var copyDir = function(src, dest) {
  mkdir(dest);
  var files = fs.readdirSync(src);
  for(var i = 0; i < files.length; i++) {
    var current = fs.lstatSync(path.join(src, files[i]));
    if(current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if(current.isSymbolicLink()) {
      var symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};

function dateTimePad(value, digits){
  let number = value
  while (number.toString().length < digits) {
    number = "0" + number
  }
  return number;
}


// Create the folder if it does not exist
if (!fs.existsSync(`C:/AUTO BOT DATA`)) {
  fs.mkdir('C:/AUTO BOT DATA', (error) => {
    if (error) throw error;
  });
}


let n = 1;
// Do it once before the interval
while (fs.existsSync(`C:/AUTO BOT DATA/Data_${n}`)) {
  n++
}

fs.mkdir(`C:/AUTO BOT DATA/Data_${n}`, (error) => {
  if (error) throw error;
});

// destination will be created or overwritten by default.
fs.copyFile('C:/PASSIONE/json.sqlite', `C:/AUTO BOT DATA/Data_${n}/json.sqlite`, (error) => {
  if (error) throw error;

  copyDir('C:/PASSIONE/data', `C:/AUTO BOT DATA/Data_${n}/data`)

  const date = new Date(Date.now())

  console.log(`Data was successfully copied to the "AUTO BOT DATA" folder! | #${n} | ${date.getFullYear() + "-" + 
    dateTimePad((date.getMonth() + 1), 2) + "-" + 
    dateTimePad(date.getDate(), 2) + " " +
    dateTimePad(date.getHours(), 2) + ":" +
    dateTimePad(date.getMinutes(), 2) + ":" +
    dateTimePad(date.getSeconds(), 2)}`)
})


setInterval(async () => {
  while (fs.existsSync(`C:/AUTO BOT DATA/Data_${n}`)) {
    n++
  }

  fs.mkdir(`C:/AUTO BOT DATA/Data_${n}`, (error) => {
    if (error) throw error;
  });

  // destination will be created or overwritten by default.
  fs.copyFile('C:/PASSIONE/json.sqlite', `C:/AUTO BOT DATA/Data_${n}/json.sqlite`, (error) => {
    if (error) throw error;

    copyDir('C:/PASSIONE/data', `C:/AUTO BOT DATA/Data_${n}/data`)

    const date = new Date(Date.now())

    console.log(`Data was successfully copied to the "AUTO BOT DATA" folder! | #${n} | ${dateTimePad(date.getDate(), 2) + "." +
      dateTimePad((date.getMonth() + 1), 2) + "." + 
      date.getFullYear() + " " + 
      dateTimePad(date.getHours(), 2) + ":" +
      dateTimePad(date.getMinutes(), 2) + ":" +
      dateTimePad(date.getSeconds(), 2)}`)
  })
}, 1000*60*60 * 1)