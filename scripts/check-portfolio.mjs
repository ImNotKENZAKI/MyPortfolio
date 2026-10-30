import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const files=['js/script.js','scripts/serve.mjs','api/contact.js',...readdirSync(new URL('direction-preview/',root)).filter(name=>name.endsWith('.js')).map(name=>'direction-preview/'+name)];
for(const file of files){
 const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL(file,root))],{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status||1);
}
console.log(`Syntax checked ${files.length} active and legacy modules.`);
