import * as fs from "fs";

export class FileBlockReader {
    private path: string;
    private blockSize: number;

    constructor(path: string, blockSize: number) {
        this.path = path;
        this.blockSize = blockSize;
    }

    public read(onData: (blockIndex: number, chunk: Buffer) => void = null, onComplete: () => void = null) {

        if (onData) {
            this.readByBlocks(onData, onComplete);
        } else {
            return read(this.path, this.blockSize);
        }
    }

    private readByBlocks(onData: (blockIndex: number, chunk: Buffer) => void, onComplete: () => void = null) {
        let index = 0;
        const {size} = fs.statSync(this.path);
        let readStream = fs.createReadStream(this.path);
        let b = new Buffer(0);
        readStream.on('data', (chunk: Buffer) => {
            b = Buffer.concat([b, chunk]);
            if (readStream.bytesRead === size) {
                onData(index, b);
                if (onComplete) onComplete();
                return;
            }
            if (b.length === this.blockSize) {
                onData(index, b);
                b = new Buffer(0);
                index++;
            }
        });
    }

}

function* read(path: string, blockSize: number) {
    const {size} = fs.statSync(path);
    let parts = size / blockSize;
    if (parts - Math.floor(parts) > 0) {
        parts = Math.floor(parts) + 1;
    }

    let start = 0;
    for (let i = 1; i <= parts; i++) {
        yield fs.createReadStream(path, {start, end: (blockSize * i) - 1});
        start += blockSize;
    }
}