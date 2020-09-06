# Autocopy

Autocopy is a program to automatically copy a custom file and/or a custom folder, and it's subfolders and subfiles, in an custom interval into a specific directory, into numbered folders with a custom name.

## Setup

- Download the ZIP of this project and extract it.
- Fill out the the config.json file.
 
You do not necessarily have to provide a file and a folder, it is ok of you provide just one of them!

## Example config.json
```
{
    "sourcefile": "C:/Folder1/test.txt",  
    "sourcefolder": "C:/Folder2/test",
    "datafoldername": "Data",
    "datafolderspliter": "_",
    "destination": "C:/DataFolder",
    "intervaltime": "1h"
}
```

## Start
```node .```

