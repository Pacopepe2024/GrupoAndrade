import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'E:\\aGrupoandrade\\Imagenes\\LivingN';

async function convert() {
    const files = fs.readdirSync(dir);
    let count = 0;
    
    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
        
        const filePath = path.join(dir, file);
        const webpPath = path.join(dir, path.parse(file).name + '.webp');
        
        try {
            await sharp(filePath).webp({ quality: 80 }).toFile(webpPath);
            fs.unlinkSync(filePath);
            count++;
            console.log('Convertida: ' + file);
        } catch (e) {
            console.error('Error con: ' + file, e.message);
        }
    }
    console.log('Total convertidas a WEBP: ' + count);
}
convert();
