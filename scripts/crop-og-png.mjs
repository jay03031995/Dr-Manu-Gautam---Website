import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const [input, output, cropWidthArg, cropHeightArg] = process.argv.slice(2);

if (!input || !output || !cropWidthArg || !cropHeightArg) {
  throw new Error("Usage: node scripts/crop-og-png.mjs <input.png> <output.png> <width> <height>");
}

const cropWidth = Number(cropWidthArg);
const cropHeight = Number(cropHeightArg);
const source = readFileSync(input);
const signature = source.subarray(0, 8);
const expectedSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

if (!signature.equals(expectedSignature)) {
  throw new Error("Input is not a PNG file");
}

let offset = 8;
let width = 0;
let height = 0;
let colorType = 0;
let bitDepth = 0;
const idatChunks = [];

function readUInt32(position) {
  return source.readUInt32BE(position);
}

while (offset < source.length) {
  const length = readUInt32(offset);
  const type = source.subarray(offset + 4, offset + 8).toString("ascii");
  const data = source.subarray(offset + 8, offset + 8 + length);

  if (type === "IHDR") {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
  } else if (type === "IDAT") {
    idatChunks.push(data);
  } else if (type === "IEND") {
    break;
  }

  offset += 12 + length;
}

if (bitDepth !== 8 || colorType !== 6) {
  throw new Error(`Only 8-bit RGBA PNGs are supported. Found bitDepth=${bitDepth}, colorType=${colorType}`);
}

if (cropWidth > width || cropHeight > height) {
  throw new Error(`Crop ${cropWidth}x${cropHeight} exceeds source ${width}x${height}`);
}

const bytesPerPixel = 4;
const scanlineBytes = width * bytesPerPixel;
const inflated = inflateSync(Buffer.concat(idatChunks));
const rows = [];

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < height; y += 1) {
  const rowStart = y * (scanlineBytes + 1);
  const filter = inflated[rowStart];
  const row = Buffer.from(inflated.subarray(rowStart + 1, rowStart + 1 + scanlineBytes));
  const previous = rows[y - 1];

  for (let x = 0; x < row.length; x += 1) {
    const left = x >= bytesPerPixel ? row[x - bytesPerPixel] : 0;
    const up = previous ? previous[x] : 0;
    const upLeft = previous && x >= bytesPerPixel ? previous[x - bytesPerPixel] : 0;

    if (filter === 1) row[x] = (row[x] + left) & 255;
    else if (filter === 2) row[x] = (row[x] + up) & 255;
    else if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
    else if (filter === 4) row[x] = (row[x] + paeth(left, up, upLeft)) & 255;
    else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}`);
  }

  rows.push(row);
}

const croppedRows = [];
for (let y = 0; y < cropHeight; y += 1) {
  croppedRows.push(Buffer.from([0]), rows[y].subarray(0, cropWidth * bytesPerPixel));
}

const raw = Buffer.concat(croppedRows);
const compressed = deflateSync(raw, { level: 9 });

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(cropWidth, 0);
ihdr.writeUInt32BE(cropHeight, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

writeFileSync(output, Buffer.concat([expectedSignature, chunk("IHDR", ihdr), chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0))]));
