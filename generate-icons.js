/**
 * generate-icons.js
 * Script untuk generate semua ukuran icon PWA dari satu file SVG/PNG
 *
 * Install: npm install sharp --save-dev
 * Jalankan: node generate-icons.js
 *
 * Letakkan file logo asli di: public/icons/logo-source.png (512x512 min)
 */

import sharp from 'sharp'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const SOURCE = join(__dirname, 'public/icons/logo-source.png')
const OUTPUT = join(__dirname, 'public/icons')

// Buat folder jika belum ada
if (!existsSync(OUTPUT)) mkdirSync(OUTPUT, { recursive: true })

if (!existsSync(SOURCE)) {
  console.log('⚠️  File logo-source.png tidak ditemukan di public/icons/')
  console.log('   Letakkan file logo PNG berukuran minimal 512x512 dengan nama logo-source.png')
  process.exit(1)
}

console.log('🎨 Generating PWA icons...')

for (const size of SIZES) {
  const output = join(OUTPUT, `icon-${size}x${size}.png`)
  await sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background: { r:0, g:45, b:114, alpha:1 } })
    .png()
    .toFile(output)
  console.log(`  ✅ icon-${size}x${size}.png`)
}

console.log('\n✨ Semua icon berhasil dibuat di public/icons/')
console.log('   Pastikan folder public/icons sudah ada sebelum build.')