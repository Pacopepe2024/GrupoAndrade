import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch (e) {
  console.log('Instalando sharp...');
  execSync('npm install sharp --no-save', { stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const url = 'https://www.schuecopws.it/prodotti/sistemi-per-finestre-in-pvc/symbiotic/';
const dest = 'E:\\aGrupoandrade\\Imagenes\\Symbiotic';

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
                    file.on('finish', async () => {
                        file.close();
                        console.log('Descargada: ' + filename);
                        
                        if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
                            const webpFilename = filename.replace(/\.(jpg|jpeg)$/i, '.webp');
                            const webpFilepath = path.join(dest, webpFilename);
                            try {
                                await sharp(filepath).webp({ quality: 80 }).toFile(webpFilepath);
                                console.log('Convertida a WEBP: ' + webpFilename);
                                fs.unlinkSync(filepath);
                            } catch (err) {
                                console.error('Error convirtiendo ' + filename, err.message);
                            }
                        }
                    });
                }
            }).on('error', () => {});
            count++;
        }
        console.log('Total de imagenes detectadas para descarga: ' + count);
    });
}).on('error', (err) => {
    console.error('Error obteniendo la URL:', err.message);
});
