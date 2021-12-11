#!/usr/bin/env node
  
let fs = require("fs");
let path = require("path");
let utlity = require("./utility");


let types = utlity.types;

//Taking input from the console
let inputArray = process.argv.slice(2);

//Accessing the array
let command = inputArray[0];

//Switch case for various commands
switch (command) {
    case "organize":
        organizeFunction(inputArray[1]);
        break;
    case "help":
        helpFunction();
        break;
    default:
        console.log(
            `     Please enter the write command 🙏🙏: 
                  1. node main.js organize "dirpath" ✔️
                  2. node main.js help "dirpath" ✔️
        
        `);
}

//Organize function
function organizeFunction(dirpath) {

    //1. input directory path given
    //2. create a orgnaized files directory
    //3. identify categories of all files present in the input directory 
    //4. copy/cut files to the organized directory inside of any one category 
    let des_path;
    if (dirpath == undefined) {
        //this will give us the current working directory
        dirpath = process.cwd();
        des_path = path.join(dirpath, "organized_files");
            //checking whether already the organize_files directory exists or not.
            if (fs.existsSync(des_path) == false) {
                fs.mkdirSync(des_path);
            }
            
        // organize_helper(des_path);
        // return;
    } else {
        let doesExist = fs.existsSync(dirpath);
        //checking whether the current directory path exists or not
        if (doesExist) {
            //Creating a path for the organized_files directory
            des_path = path.join(dirpath, "organized_files");
            //checking whether already the organize_files directory exists or not.
            if (fs.existsSync(des_path) == false) {
                fs.mkdirSync(des_path);
            }
        }
    }
    //for other work like checking the categories of files and putting in the required folder
    organize_helper(dirpath, des_path);

}



//organize_helper function
function organize_helper(src, dest) {

    //it will give the names of all the files in the src directory
    let child_names = fs.readdirSync(src);

    for (let i = 0; i < child_names.length; i++) {

        let child_address = path.join(src, child_names[i]);

        //if it directory then we cannot organize it beacuse it is already organized otherwise we will organize it 
        let isFile = fs.lstatSync(child_address).isFile();
        if (isFile) {
            let category = getCategory(child_names[i]);
            sendFiles(child_address, dest, category);
        }
    }
}

function getCategory(fname) {
    //gives the extenstion for the file path
    let ext = path.extname(fname);
    //We need to slice it because it will give the '.' also
    ext = ext.slice(1);

    //now we will iterate on types object
    //to find the pefect category
    for (let type in types) {
        let carray = types[type];
        for (let i = 0; i < carray.length; i++) {
            if (ext == carray[i]) {
                return type;
            }
        }

    }
    return "others";
}


//sendFiles function 
function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    //if the category folder does not exist then create one
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    //then remove the original file
    fs.unlinkSync(srcFilePath);
    // console.log(fileName + "copied to" + category);
}


// List of different commands to help the user
function helpFunction() {
    console.log(
        `     Please enter the commands 🙏🙏: 
                  1. node main.js organize "dirpath" ✔️
                  2. node main.js help "dirpath" ✔️
        
        `);
}