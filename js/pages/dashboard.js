// =========================================================================
// js/pages/dashboard.js
// Halaman Dashboard Admin, Penguji, dan Pengunjung
// =========================================================================

// --- DASHBOARD ADMIN & PENGUJI ---
function viewDashboard() {
    const period = getCurrentPeriod();
    const currentDb = state.db.filter(d => d.tahunAjaran === period.tahunAjaran && d.semester === period.semester);

    const totalSiswa = currentDb.length;
    const lulus = currentDb.filter(d => d.keterangan === 'Lulus').length;
    const remedial = currentDb.filter(d => d.keterangan === 'Remedial').length;
    const belumLulus = currentDb.filter(d => d.keterangan === 'Belum Lulus').length;

    const pctLulus = totalSiswa > 0 ? ((lulus / totalSiswa) * 100).toFixed(1) : 0;
    const pctRemedial = totalSiswa > 0 ? ((remedial / totalSiswa) * 100).toFixed(1) : 0;
    const pctBelumLulus = totalSiswa > 0 ? ((belumLulus / totalSiswa) * 100).toFixed(1) : 0;

    let welcomeMsg = '';
    if ((state.role === 'admin' || state.role === 'penguji') && state.namaPenguji) {
        welcomeMsg = `
        <div class="mb-5 sm:mb-6 bg-gray-900 text-white p-5 sm:p-6 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden">
            <div class="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-10-5v10.5l10 5 10-5V4.5l-10 5z"></path></svg>
            </div>
            <div class="relative z-10">
                <h3 class="font-bold text-xl sm:text-2xl tracking-tight">Ahlan wa Sahlan, ${state.namaPenguji}!</h3>
                <p class="text-gray-300 text-sm mt-1 font-medium">Semoga harimu menyenangkan dan penuh berkah.</p>
            </div>
        </div>`;
    }

    return renderLayout(`
        ${welcomeMsg}
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Statistik Data</h2>
            <span class="bg-indigo-50 text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-sm uppercase tracking-wider">
                TA ${period.tahunAjaran} - SMT ${period.semester}
            </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
            <div class="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-6">
                <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:border-gray-300 transition">
                    <div class="absolute right-0 top-0 w-1 h-full bg-indigo-500"></div>
                    <div class="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Total Peserta</div>
                    <div class="text-3xl sm:text-4xl font-black text-gray-900 mt-3 tracking-tight">${totalSiswa}</div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:border-gray-300 transition">
                    <div class="absolute right-0 top-0 w-1 h-full bg-emerald-500"></div>
                    <div class="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Lulus (≥80)</div>
                    <div class="text-3xl sm:text-4xl font-black text-emerald-600 mt-3 tracking-tight">${lulus}</div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:border-gray-300 transition">
                    <div class="absolute right-0 top-0 w-1 h-full bg-amber-500"></div>
                    <div class="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Remedial</div>
                    <div class="text-3xl sm:text-4xl font-black text-amber-500 mt-3 tracking-tight">${remedial}</div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:border-gray-300 transition">
                    <div class="absolute right-0 top-0 w-1 h-full bg-red-500"></div>
                    <div class="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest">Belum Lulus</div>
                    <div class="text-3xl sm:text-4xl font-black text-red-600 mt-3 tracking-tight">${belumLulus}</div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col min-h-[240px]">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest w-full text-center mb-4 sm:mb-6">Rasio Kelulusan</h3>
                ${totalSiswa === 0
                    ? '<div class="text-gray-300 text-xs italic flex items-center justify-center flex-grow font-medium">Belum ada data visual.</div>'
                    : `<div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 flex-grow w-full">
                           <div class="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                               <canvas id="kelulusanChart"></canvas>
                           </div>
                           <div class="flex flex-col gap-3.5 w-full sm:w-auto">
                               <div class="flex items-center justify-between gap-4">
                                   <div class="flex items-center gap-2">
                                       <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm"></div>
                                       <div class="text-sm text-gray-700 font-semibold">Lulus</div>
                                   </div>
                                   <div class="text-right"><span class="text-sm font-black text-gray-900">${pctLulus}%</span></div>
                               </div>
                               <div class="flex items-center justify-between gap-4">
                                   <div class="flex items-center gap-2">
                                       <div class="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm"></div>
                                       <div class="text-sm text-gray-700 font-semibold">Remedial</div>
                                   </div>
                                   <div class="text-right"><span class="text-sm font-black text-gray-900">${pctRemedial}%</span></div>
                               </div>
                               <div class="flex items-center justify-between gap-4">
                                   <div class="flex items-center gap-2">
                                       <div class="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></div>
                                       <div class="text-sm text-gray-700 font-semibold">Gagal</div>
                                   </div>
                                   <div class="text-right"><span class="text-sm font-black text-gray-900">${pctBelumLulus}%</span></div>
                               </div>
                           </div>
                       </div>`
                }
            </div>
        </div>

        <h2 class="text-lg font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">Menu Utama</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            ${(state.role === 'admin' || state.role === 'penguji') ? `
            <div onclick="navigate('penilaian')" class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 cursor-pointer active:scale-95 hover:border-gray-300 transition border border-gray-100 flex items-center group">
                <div class="bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-xl mr-4 group-hover:bg-gray-900 group-hover:text-white transition text-gray-700">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </div>
                <div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900">Form Penilaian</h3>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Input atau edit nilai hafalan siswa.</p>
                </div>
            </div>` : ''}

            <div onclick="navigate('laporan')" class="bg-white rounded-2xl shadow-sm p-4 sm:p-6 cursor-pointer active:scale-95 hover:border-gray-300 transition border border-gray-100 flex items-center group">
                <div class="bg-gray-50 border border-gray-100 p-3 sm:p-4 rounded-xl mr-4 group-hover:bg-gray-900 group-hover:text-white transition text-gray-700">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900">Hasil Sertifikasi</h3>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Lihat database dan export ke Excel/PDF.</p>
                </div>
            </div>
        </div>
    `);
}

// --- DASHBOARD PENGUNJUNG ---
function viewDashboardPengunjung() {
    return renderLayout(`
        <div class="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mt-4 sm:mt-10">
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-800 transform rotate-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <h2 class="text-2xl font-black text-gray-900 tracking-tight">Cek Hasil Sertifikasi</h2>
                <p class="text-sm text-gray-500 mt-2 font-medium">Cari nama ananda untuk melihat hasil penilaian.</p>
            </div>

            <div class="relative mb-6">
                <input type="text" id="searchPengunjung" onkeyup="previewSearchPengunjung()" autocomplete="off" placeholder="Ketik nama lengkap ananda..." class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:bg-white transition text-sm font-medium shadow-sm outline-none">
                <div id="dropdownPengunjung" class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl hidden z-50 max-h-60 overflow-y-auto"></div>
            </div>

            <div id="verifikasiSeksi" class="hidden transform transition-all duration-300 ease-in-out">
                <div class="p-6 bg-gray-900 rounded-xl border border-gray-800 text-white shadow-xl relative overflow-hidden">
                    <div class="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
                        <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                            <h3 class="font-bold text-white tracking-wide uppercase text-sm">Verifikasi Keamanan</h3>
                        </div>
                        <p class="text-xs text-gray-400 mb-4" id="namaVerifikasiDisplay"></p>
                        <input type="hidden" id="idVerifikasi">
                        <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tanggal Lahir Ananda</label>
                        <input type="date" id="tglLahirVerifikasi" class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white text-sm font-medium outline-none text-white"
                            onkeydown="if(event.key==='Enter') verifikasiDanLihat()">
                        <div id="errorVerifikasi" class="text-red-400 text-xs font-bold mt-3 hidden">Data tidak cocok! Silakan periksa kembali.</div>
                        <button onclick="verifikasiDanLihat()" class="w-full mt-5 bg-white text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition active:scale-95 shadow-lg">Buka Hasil Penilaian</button>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function previewSearchPengunjung() {
    const input = document.getElementById('searchPengunjung').value.toLowerCase().trim();
    const dropdown = document.getElementById('dropdownPengunjung');
    document.getElementById('verifikasiSeksi').classList.add('hidden');

    if (!input) { dropdown.classList.add('hidden'); return; }

    const matches = state.db.filter(d => (d.nama || "").toLowerCase().includes(input));

    if (matches.length > 0) {
        let html = '';
        matches.forEach(m => {
            html += `
                <div onclick="pilihAnakPengunjung('${m.id}', '${m.nama}')" class="px-5 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition flex justify-between items-center group">
                    <div>
                        <div class="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition">${m.nama}</div>
                        <div class="text-[11px] text-gray-500 mt-1 font-medium">${m.kelas} &bull; Juz ${m.juz}</div>
                    </div>
                    <svg class="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </div>
            `;
        });
        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
    } else {
        dropdown.innerHTML = `<div class="px-5 py-4 text-xs text-gray-500 font-medium text-center">Nama tidak ditemukan...</div>`;
        dropdown.classList.remove('hidden');
    }
}

function pilihAnakPengunjung(id, nama) {
    document.getElementById('dropdownPengunjung').classList.add('hidden');
    document.getElementById('searchPengunjung').value = nama;

    document.getElementById('idVerifikasi').value = id;
    document.getElementById('namaVerifikasiDisplay').innerHTML = `Masukkan tanggal lahir untuk membuka rekam nilai <br/><b class="text-white text-sm inline-block mt-1">${nama}</b>`;
    document.getElementById('tglLahirVerifikasi').value = '';
    document.getElementById('errorVerifikasi').classList.add('hidden');

    document.getElementById('verifikasiSeksi').classList.remove('hidden');
}

function verifikasiDanLihat() {
    const id = document.getElementById('idVerifikasi').value;
    const inputTgl = document.getElementById('tglLahirVerifikasi').value;
    const err = document.getElementById('errorVerifikasi');

    if (!inputTgl) {
        err.innerText = "Harap masukkan tanggal lahir!";
        err.classList.remove('hidden');
        return;
    }

    const data = state.db.find(d => d.id === id);
    if (data && formatDateToYYYYMMDD(data.tanggalLahir) === inputTgl) {
        navigate('cetak', data);
    } else {
        err.innerText = "Tanggal lahir salah!";
        err.classList.remove('hidden');
    }
}
