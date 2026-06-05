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

const targets = [
    {
        url: 'https://www.schuecopws.it/prodotti/sistemi-per-scorrevoli-in-pvc/schuco-living-move/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\LivingMove'
    },
    {
        url: 'https://www.schuecopws.it/prodotti/sistemi-per-scorrevoli-in-pvc/schuco-softslide/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\SoftSlide'
    },
    {
        url: 'https://www.schuecopws.it/prodotti/sistemi-per-scorrevoli-in-pvc/schuco-softslide-panorama/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\SoftSlidePanorama'
    },
    {
        url: 'https://www.schuecopws.it/prodotti/sistemi-per-scorrevoli-in-pvc/schuco-focusingslide/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\FocusingSlide'
    },
    {
        url: 'https://www.schuecopws.it/soglie-sistemi-scorrevoli/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\SoglieSistemiScorrevoli'
    },
    {
        url: 'https://www.schuecopws.it/rivestimenti-sistemi-scorrevoli/',
        dest: 'E:\\aGrupoandrade\\Imagenes\\RivestimentiSistemiScorrevoli'
    }
];

function processUrl(target) {
    return new Promise((resolve) => {
        const { url, dest } = target;
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        console.log('\n=======================================');
        console.log('Procesando URL:', url);
        console.log('Destino:', dest);

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const regex = /<img[^>]+src=["']([^"']+)["']/gi;
                let match;
                const downloaded = new Set();
                let count = 0;
                let pending = 0;

                const checkFinish = () => {
                    if (pending === 0) {
                        console.log(`\nCompletado: ${url} - Imágenes procesadas: ${count}`);
                        resolve();
                    }
                };

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
                    
                    pending++;
                    count++;
                    https.get(imgUrl, (imgRes) => {
                        if (imgRes.statusCode === 200) {
                            const file = fs.createWriteStream(filepath);
                            imgRes.pipe(file);
                            file.on('finish', async () => {
                                file.close();
                                
                                if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
                                    const webpFilename = filename.replace(/\.(jpg|jpeg)$/i, '.webp');
                                    const webpFilepath = path.join(dest, webpFilename);
                                    try {
                                        await sharp(filepath).webp({ quality: 80 }).toFile(webpFilepath);
                                        fs.unlinkSync(filepath);
                                    } catch (err) {
                                        // Ignore errors silently for cleaner logs
                                    }
                                }
                                pending--;
                                checkFinish();
                            });
                        } else {
                            pending--;
                            checkFinish();
                        }
                    }).on('error', () => {
                        pending--;
                        checkFinish();
                    });
                }
                
                if (count === 0) {
                    console.log(`No se encontraron imágenes en ${url}`);
                    resolve();
                }
            });
        }).on('error', (err) => {
            console.error('Error obteniendo la URL:', err.message);
            resolve();
        });
    });
}

async function run() {
    for (const target of targets) {
        await processUrl(target);
    }
    console.log('\n✅ TODAS LAS DESCARGAS HAN FINALIZADO EXITOSAMENTE.');
}

run();
