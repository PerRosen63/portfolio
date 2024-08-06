const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

fs.readdir(distDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === '.js') {
            const oldPath = path.join(distDir, file);
            const newPath = path.join(distDir, path.basename(file, '.js') + '.cjs');

            fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log(`Renamed ${oldPath} to ${newPath}`);
                }
            });
        }
    });
});
