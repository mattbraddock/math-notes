import { writeFileSync } from 'node:fs';
import * as fsScandir from '@nodelib/fs.scandir';

const ignore = [
    '.git',
    '.gitignore',
    'CNAME',
    'files.json',
    'index.html',
    'index.js',
    'node_modules',
    'package-lock.json',
    'package.json'
];

let directories = ['.'];
let entries = [];
let data = {};

do {
    const directory = directories.shift();
    entries = fsScandir.scandirSync(directory, { followSymbolicLinks: true, stats: true });
    if (directory === '.') entries = entries.filter(entry => ignore.includes(entry.name) === false);
    directories = [...directories, ...entries.filter(entry => entry.dirent.isDirectory()).map(entry => entry.path)];
    data = {
        ...data,
        [directory]: entries.map(entry => ({
            name: entry.name,
            path: entry.path,
            dir: entry.dirent.isDirectory(),
            size: entry.stats.size,
            date: new Date(entry.stats.mtimeMs).toUTCString()
        }))
    };
} while (directories.length > 0);

writeFileSync('files.json', JSON.stringify(data));