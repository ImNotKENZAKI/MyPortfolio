import http from 'node:http';
import { open, stat, readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.gif':'image/gif','.pdf':'application/pdf','.xml':'application/xml','.txt':'text/plain','.mp4':'video/mp4'};
const server = http.createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405);res.end();return;}
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    if (relative.replaceAll('\\', '/').split('/').some(segment => segment.startsWith('.'))) throw new Error('Not found');
    const filename = resolve(root, relative);
    const allowed = /^(?:index\.html|404\.html|resume\.pdf|robots\.txt|sitemap\.xml|(?:css|js|images|media)\/[^.].*)$/.test(relative);
    if (!allowed || !filename.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('Not found');
    const info = await stat(filename);
    if (!info.isFile()) throw new Error('Not found');
    const headers = {'Content-Type':types[extname(filename)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    let start = 0, end = info.size - 1;
    if (range) {start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;}
    if (start > end || start >= info.size) {res.writeHead(416,{'Content-Range':'bytes */'+info.size});res.end();return;}
    if (range) headers['Content-Range']='bytes '+start+'-'+end+'/'+info.size;
    headers['Content-Length'] = end-start+1;
    res.writeHead(range ? 206 : 200, headers);
    if(req.method==='HEAD'){res.end();return;}
    const file = await open(filename);
    file.createReadStream({start,end,autoClose:true}).pipe(res);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    res.end(req.method==='HEAD' ? '' : await readFile(resolve(root,'404.html')));
  }
});
server.listen(port,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+port));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>server.close(()=>process.exit(0)));
