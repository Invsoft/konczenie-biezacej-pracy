//const fs = require('fs');
const fse = require('fs-extra');

const srcDir = `c:/_work/work_react/react_proedims_raportowanie_zakonczonych_prac/raportowanie-zakonczonych-prac/build`;
const destDir = `c:/_work/workspace_proedims/proedims/eoffice/react/raportowanie_zakonczonych_prac`; 

if (!fse.existsSync(destDir)){
    fse.mkdirSync(destDir);
	console.log('mkdirSync ' + destDir)
}
 
fse.emptydirSync(destDir)
 
fse.copySync(srcDir, destDir);
