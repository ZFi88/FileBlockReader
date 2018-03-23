# FileBlockReader

Read files by blocks

## Installation
`npm i file-block-reader`

## Usage
```typescript
const {FileBlockReader} = require('file-block-reader');

//...

//Read file by 5Mb blocks using callback
const reader = new FileBlockReader(filePath, 5 * 1024 * 1024);
reader.read((blockIndex: number, chunk: Buffer) => {

}, () => console.log('Complete!!!'));
//Or read file by 5Mb blocks using generator
const generator = reader.read();
while (true) {
    const {value, done} = generator.next(); //get next block buffer
    if (done) break;
}
```