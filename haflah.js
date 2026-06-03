// =========================================================================
// js/pages/haflah.js
// Halaman Haflah Akhirussanah
// =========================================================================

function exportExcelHaflah() {
    const tahunAjaran = state.filterHaflah || getCurrentPeriod().tahunAjaran;

    let filteredDb = state.db.filter(d =>
        d.tahunAjaran === tahunAjaran &&
        (d.keterangan === 'Lulus' || d.keterangan === 'Remedial')
    );

    filteredDb.sort((a, b) => {
        if (parseInt(b.juz) !== parseInt(a.juz)) return parseInt(b.juz) - parseInt(a.juz);
        if (String(a.kelas) !== String(b.kelas)) return String(a.kelas).localeCompare(String(b.kelas), undefined, { numeric: true });
        return String(a.nama).localeCompare(String(b.nama));
    });

    const ws_data = filteredDb.map((d, i) => ({
        "No": i + 1,
        "Nama Lengkap": d.nama,
        "Kelas": d.kelas,
        "Juz": d.juz,
        "Rata-rata": d.rataRata,
        "Nama Ayah": d.namaAyah,
        "Nama Ibu": d.namaIbu,
        "Cita-Cita": d.citaCita,
        "Keterangan": d.keterangan
    }));

    const ws = XLSX.utils.json_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Peserta Haflah");
    XLSX.writeFile(wb, `Data_Peserta_Haflah_${tahunAjaran.replace('/', '-')}.xlsx`);
}

function viewHaflah() {
    if (state.role !== 'admin' && state.role !== 'penguji') return navigate('dashboard');

    if (!state.filterHaflah) {
        state.filterHaflah = getCurrentPeriod().tahunAjaran;
    }
    const tahunAjaran = state.filterHaflah;

    // Filter gabungan semester 1 & 2 untuk tahun ajaran yang dipilih
    let filteredDb = state.db.filter(d =>
        d.tahunAjaran === tahunAjaran &&
        (d.keterangan === 'Lulus' || d.keterangan === 'Remedial')
    );

    // Sort: Juz (Desc) -> Kelas -> Nama (Asc)
    filteredDb.sort((a, b) => {
        if (parseInt(b.juz) !== parseInt(a.juz)) return parseInt(b.juz) - parseInt(a.juz);
        if (String(a.kelas) !== String(b.kelas)) return String(a.kelas).localeCompare(String(b.kelas), undefined, { numeric: true });
        return String(a.nama).localeCompare(String(b.nama));
    });

    let optionsTahun = tahunAjaranList.map(t => `<option value="${t}" ${tahunAjaran === t ? 'selected' : ''}>${t}</option>`).join('');

    let trs = '';
    if (filteredDb.length === 0) {
        trs = `<tr><td colspan="8" class="px-4 py-10 text-center text-gray-500 font-medium italic">Belum ada data peserta Haflah untuk Tahun Ajaran ini.</td></tr>`;
    } else {
        filteredDb.forEach((d, index) => {
            trs += `
                <tr class="hover:bg-gray-50 border-b border-gray-100 transition print:border-black">
                    <td class="px-4 py-3.5 text-sm text-gray-500 text-center print:border print:border-black print:text-black">${index + 1}</td>
                    <td class="px-4 py-3.5 text-sm font-bold text-gray-900 print:border print:border-black print:text-black">${d.nama}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 text-center print:border print:border-black print:text-black">${d.kelas}</td>
                    <td class="px-4 py-3.5 text-sm font-bold text-gray-600 text-center print:border print:border-black print:text-black">${d.juz}</td>
                    <td class="px-4 py-3.5 text-sm font-black text-center text-gray-900 print:border print:border-black print:text-black">${d.rataRata}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 print:border print:border-black print:text-black">${d.namaAyah}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 print:border print:border-black print:text-black">${d.namaIbu}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 print:border print:border-black print:text-black">${d.citaCita}</td>
                </tr>
            `;
        });
    }

    return `
        <div class="no-print p-3 sm:p-5 bg-gray-900 flex flex-col md:flex-row justify-between items-start md:items-center text-white sticky top-0 z-50 shadow-lg gap-4 pt-[env(safe-area-inset-top)]">
            <button onclick="navigate('dashboard')" class="w-full md:w-auto px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold transition border border-gray-700 flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Dashboard
            </button>

            <div class="flex items-center gap-2 w-full md:w-auto justify-center">
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden md:inline">Tahun Ajaran:</span>
                <select id="filterTahunHaflah" onchange="updateFilterHaflah()" class="bg-gray-800 border border-gray-700 text-white text-sm font-medium rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-white outline-none w-full sm:w-auto">
                    ${optionsTahun}
                </select>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="exportExcelHaflah()" class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                    <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> Excel
                </button>
                <button onclick="window.print()" class="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm shadow transition flex justify-center items-center gap-2">
                    <svg class="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak PDF
                </button>
            </div>
        </div>

        <div class="bg-white p-0 sm:p-6 rounded-2xl shadow-sm border border-gray-100 print-container overflow-hidden landscape-print">
            <h1 class="print-only text-2xl font-bold text-center mt-4 mb-2 uppercase tracking-wide">Daftar Peserta Haflah Akhirussanah</h1>
            <h3 class="print-only text-md text-center mb-6 font-semibold">Tahun Ajaran ${tahunAjaran}</h3>
            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full text-left border-collapse border-t border-gray-100 print:border-black print:border-2">
                    <thead class="bg-gray-50 print:bg-gray-200">
                        <tr>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b print:border-black print:text-black">No</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-b print:border-black print:text-black">Nama Lengkap</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b print:border-black print:text-black">Kelas</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b print:border-black print:text-black">Juz</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b print:border-black print:text-black">Nilai</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-b print:border-black print:text-black">Nama Ayah</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-b print:border-black print:text-black">Nama Ibu</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b print:border-black print:text-black">Cita-Cita</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 print:divide-black">
                        ${trs}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}
