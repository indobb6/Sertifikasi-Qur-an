// =========================================================================
// js/pages/laporan.js
// Halaman Laporan, Cetak Individual, dan Cetak Semua
// =========================================================================

function updateSortLaporan(val) {
    state.sortLaporan = val;
    render();
    if (state.searchLaporan) {
        const searchEl = document.getElementById('filterNama');
        if (searchEl) { searchEl.value = state.searchLaporan; filterLaporanDOM(); }
    }
}

function viewLaporan() {
    if (state.role !== 'admin' && state.role !== 'penguji') return navigate('dashboard');

    let displayDb = [...state.db];
    if (state.sortLaporan === 'nama_az') displayDb.sort((a, b) => String(a.nama || '').localeCompare(String(b.nama || '')));
    else if (state.sortLaporan === 'nama_za') displayDb.sort((a, b) => String(b.nama || '').localeCompare(String(a.nama || '')));
    else if (state.sortLaporan === 'kelas') displayDb.sort((a, b) => String(a.kelas || '').localeCompare(String(b.kelas || ''), undefined, { numeric: true }));
    else if (state.sortLaporan === 'nilai_tinggi') displayDb.sort((a, b) => (b.rataRata || 0) - (a.rataRata || 0));
    else if (state.sortLaporan === 'nilai_rendah') displayDb.sort((a, b) => (a.rataRata || 0) - (b.rataRata || 0));

    let desktopTrs = '';
    let mobileCards = '';

    if (displayDb.length === 0) {
        const emptyMsg = `<div class="py-10 text-center text-gray-500 font-medium text-sm">Belum ada data nilai.</div>`;
        desktopTrs = `<tr><td colspan="7">${emptyMsg}</td></tr>`;
        mobileCards = emptyMsg;
    } else {
        displayDb.forEach((d, index) => {
            const statusText = d.keterangan || 'Belum Dinilai';
            const statusBgClass = statusText === 'Lulus' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                statusText === 'Remedial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                statusText === 'Belum Lulus' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200';

            desktopTrs += `
                <tr class="hover:bg-gray-50 border-b border-gray-100 transition">
                    <td class="px-4 py-4 text-sm text-gray-500 text-center">${index + 1}</td>
                    <td class="px-4 py-4 text-sm font-bold text-gray-900 searchable-name-desktop">${d.nama}</td>
                    <td class="px-4 py-4 text-sm text-gray-600 text-center font-medium">${d.kelas}</td>
                    <td class="px-4 py-4 text-sm font-bold text-gray-600 text-center">Juz ${d.juz}</td>
                    <td class="px-4 py-4 text-sm font-black text-center text-gray-900">${d.rataRata}</td>
                    <td class="px-4 py-4 text-sm text-center">
                        <span class="px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold ${statusBgClass}">${statusText}</span>
                    </td>
                    <td class="px-4 py-4 text-sm text-center">
                        <div class="flex justify-center gap-2">
                            <button onclick="bukaCetak('${d.id}')" class="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition" title="Cetak/Excel"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg></button>
                            ${(state.role === 'admin' || (state.role === 'penguji' && (!d.penguji || d.penguji === state.namaPenguji))) ? `
                                <button onclick="bukaEdit('${d.id}')" class="bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white p-2 rounded-lg transition" title="Edit Nilai"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                <button onclick="hapusData('${d.id}', 'laporan')" class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition" title="Hapus"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;

            mobileCards += `
                <div class="mobile-card-item bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1.5 h-full ${statusText === 'Lulus' ? 'bg-emerald-500' : statusText === 'Remedial' ? 'bg-amber-500' : statusText === 'Belum Lulus' ? 'bg-red-500' : 'bg-gray-300'}"></div>
                    <div class="pl-3">
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-bold text-gray-900 text-sm searchable-name-mobile line-clamp-1 pr-2">${d.nama}</div>
                            <span class="px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-bold shrink-0 ${statusBgClass}">${statusText}</span>
                        </div>
                        <div class="text-[11px] font-medium text-gray-500 mb-4">${d.kelas} &bull; Juz ${d.juz}</div>
                        <div class="flex justify-between items-end border-t border-gray-100 pt-4">
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rata-rata</div>
                                <div class="font-black text-xl text-gray-900 leading-none mt-1">${d.rataRata}</div>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="bukaCetak('${d.id}')" class="bg-indigo-50 text-indigo-600 active:bg-indigo-100 p-2.5 rounded-xl transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg></button>
                                ${(state.role === 'admin' || (state.role === 'penguji' && (!d.penguji || d.penguji === state.namaPenguji))) ? `
                                    <button onclick="bukaEdit('${d.id}')" class="bg-gray-100 text-gray-700 active:bg-gray-200 p-2.5 rounded-xl transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                    <button onclick="hapusData('${d.id}', 'laporan')" class="bg-red-50 text-red-600 active:bg-red-100 p-2.5 rounded-xl transition"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    return renderLayout(`
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-5 sm:p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <h2 class="text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap">Hasil Sertifikasi</h2>
                    <button onclick="navigate('cetakSemua')" class="w-full sm:w-auto justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        Cetak PDF
                    </button>
                </div>

                <div class="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <select id="sortLaporan" onchange="updateSortLaporan(this.value)" class="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-gray-900 focus:border-gray-900 bg-white shadow-sm font-semibold text-gray-600 outline-none">
                        <option value="terbaru" ${state.sortLaporan === 'terbaru' ? 'selected' : ''}>Urutan Terbaru</option>
                        <option value="nama_az" ${state.sortLaporan === 'nama_az' ? 'selected' : ''}>Nama (A - Z)</option>
                        <option value="nama_za" ${state.sortLaporan === 'nama_za' ? 'selected' : ''}>Nama (Z - A)</option>
                        <option value="kelas" ${state.sortLaporan === 'kelas' ? 'selected' : ''}>Urutan Kelas</option>
                        <option value="nilai_tinggi" ${state.sortLaporan === 'nilai_tinggi' ? 'selected' : ''}>Nilai Tertinggi</option>
                        <option value="nilai_rendah" ${state.sortLaporan === 'nilai_rendah' ? 'selected' : ''}>Nilai Terendah</option>
                    </select>
                    <div class="relative w-full sm:w-64">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" id="filterNama" value="${state.searchLaporan || ''}" placeholder="Cari nama peserta..." onkeyup="handleSearchLaporan(this.value)" class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm shadow-sm outline-none font-medium">
                    </div>
                </div>
            </div>

            <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left" id="tabelLaporan">
                    <thead class="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">No</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Kelas</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Juz</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Rata-rata</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th class="px-4 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${desktopTrs}
                    </tbody>
                </table>
            </div>

            <div class="md:hidden p-4 bg-gray-50 hide-scrollbar">
                ${mobileCards}
            </div>
        </div>
    `);
}

function handleSearchLaporan(val) {
    state.searchLaporan = val;
    filterLaporanDOM();
}

function filterLaporanDOM() {
    const filter = state.searchLaporan.toLowerCase();
    const table = document.getElementById("tabelLaporan");
    if (table) {
        const tr = table.getElementsByTagName("tr");
        for (let i = 1; i < tr.length; i++) {
            let nameEl = tr[i].querySelector(".searchable-name-desktop");
            if (nameEl) tr[i].style.display = nameEl.innerText.toLowerCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
    const cards = document.querySelectorAll(".mobile-card-item");
    cards.forEach(card => {
        let nameEl = card.querySelector(".searchable-name-mobile");
        if (nameEl) card.style.display = nameEl.innerText.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    });
}

function bukaCetak(id) {
    const data = state.db.find(d => d.id === id);
    if (data) navigate('cetak', data);
}

function bukaEdit(id) {
    const data = state.db.find(d => d.id === id);
    if (data) {
        if (state.role === 'penguji' && data.penguji && data.penguji !== state.namaPenguji) {
            showToast('Akses Ditolak: Anda hanya dapat mengedit data peserta yang Anda input sendiri.', 'error');
            return;
        }
        navigate('penilaian', data);
    }
}

function hapusData(id, sourceView = 'laporan') {
    const data = state.db.find(d => d.id === id);
    if (!data) return;
    if (state.role === 'penguji' && data.penguji && data.penguji !== state.namaPenguji) {
        showToast('Akses Ditolak: Anda hanya dapat menghapus data yang Anda input sendiri.', 'error');
        return;
    }

    showConfirmDialog(
        'Hapus Data Peserta',
        `Yakin ingin menghapus data <b>${data.nama}</b> secara permanen? Data yang dihapus tidak dapat dikembalikan.`,
        () => { server.deleteData(id, sourceView); }
    );
}

function exportExcelIndividu() {
    const d = state.currentStudent;
    if (!d) return;

    const listSurah = surahData[d.juz] || [];
    let ws_data = [
        ["LAPORAN HASIL SERTIFIKASI AL-QUR'AN"],
        ["Tahun Ajaran", d.tahunAjaran, "Semester", d.semester],
        ["Nama Lengkap", d.nama, "Kelas", d.kelas],
        ["Juz", d.juz, "Pengampu", d.penguji || d.pengampu || ''],
        ["Keterangan", d.keterangan || 'Belum Dinilai', "Rata-rata", d.rataRata],
        ["Catatan", d.catatan || ''],
        [],
        ["No", "Nama Surat", "Nilai"]
    ];

    listSurah.forEach((surah, index) => {
        const nilai = d.nilai[surah] !== undefined ? d.nilai[surah] : 0;
        ws_data.push([index + 1, surah, nilai]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Nilai Individu");
    XLSX.writeFile(wb, `Nilai_Sertifikasi_${d.nama.replace(/ /g, '_')}_Juz${d.juz}.xlsx`);
}

function viewCetak() {
    const d = state.currentStudent;
    if (!d) return navigate('dashboard');

    const listSurah = surahData[d.juz] || [];
    let rows = listSurah.map((surah, index) => {
        const nilai = d.nilai[surah] !== undefined ? d.nilai[surah] : 0;
        const isRemedial = d.keterangan === 'Remedial' && nilai < 78;
        return `
            <tr class="${isRemedial ? 'bg-amber-50 print:bg-transparent' : ''}">
                <td class="border border-black px-2 sm:px-4 py-2 text-center w-10 sm:w-12">${index + 1}</td>
                <td class="border border-black px-3 sm:px-4 py-2 ${isRemedial ? 'font-bold text-amber-700 print:text-black' : ''}">${surah} ${isRemedial ? '<span class="text-[10px] sm:text-xs ml-1 no-print">(Remedial)</span>' : ''}</td>
                <td class="border border-black px-2 sm:px-4 py-2 text-center w-20 sm:w-32 font-medium ${isRemedial ? 'text-red-600 print:text-black' : ''}">${nilai}</td>
            </tr>
        `;
    }).join('');

    let textColorKeterangan = d.keterangan === 'Lulus' ? 'text-green-700' : d.keterangan === 'Remedial' ? 'text-amber-600' : d.keterangan === 'Belum Lulus' ? 'text-red-600' : 'text-gray-800';

    return `
        <div class="no-print bg-gray-900 sticky top-0 z-50 shadow-lg pt-[env(safe-area-inset-top)]">
            <div class="p-3 sm:p-5 flex flex-col sm:flex-row justify-between items-center text-white gap-4">
                <button onclick="navigate('${state.role === 'pengunjung' ? 'dashboard' : 'laporan'}')" class="w-full sm:w-auto px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 border border-gray-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    ${state.role === 'pengunjung' ? 'Kembali' : 'Ke Laporan'}
                </button>
                <div class="font-bold text-sm hidden sm:block tracking-widest uppercase text-gray-400">Mode Pratinjau Cetak</div>
                <div class="flex gap-2 w-full sm:w-auto">
                    <button onclick="exportExcelIndividu()" class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Excel
                    </button>
                    <button onclick="window.print()" class="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak PDF
                    </button>
                </div>
            </div>
        </div>

        <div class="print-container max-w-4xl mx-auto bg-white p-6 sm:p-12 min-h-screen shadow-lg">
            <div class="text-center mb-8 sm:mb-10 border-b-2 border-black pb-5">
                <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight">Laporan Hasil Sertifikasi</h1>
                <h2 class="text-xl sm:text-2xl font-bold uppercase mt-2">Juz ${d.juz}</h2>
                <h3 class="text-lg sm:text-xl mt-1 font-semibold text-gray-700">SDIT Arkan Cendekia</h3>
                <p class="text-sm mt-2 font-medium">Tahun Ajaran ${d.tahunAjaran} - Semester ${d.semester}</p>
            </div>

            <div class="mb-8 flex flex-col sm:flex-row justify-between gap-6 text-sm font-medium">
                <div>
                    <table class="w-auto">
                        <tr><td class="py-1.5 pr-6 border-none !p-0 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Nama Lengkap</td><td class="border-none !p-0 font-bold text-base">: ${d.nama}</td></tr>
                        <tr><td class="py-1.5 pr-6 border-none !p-0 text-gray-500 uppercase tracking-widest text-[11px] font-bold">Kelas</td><td class="border-none !p-0 text-base">: ${d.kelas}</td></tr>
                    </table>
                </div>
                <div class="sm:text-right flex flex-col sm:items-end">
                    <div class="border-2 border-black px-6 py-3 inline-block rounded-xl text-center min-w-[160px] bg-gray-50 print:bg-transparent">
                        <div class="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Keterangan</div>
                        <div class="font-black text-xl ${textColorKeterangan} print:text-black uppercase tracking-wide">${d.keterangan || 'Belum Dinilai'}</div>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full mb-8 border-collapse border-2 border-black min-w-[300px]">
                    <thead>
                        <tr class="bg-gray-100 print:bg-gray-200">
                            <th class="border-2 border-black px-3 sm:px-4 py-3 text-center w-12 text-[11px] uppercase tracking-widest">No</th>
                            <th class="border-2 border-black px-4 py-3 text-center text-[11px] uppercase tracking-widest">Nama Surat</th>
                            <th class="border-2 border-black px-4 py-3 text-center w-32 text-[11px] uppercase tracking-widest">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                    <tfoot>
                        <tr class="bg-gray-50 print:bg-gray-100">
                            <th colspan="2" class="border-2 border-black px-4 py-4 text-right uppercase font-bold text-xs tracking-widest">Rata-Rata Nilai Akhir</th>
                            <th class="border-2 border-black px-4 py-4 text-center text-xl font-black">${d.rataRata}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            ${d.catatan ? `
            <div class="mb-10 text-sm border-2 border-black p-5 rounded-xl bg-gray-50 print:bg-transparent relative">
                <div class="absolute -top-3 left-4 bg-white px-2 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1">Catatan Penguji</div>
                <p class="whitespace-pre-wrap font-medium">${d.catatan}</p>
            </div>` : ''}

            <div class="mt-12 flex justify-end text-sm">
                <div class="text-center w-56">
                    <p class="font-medium">Bekasi, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="mb-24 mt-1 font-semibold text-gray-600">Penguji / Guru Tahfiz</p>
                    <p class="font-bold underline text-base">( ${d.penguji || state.namaPenguji || '........................................'} )</p>
                </div>
            </div>
        </div>
    `;
}

function exportExcelSemua() {
    if (!state.filterCetak) {
        if (state.db.length > 0) {
            const dataTerakhir = state.db[state.db.length - 1];
            state.filterCetak = { tahunAjaran: dataTerakhir.tahunAjaran || tahunAjaranList[0], semester: dataTerakhir.semester || '1' };
        } else {
            state.filterCetak = { tahunAjaran: tahunAjaranList[0], semester: '1' };
        }
    }

    const { tahunAjaran, semester } = state.filterCetak;
    let filteredDb = state.db.filter(d => d.tahunAjaran === tahunAjaran && d.semester === semester);

    if (state.sortLaporan === 'nama_az') filteredDb.sort((a, b) => String(a.nama || '').localeCompare(String(b.nama || '')));
    else if (state.sortLaporan === 'nama_za') filteredDb.sort((a, b) => String(b.nama || '').localeCompare(String(a.nama || '')));
    else if (state.sortLaporan === 'kelas') filteredDb.sort((a, b) => String(a.kelas || '').localeCompare(String(b.kelas || ''), undefined, { numeric: true }));
    else if (state.sortLaporan === 'nilai_tinggi') filteredDb.sort((a, b) => (b.rataRata || 0) - (a.rataRata || 0));
    else if (state.sortLaporan === 'nilai_rendah') filteredDb.sort((a, b) => (a.rataRata || 0) - (b.rataRata || 0));

    const ws_data = filteredDb.map((d, i) => ({
        "No": i + 1,
        "Nama Lengkap": d.nama,
        "Kelas": d.kelas,
        "Juz": d.juz,
        "Rata-rata": d.rataRata,
        "Keterangan": d.keterangan || 'Belum Dinilai',
        "Pengampu": d.penguji || d.pengampu || '',
        "Catatan": d.catatan || ''
    }));

    const ws = XLSX.utils.json_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai");
    XLSX.writeFile(wb, `Rekap_Nilai_Sertifikasi_${tahunAjaran.replace(/ /g, '_')}_Smt${semester}.xlsx`);
}

function viewCetakSemua() {
    if (!state.filterCetak) {
        if (state.db.length > 0) {
            const dataTerakhir = state.db[state.db.length - 1];
            state.filterCetak = {
                tahunAjaran: dataTerakhir.tahunAjaran || tahunAjaranList[0],
                semester: dataTerakhir.semester || '1'
            };
        } else {
            state.filterCetak = { tahunAjaran: tahunAjaranList[0], semester: '1' };
        }
    }

    const { tahunAjaran, semester } = state.filterCetak;
    let filteredDb = state.db.filter(d => d.tahunAjaran === tahunAjaran && d.semester === semester);

    if (state.sortLaporan === 'nama_az') filteredDb.sort((a, b) => String(a.nama || '').localeCompare(String(b.nama || '')));
    else if (state.sortLaporan === 'nama_za') filteredDb.sort((a, b) => String(b.nama || '').localeCompare(String(a.nama || '')));
    else if (state.sortLaporan === 'kelas') filteredDb.sort((a, b) => String(a.kelas || '').localeCompare(String(b.kelas || ''), undefined, { numeric: true }));
    else if (state.sortLaporan === 'nilai_tinggi') filteredDb.sort((a, b) => (b.rataRata || 0) - (a.rataRata || 0));
    else if (state.sortLaporan === 'nilai_rendah') filteredDb.sort((a, b) => (a.rataRata || 0) - (b.rataRata || 0));

    let trs = filteredDb.map((d, index) => `
        <tr>
            <td class="border border-black px-4 py-3 text-center w-12">${index + 1}</td>
            <td class="border border-black px-4 py-3 font-semibold">${d.nama}</td>
            <td class="border border-black px-4 py-3 text-center">${d.kelas}</td>
            <td class="border border-black px-4 py-3 text-center">Juz ${d.juz}</td>
            <td class="border border-black px-4 py-3 text-center font-black">${d.rataRata}</td>
            <td class="border border-black px-4 py-3 text-center font-bold ${d.keterangan === 'Lulus' ? 'text-green-700' : d.keterangan === 'Remedial' ? 'text-amber-600' : 'text-red-600'} print:text-black">${d.keterangan || 'Belum Dinilai'}</td>
        </tr>
    `).join('');

    if (filteredDb.length === 0) trs = `<tr><td colspan="6" class="border border-black px-4 py-10 text-center text-gray-500 font-medium italic">Belum ada data sertifikasi untuk periode ini.</td></tr>`;

    let optionsTahun = tahunAjaranList.map(t => `<option value="${t}" ${tahunAjaran === t ? 'selected' : ''}>${t}</option>`).join('');

    return `
        <div class="no-print bg-gray-900 sticky top-0 z-50 shadow-lg pt-[env(safe-area-inset-top)]">
            <div class="p-3 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4">
                <button onclick="navigate('laporan'); state.filterCetak = null;" class="w-full md:w-auto px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold transition border border-gray-700 flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Kembali
                </button>

                <div class="flex items-center gap-2 w-full md:w-auto justify-center">
                    <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden md:inline">Filter Data:</span>
                    <select id="printFilterTahun" onchange="updateFilterCetak()" class="bg-gray-800 border border-gray-700 text-white text-sm font-medium rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-white outline-none w-1/2 sm:w-auto">
                        ${optionsTahun}
                    </select>
                    <select id="printFilterSemester" onchange="updateFilterCetak()" class="bg-gray-800 border border-gray-700 text-white text-sm font-medium rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-white outline-none w-1/2 sm:w-auto">
                        <option value="1" ${semester == '1' ? 'selected' : ''}>Semester 1</option>
                        <option value="2" ${semester == '2' ? 'selected' : ''}>Semester 2</option>
                    </select>
                </div>

                <div class="flex gap-2 w-full md:w-auto">
                    <button onclick="exportExcelSemua()" class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                        <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Excel
                    </button>
                    <button onclick="window.print()" class="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                        <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak PDF
                    </button>
                </div>
            </div>
        </div>

        <div class="print-container max-w-5xl mx-auto bg-white p-6 sm:p-12 min-h-screen shadow-lg">
            <div class="text-center mb-8 sm:mb-10 border-b-2 border-black pb-5">
                <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight">Rekapitulasi Hasil Sertifikasi</h1>
                <h2 class="text-xl sm:text-2xl font-bold uppercase mt-2 text-gray-700">SDIT Arkan Cendekia</h2>
                <p class="text-sm mt-3 font-medium bg-gray-100 inline-block px-4 py-1.5 rounded-full print:bg-transparent print:border print:border-black">Tahun Ajaran ${tahunAjaran} - Semester ${semester}</p>
            </div>

            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full mb-8 border-collapse border-2 border-black min-w-[600px]">
                    <thead>
                        <tr class="bg-gray-100 print:bg-gray-200">
                            <th class="border-2 border-black px-4 py-3.5 text-center w-12 text-[11px] font-bold uppercase tracking-widest">No</th>
                            <th class="border-2 border-black px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest">Nama Lengkap</th>
                            <th class="border-2 border-black px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest">Kelas</th>
                            <th class="border-2 border-black px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest">Juz</th>
                            <th class="border-2 border-black px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest">Rata-rata</th>
                            <th class="border-2 border-black px-4 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${trs}
                    </tbody>
                </table>
            </div>

            <div class="mt-12 flex justify-end text-sm">
                <div class="text-center w-48 sm:w-56">
                    <p class="font-medium">Bekasi, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p class="mb-24 mt-1 font-semibold text-gray-600">Koordinator QL</p>
                    <p class="font-bold underline text-base">( Rifki Ihsanul Hakim, S.Pd )</p>
                </div>
            </div>
        </div>
    `;
}
