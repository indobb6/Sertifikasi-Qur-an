// =========================================================================
// js/pages/pendaftaran.js
// Halaman Pendaftaran Siswa dan Data Pendaftar
// =========================================================================

function hitungUmur() {
    const dob = document.getElementById('inputTglLahir').value;
    if (!dob) { document.getElementById('inputUmur').value = ''; return; }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) { age--; }
    document.getElementById('inputUmur').value = age;
}

function viewPendaftaran() {
    if (state.role !== 'admin' && state.role !== 'penguji') {
        return renderLayout(`<div class="text-center py-20 text-red-500 font-bold">Akses Ditolak.</div>`);
    }

    const period = getCurrentPeriod();
    const isEdit = state.currentStudent !== null;
    const d = isEdit ? state.currentStudent : {
        id: '', nama: '', kelas: kelasList[0], tanggalLahir: '', umur: '', citaCita: '',
        namaAyah: '', namaIbu: '', pengampu: state.namaPenguji || '', juz: '30',
        tahunAjaran: period.tahunAjaran, semester: period.semester
    };

    let optPengampu = state.pengujiList.map(p => `<option value="${p}" ${d.pengampu === p ? 'selected' : ''}>${p}</option>`).join('');
    if (!optPengampu.includes(d.pengampu) && d.pengampu) optPengampu += `<option value="${d.pengampu}" selected>${d.pengampu}</option>`;
    let optionsTahun = tahunAjaranList.map(t => `<option value="${t}" ${d.tahunAjaran === t ? 'selected' : ''}>${t}</option>`).join('');

    return renderLayout(`
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">${isEdit ? 'Edit Pendaftaran Siswa' : 'Pendaftaran Sertifikasi'}</h2>
            <div class="flex gap-2 w-full sm:w-auto">
                <button onclick="resetFormPendaftaran()" class="flex-1 sm:flex-none bg-white border border-gray-200 hover:border-gray-900 hover:text-gray-900 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Reset
                </button>
                <button onclick="navigate('dataPendaftar')" class="flex-1 sm:flex-none bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-bold transition">Lihat Data</button>
                ${isEdit ? `<button onclick="resetFormPendaftaran()" class="flex-1 sm:flex-none bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold transition">Batal Edit</button>` : ''}
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-8 border border-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div class="md:col-span-2 pb-3 border-b border-gray-100">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide text-xs"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Biodata Siswa</h3>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                    <input type="text" id="inputNama" value="${d.nama}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold" required>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kelas</label>
                    <select id="inputKelas" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                        ${kelasList.map(k => `<option value="${k}" ${d.kelas === k ? 'selected' : ''}>${k}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tahun Ajaran</label>
                    <select id="inputTahunPendaftaran" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                        ${optionsTahun}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Semester</label>
                    <select id="inputSemesterPendaftaran" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                        <option value="1" ${d.semester == '1' ? 'selected' : ''}>Semester 1</option>
                        <option value="2" ${d.semester == '2' ? 'selected' : ''}>Semester 2</option>
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tanggal Lahir</label>
                    <input type="date" id="inputTglLahir" value="${formatDateToYYYYMMDD(d.tanggalLahir)}" onchange="hitungUmur()" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Umur (Otomatis)</label>
                    <input type="number" id="inputUmur" value="${d.umur}" readonly class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Cita-Cita</label>
                    <input type="text" id="inputCitaCita" value="${d.citaCita}" placeholder="Contoh: Menjadi Ulama..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                </div>

                <div class="md:col-span-2 pt-5 pb-3 border-b border-gray-100 mt-2">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide text-xs"><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> Data Tambahan &amp; Target</h3>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Ayah</label>
                    <input type="text" id="inputAyah" value="${d.namaAyah}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Ibu</label>
                    <input type="text" id="inputIbu" value="${d.namaIbu}" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pengampu Halaqoh</label>
                    <select id="inputPengampu" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none text-sm font-semibold">
                        <option value="">-- Pilih Guru --</option>
                        ${optPengampu}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Juz yang akan Diujikan</label>
                    <select id="inputJuz" class="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-gray-500 outline-none text-sm font-bold text-white">
                        ${[30, 29, 28, 27, 26].map(j => `<option value="${j}" ${d.juz == j ? 'selected' : ''}>Juz ${j}</option>`).join('')}
                    </select>
                </div>

                <div class="md:col-span-2 mt-4 pt-5 border-t border-gray-100 flex justify-end">
                    <input type="hidden" id="inputId" value="${d.id}">
                    <button onclick="simpanPendaftaran()" class="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition active:scale-95 text-sm sm:text-base border border-gray-800">
                        ${isEdit ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                    </button>
                </div>
            </div>
        </div>
    `);
}

function resetFormPendaftaran() {
    state.currentStudent = null;
    if (document.getElementById('inputNama')) document.getElementById('inputNama').value = '';
    if (document.getElementById('inputTglLahir')) document.getElementById('inputTglLahir').value = '';
    if (document.getElementById('inputUmur')) document.getElementById('inputUmur').value = '';
    if (document.getElementById('inputCitaCita')) document.getElementById('inputCitaCita').value = '';
    if (document.getElementById('inputAyah')) document.getElementById('inputAyah').value = '';
    if (document.getElementById('inputIbu')) document.getElementById('inputIbu').value = '';
    if (document.getElementById('inputId')) document.getElementById('inputId').value = '';
    navigate('pendaftaran');
}

function simpanPendaftaran() {
    const id = document.getElementById('inputId').value;
    const nama = document.getElementById('inputNama').value.trim();
    const tglLahir = document.getElementById('inputTglLahir').value;

    if (!nama) return showToast('Nama wajib diisi!', 'error');
    if (!tglLahir) return showToast('Tanggal lahir wajib diisi untuk keamanan!', 'error');

    const existingData = state.db.find(d => d.id === id) || {};

    const payload = {
        id: id || '',
        nama: nama,
        kelas: document.getElementById('inputKelas').value,
        tanggal_lahir: tglLahir,
        umur: document.getElementById('inputUmur').value || null,
        cita_cita: document.getElementById('inputCitaCita').value.trim(),
        nama_ayah: document.getElementById('inputAyah').value.trim(),
        nama_ibu: document.getElementById('inputIbu').value.trim(),
        pengampu: document.getElementById('inputPengampu').value,
        juz: document.getElementById('inputJuz').value,
        tahun_ajaran: document.getElementById('inputTahunPendaftaran').value,
        semester: document.getElementById('inputSemesterPendaftaran').value,
        nilai: existingData.nilai || {},
        rata_rata: existingData.rataRata || 0,
        keterangan: existingData.keterangan || '',
        catatan: existingData.catatan || '',
        penguji: existingData.penguji || '',
        tanggal: existingData.tanggal || new Date().toISOString()
    };

    server.saveData(payload, 'dataPendaftar');
}

function updateFilterPendaftar() {
    state.filterPendaftar = {
        tahunAjaran: document.getElementById('filterTahunPendaftar').value,
        semester: document.getElementById('filterSemesterPendaftar').value
    };
    render();
}

function exportExcelPendaftar() {
    const { tahunAjaran, semester } = state.filterPendaftar || getCurrentPeriod();
    const filteredDb = state.db.filter(d => d.tahunAjaran === tahunAjaran && d.semester === semester);

    const ws_data = filteredDb.map((d, i) => ({
        "No": i + 1,
        "Nama Lengkap": d.nama,
        "Kelas": d.kelas,
        "Juz": d.juz,
        "Tahun Ajaran": d.tahunAjaran,
        "Semester": d.semester,
        "Tanggal Lahir": formatDateToYYYYMMDD(d.tanggalLahir),
        "Umur": d.umur,
        "Cita-Cita": d.citaCita,
        "Nama Ayah": d.namaAyah,
        "Nama Ibu": d.namaIbu,
        "Pengampu Halaqoh": d.pengampu
    }));

    const ws = XLSX.utils.json_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Pendaftar");
    XLSX.writeFile(wb, `Data_Pendaftar_Sertifikasi_${tahunAjaran.replace('/', '-')}_Smt${semester}.xlsx`);
}

function viewDataPendaftar() {
    if (state.role !== 'admin' && state.role !== 'penguji') return navigate('dashboard');

    if (!state.filterPendaftar) {
        const period = getCurrentPeriod();
        state.filterPendaftar = { tahunAjaran: period.tahunAjaran, semester: period.semester };
    }
    const { tahunAjaran, semester } = state.filterPendaftar;
    let filteredDb = state.db.filter(d => d.tahunAjaran === tahunAjaran && d.semester === semester);

    let optionsTahun = tahunAjaranList.map(t => `<option value="${t}" ${tahunAjaran === t ? 'selected' : ''}>${t}</option>`).join('');

    let trs = '';
    if (filteredDb.length === 0) {
        trs = `<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500 font-medium italic text-sm">Belum ada data pendaftar untuk periode ini.</td></tr>`;
    } else {
        filteredDb.forEach((d, index) => {
            trs += `
                <tr class="hover:bg-gray-50 border-b border-gray-100 transition">
                    <td class="px-4 py-3.5 text-sm text-gray-500 text-center border-r print:border-black">${index + 1}</td>
                    <td class="px-4 py-3.5 text-sm font-bold text-gray-900 border-r print:border-black">${d.nama}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 text-center border-r print:border-black">${d.kelas}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-500 text-center border-r print:border-black">${formatDateToYYYYMMDD(d.tanggalLahir)}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-500 text-center border-r print:border-black">${d.umur}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-600 border-r print:border-black font-medium">${d.pengampu}</td>
                    <td class="px-4 py-3.5 text-sm text-center no-print">
                        ${(state.role === 'admin' || d.pengampu === state.namaPenguji || d.penguji === state.namaPenguji) ? `
                            <button onclick="navigate('pendaftaran', state.db.find(x => x.id === '${d.id}'))" class="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-900 hover:text-white px-3 py-1.5 rounded-lg font-bold text-xs transition mb-1 sm:mb-0">Edit</button>
                            <button onclick="hapusData('${d.id}', 'dataPendaftar')" class="bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg font-bold text-xs transition mt-1 sm:mt-0 sm:ml-1">Hapus</button>
                        ` : '-'}
                    </td>
                </tr>
            `;
        });
    }

    return renderLayout(`
        <div class="no-print flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Daftar Peserta</h2>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-center mb-2 sm:mb-0">
                <select id="filterTahunPendaftar" onchange="updateFilterPendaftar()" class="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-gray-900 outline-none w-1/2 sm:w-auto shadow-sm font-semibold">
                    ${optionsTahun}
                </select>
                <select id="filterSemesterPendaftar" onchange="updateFilterPendaftar()" class="bg-white border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-lg px-3 py-2 focus:ring-gray-900 outline-none w-1/2 sm:w-auto shadow-sm font-semibold">
                    <option value="1" ${semester == '1' ? 'selected' : ''}>Semester 1</option>
                    <option value="2" ${semester == '2' ? 'selected' : ''}>Semester 2</option>
                </select>
            </div>

            <div class="flex gap-2 w-full md:w-auto">
                <button onclick="navigate('pendaftaran')" class="flex-1 md:flex-none bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex justify-center items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Baru
                </button>
                <button onclick="exportExcelPendaftar()" class="flex-1 md:flex-none bg-white border border-gray-200 hover:border-gray-900 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex justify-center items-center gap-1.5">Excel</button>
                <button onclick="window.print()" class="flex-1 md:flex-none bg-white border border-gray-200 hover:border-gray-900 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition flex justify-center items-center gap-1.5">Cetak</button>
            </div>
        </div>

        <div class="bg-white p-0 sm:p-6 rounded-2xl shadow-sm border border-gray-100 print-container overflow-hidden">
            <h1 class="print-only text-2xl font-bold text-center mt-4 mb-2">Data Pendaftar Sertifikasi Al-Qur'an</h1>
            <h3 class="print-only text-md text-center mb-6">Tahun Ajaran ${tahunAjaran} - Semester ${semester}</h3>
            <div class="overflow-x-auto hide-scrollbar">
                <table class="w-full text-left border-collapse border-t border-gray-100">
                    <thead class="bg-gray-50 print:bg-gray-200">
                        <tr>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b">No</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-b">Nama Lengkap</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b">Kelas</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b">Tgl Lahir</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-r border-b">Umur</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-r border-b">Pengampu</th>
                            <th class="px-4 py-3.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center border-b no-print">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${trs}
                    </tbody>
                </table>
            </div>
        </div>
    `);
}
