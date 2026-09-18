# 🌸 Petualangan Cinta Pixel Art (Web Bucin RPG) 🐱💖🌹

Project web bucin 1 halaman (Single Page Application) bertema **Full Pixel Art / Retro 8-Bit RPG**. Dirancang khusus agar sangat manis, imut, interaktif, dan langsung bisa dijalankan di browser (Laptop & HP).

---

## ✨ Fitur & Keunggulan

1. **Retro 8-Bit RPG Experience**:
   - Karakter kucing pemandu petualangan (**Mimi The Love Cat**).
   - Teks berjalan per karakter (*Typewriter Effect*) dengan efek suara blip 8-bit.
   - Dialog Box retro ala game klasik dengan ekspresi wajah Mimi yang dinamis (bicara, normal, menangis tersedu-sedu, gembira).
2. **Visual Penuh Cinta**:
   - Nuansa warna pink pastel retro.
   - Efek partikel melayang (Pixel Hearts ❤️, Bunga Mawar 🌹, Jejak Kaki Kucing 🐾, dan Bintang ✨).
   - Efek ledakan partikel saat jawaban cinta berhasil!
3. **Alur Interaktif & Lucu**:
   - **Step 1**: Menanyakan nama pacar ("Siapa nama kamu?").
   - **Step 2**: Menanyakan nama kamu ("Siapa pacar kamu?").
   - **Step 3 (The Ultimate Trial)**: *"Apakah kamu sangat mencintai dirinya?"*
     - Tombol **"Iya"** vs **"Tidak"**.
     - Jika mencoba klik/arahkan ke "Tidak": Tombol "Iya" membesar secara dramatis, tombol "Tidak" mengecil dan kabur secara acak, diiringi tangisan kucing pixel Mimi!
     - Jika klik "Iya": Kucing menari bahagia, efek jingle kemenangan berbunyi.
   - **Step 4**: Love Stats Slider interaktif (*"Seberapa besar cinta kamu ke dia?"*) hingga level Tak Terhingga ($\infty$%).
   - **Step 5**: Quest Terakhir: Tombol **"Kirim Pap yang disukai [Nama Pacar]"** yang langsung membuka obrolan WhatsApp dengan pesan template manis terisi otomatis!
4. **100% Full Frontend (Zero Dependencies)**:
   - Suara 8-bit disintesis secara real-time via Web Audio API (tidak memerlukan file MP3 eksternal yang rawan error).
   - Desain responsif, sangat pas di layar smartphone.
   - Tombol pengaturan (ikon gear ⚙️) untuk mengganti nomor WhatsApp & nama pacar langsung dari browser tanpa perlu edit kode!

---

## 🚀 Cara Menjalankan

### Cara 1: Langsung Buka File (Paling Cepat)
Cukup buka file `index.html` dengan cara klik ganda (*double click*) di laptop/komputer Anda menggunakan browser apapun (Chrome, Safari, Edge, Firefox).

### Cara 2: Jalankan Local Server
Jika ingin mengetes dengan server lokal di terminal:
```bash
# Menggunakan Python
python3 -m http.server 8080

# Lalu buka di browser:
# http://localhost:8080
```

---

## ⚙️ Mengubah Nomor WhatsApp & Nama Kamu

Ada 2 cara mudah:

1. **Lewat Tampilan Web (Tanpa Edit File)**:
   - Klik ikon **⚙️ (Gear)** di pojok kanan atas layar web.
   - Masukkan nomor WhatsApp kamu (contoh: `6281234567890`).
   - Masukkan nama panggilanmu.
   - Klik **Simpan Pengaturan 💾**. Data otomatis tersimpan di memori browser (*localStorage*).

2. **Lewat File `script.js` (Permanen)**:
   - Buka file `script.js`.
   - Di baris paling atas, ubah bagian `DEFAULT_CONFIG`:
     ```javascript
     const DEFAULT_CONFIG = {
       myWhatsAppNumber: "628xxxxxxxxxx", // Ganti dengan nomor WhatsApp kamu
       defaultHisName: "Nama Kamu",       // Default nama pacar/kamu
       soundEnabled: true
     };
     ```

---

## 🌐 Cara Kirim / Publikasi ke Pacar Kamu Secara Gratis

Agar pacar kamu bisa membuka web ini langsung dari HP-nya:
1. **GitHub Pages (Gratis)**:
   - Upload file `index.html`, `style.css`, dan `script.js` ke repository GitHub.
   - Buka Settings > Pages > Pilih Branch `main` > Save.
   - Link web siap dikirim ke pacar kamu!
2. **Vercel / Netlify (Drag & Drop)**:
   - Buka [vercel.com](https://vercel.com) atau [netlify.com](https://netlify.com).
   - Drag & drop folder project ini, dalam 1 menit website langsung online dengan domain cantik!
