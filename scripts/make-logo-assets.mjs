import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const logoPath = "public/images/logo.png";

const source = readFileSync(logoPath);
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

if (!source.subarray(0, 8).equals(signature)) {
  throw new Error(`${logoPath} must be a PNG`);
}

function readPng(buffer) {
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);

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

  const bytesPerPixel = 4;
  const scanlineBytes = width * bytesPerPixel;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const rows = [];

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

  return { width, height, pixels: Buffer.concat(rows) };
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

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

function writePng(path, width, height, pixels) {
  const rows = [];
  const scanlineBytes = width * 4;
  for (let y = 0; y < height; y += 1) {
    rows.push(Buffer.from([0]), pixels.subarray(y * scanlineBytes, (y + 1) * scanlineBytes));
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  writeFileSync(path, Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })), chunk("IEND", Buffer.alloc(0))]));
}

function createCanvas(width, height, color) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
    pixels[i + 3] = color[3];
  }
  return pixels;
}

function getPixel(image, x, y) {
  const index = (y * image.width + x) * 4;
  return [
    image.pixels[index],
    image.pixels[index + 1],
    image.pixels[index + 2],
    image.pixels[index + 3],
  ];
}

function blendOver(dst, dstIndex, src) {
  const alpha = src[3] / 255;
  const inverse = 1 - alpha;
  dst[dstIndex] = Math.round(src[0] * alpha + dst[dstIndex] * inverse);
  dst[dstIndex + 1] = Math.round(src[1] * alpha + dst[dstIndex + 1] * inverse);
  dst[dstIndex + 2] = Math.round(src[2] * alpha + dst[dstIndex + 2] * inverse);
  dst[dstIndex + 3] = 255;
}

function drawImage(canvas, canvasWidth, canvasHeight, image, x, y, width, height) {
  for (let dy = 0; dy < height; dy += 1) {
    const targetY = y + dy;
    if (targetY < 0 || targetY >= canvasHeight) continue;
    const srcY = Math.min(image.height - 1, Math.floor((dy / height) * image.height));
    for (let dx = 0; dx < width; dx += 1) {
      const targetX = x + dx;
      if (targetX < 0 || targetX >= canvasWidth) continue;
      const srcX = Math.min(image.width - 1, Math.floor((dx / width) * image.width));
      blendOver(canvas, (targetY * canvasWidth + targetX) * 4, getPixel(image, srcX, srcY));
    }
  }
}

function cropImage(image, x, y, width, height) {
  const pixels = Buffer.alloc(width * height * 4);
  for (let py = 0; py < height; py += 1) {
    for (let px = 0; px < width; px += 1) {
      const sourceX = Math.min(image.width - 1, x + px);
      const sourceY = Math.min(image.height - 1, y + py);
      const sourceIndex = (sourceY * image.width + sourceX) * 4;
      const targetIndex = (py * width + px) * 4;
      image.pixels.copy(pixels, targetIndex, sourceIndex, sourceIndex + 4);
    }
  }
  return { width, height, pixels };
}

function drawRoundedRect(canvas, canvasWidth, canvasHeight, x, y, width, height, radius, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      if (px < 0 || py < 0 || px >= canvasWidth || py >= canvasHeight) continue;
      const dx = px < x + radius ? x + radius - px : px >= x + width - radius ? px - (x + width - radius - 1) : 0;
      const dy = py < y + radius ? y + radius - py : py >= y + height - radius ? py - (y + height - radius - 1) : 0;
      if (dx * dx + dy * dy > radius * radius) continue;
      const index = (py * canvasWidth + px) * 4;
      canvas[index] = color[0];
      canvas[index + 1] = color[1];
      canvas[index + 2] = color[2];
      canvas[index + 3] = color[3];
    }
  }
}

const logo = readPng(source);
const logoMark = cropImage(logo, 0, 0, 270, logo.height);

function makeIcon(size, output, image = logoMark) {
  const canvas = createCanvas(size, size, [255, 255, 255, 255]);
  const targetWidth = Math.round(size * 0.84);
  const targetHeight = Math.round(targetWidth * (image.height / image.width));
  drawImage(canvas, size, size, image, Math.round((size - targetWidth) / 2), Math.round((size - targetHeight) / 2), targetWidth, targetHeight);
  writePng(output, size, size, canvas);
  return canvas;
}

function writeIco(path, size, pixels) {
  const pngPath = `/private/tmp/logo-favicon-${size}.png`;
  writePng(pngPath, size, size, pixels);
  const png = readFileSync(pngPath);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = size;
  header[7] = size;
  header[8] = 0;
  header[9] = 0;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  writeFileSync(path, Buffer.concat([header, png]));
}

function makeOg() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height, [245, 251, 251, 255]);
  drawRoundedRect(canvas, width, height, 58, 58, 1084, 514, 34, [255, 255, 255, 255]);
  const targetWidth = 900;
  const targetHeight = Math.round(targetWidth * (logo.height / logo.width));
  drawImage(canvas, width, height, logo, Math.round((width - targetWidth) / 2), Math.round((height - targetHeight) / 2), targetWidth, targetHeight);
  writePng("public/images/og-image.png", width, height, canvas);
}

makeIcon(512, "public/icons/icon-512.png");
makeIcon(192, "public/icons/icon-192.png");
makeIcon(180, "public/icons/apple-touch-icon.png");
writeIco("src/app/favicon.ico", 64, makeIcon(64, "public/icons/icon-64.png"));
makeOg();
