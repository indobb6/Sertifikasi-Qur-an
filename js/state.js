// =========================================================================
// js/state.js
// Konfigurasi Global: Data konstan dan variabel state aplikasi
// =========================================================================

// --- DATA REFERENSI SURAH ---
const surahData = {
    "30": ["An-Naba", "An-Nazi'at", "'Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat", "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraish", "Al-Ma'un", "Al-Kauthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"],
    "29": ["Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat"],
    "28": ["Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim"],
    "27": ["Az-Zariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid"],
    "26": ["Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf"]
};

const tahunAjaranList = ["2024/2025", "2025/2026", "2026/2027", "2027/2028", "2028/2029", "2029/2030"];

const kelasList = [
    '1 Bilal', '1 Khalid', '1 Zaid', '1 Khansa', '1 Khabsyah', '1 Ummu Kultsum',
    '2 Anas', '2 Muadz', '2 Mushab', '2 Sumayyah', '2 Nusaibah', '2 Halimah',
    '3 Ali', '3 Hamzah', '3 Tholhah', '3 Aisyah', '3 Fatimah', '3 rumaysho', '3 Hafshoh',
    '4 Abdurrahman', '4 Utsman', '4 Saad', '4 Zainab', '4 Asma',
    '5 Umar', '5 Hasan', '5 Hindun', '5 Ruqoyyah',
    '6 Abu Bakar', '6 Thoriq', '6 Khadijah', '6 Shofiyyah'
];

// --- STATE APLIKASI ---
let state = {
    view: 'login',
    role: null,
    db: [],
    pengujiList: [],
    currentStudent: null,
    filterCetak: null,
    filterPendaftar: null,
    filterHaflah: null,
    namaPenguji: null,
    username: null,
    sortLaporan: 'terbaru',
    searchLaporan: ''
};

// --- MUAT SESSION TERSIMPAN ---
const savedSession = localStorage.getItem('userSession_Arkan');
if (savedSession) {
    const sessionData = JSON.parse(savedSession);
    state.role = sessionData.role;
    state.namaPenguji = sessionData.nama;
    state.username = sessionData.username;
    state.view = sessionData.lastView || 'dashboard';
}
