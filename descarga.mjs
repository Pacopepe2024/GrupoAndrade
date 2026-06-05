import fs from 'fs';
import path from 'path';
import https from 'https';

const url = 'https://www.schuecopws.it/prodotti/sistemi-per-finestre-in-pvc/schuco-living/';
const dest = 'E:\\aGrupoandrade\\Imagenes\\LivingN';

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const regex = /<img[^>]+src=["']([^"']+)["']/gi;
        let match;
        const downloaded = new Set();
        let count = 0;

        while ((match = regex.exec(data)) !== null) {
            let imgUrl = match[1];
            if (imgUrl.startsWith('data:')) continue;
            if (imgUrl.startsWith('/')) {
                imgUrl = 'https://www.schuecopws.it' + imgUrl;
            }
            if (!imgUrl.startsWith('http')) continue;

            const filename = path.basename(new URL(imgUrl).pathname);
            if (!filename || downloaded.has(filename)) continue;

            downloaded.add(filename);
            const filepath = path.join(dest, filename);
            
            https.get(imgUrl, (imgRes) => {
                if (imgRes.statusCode === 200) {
                    const file = fs.createWriteStream(filepath);
                    imgRes.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log('Descargada: ' + filename);
                    });
                }
            }).on('error', () => {});
            count++;
        }
        console.log('Total de imagenes procesadas: ' + count);
    });
});
