//const fs = require('fs');
const fse = require('fs-extra');

const srcDir = `c:/_work/work_react/react_proedims_raportowanie_zakonczonych_prac/raportowanie-zakonczonych-prac/build`;
const destDir = `c:/_work/workspace_proedims/proedims/eoffice/react/raportowanie_zakonczonych_prac`; 

if (!fse.existsSync(destDir)){
    fse.mkdirSync(destDir);
	console.log('mkdirSync ' + destDir)
}
 
fse.emptydirSync(destDir, err => {
  if (err) return console.error(err)
  console.log('emptyDir ' + destDir)
})
 
// To copy a folder or file  
fse.copySync(srcDir, destDir);
/*
, function (err) { //|___{ overwrite: true } // add if you want to replace existing folder or file with same name
  if (err) {                 
    console.error(err);      
  } else {
    console.log("success!");
  }
});
*/