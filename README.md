# Game Phaser3

## Alur Game
1. Buka `index.html` di browser.
2. Latar belakang dan platform muncul, karakter berdiri di awal level.
3. Gunakan tombol arah untuk bergerak dan lompat.
4. Kumpulkan semua bintang yang muncul di level.
5. Setiap bintang memberi skor +10.
6. Setelah semua bintang terkumpul, bintang akan muncul kembali sehingga permainan bisa dilanjutkan.
7. Musik latar akan berusaha dimulai otomatis; jika browser memblokir autoplay, klik sekali di area game untuk memulainya.

## Kontrol
- `Arrow Left` = bergerak ke kiri
- `Arrow Right` = bergerak ke kanan
- `Arrow Up` = lompat

## Fitur Utama
- Karakter dengan animasi `idle`, `run`, dan `jump`
- Platform dengan fisika arcade Phaser
- Bintang yang bisa dikumpulkan dan respawn setelah semua habis
- Musik latar dan efek suara koleksi bintang

## File Aset Penting
- `assets/player_spritesheet_128.png` - sprite karakter 128x128 per frame
- `assets/bgm.wav` - musik latar
- `assets/sky.svg` - background
- `assets/platform.svg` - platform level
- `assets/star.svg` - objek bintang

## Cara Menjalankan
1. Buka `index.html` di browser.
2. Jika game tidak bisa dimuat karena pembatasan keamanan file lokal, jalankan server lokal sederhana seperti:
   ```bash
   python -m http.server 8000
   ```
3. Akses `http://localhost:8000` di browser.

## Catatan
- Jika musik tidak otomatis menyala, klik sekali di area permainan untuk memberi izin audio.
- `game.js` menggunakan Phaser 3 untuk logika permainan dan animasi.
