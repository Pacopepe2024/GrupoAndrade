import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

const url = 'https://www.schuecopws.it/prodotti/sistemi-per-finestre-in-pvc/schuco-living-alu-inside/';
const dest = 'E:\\aGrupoandrade\\Imagenes\\LivingAluInside';

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
        let totalProcessed = 0;
        let totalConverted = 0;

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
                        
                        if (filepath.match(/\.(jpg|jpeg|png)$/i)) {
                            const webpPath = path.join(dest, path.parse(filename).name + '.webp');
                            try {
                                await sharp(filepath).webp({ quality: 80 }).toFile(webpPath);
                                fs.unlinkSync(filepath);
                                console.log('Descargada y convertida a WEBP: ' + path.parse(filename).name + '.webp');
                            } catch (e) {
                                console.error('Error al convertir ' + filename, e.message);
                            }
                        } else {
                            console.log('Descargada (ya era WEBP o no convertible): ' + filename);
                        }
                    });
                }
            }).on('error', () => {});
            totalProcessed++;
        }
        console.log('Comenzando la descarga de ' + totalProcessed + ' imágenes...');
    });
});
