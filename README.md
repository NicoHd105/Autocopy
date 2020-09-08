# Autocopy
Autocopy is a program that can automatically copy a custom file and/or a custom folder, and it's subfolders and subfiles, in an custom interval into a specific directory, into numbered folders with a custom name.

## Supported Operating System
- Windows 10

## Setup
- Download the ZIP of this project and extract it.
- Fill out the the config.json file.
 
You do not necessarily have to provide a file and a folder, it is ok of you provide just one of them!

## Example config.json
```
{
    "sourcefilepath": "C:/Folder1/test.txt",  
    "sourcefolderpath": "C:/Folder2/test",
    "datafoldername": "Data",
    "datafolderspliter": "_",
    "destinationpath": "C:/DataFolder",
    "intervaltime": "1h"
}
```

## Start
```node .```

