// =========================================================================
// js/pages/penilaian.js
// Halaman Input Nilai Hafalan
// =========================================================================

function viewPenilaian() {
    if (state.role !== 'admin' && state.role !== 'penguji') {
        return renderLayout(`<div class="text-center py-20 text-red-500 font-bold">Akses Ditolak.</div>`);
    }

    const fromDraft = !state.currentStudent && localStorage.getItem('draftPenilaian_Arkan');
    let data;

    if (state.currentStudent) {
        data = state.currentStudent;
    } else if (fromDraft) {
        data = JSON.parse(localStorage.getItem('draftPenilaian_Arkan'));
    } else {
        data = { id: '', nama: '', kelas: '', tahunAjaran: tahunAjaranList[0], semester: '1', juz: '30', nilai: {}, rataRata: 0, keterangan: '', catatan: '' };
    }

    const isEdit = data.id !== '';

    if (isEdit && state.role === 'penguji' && data.penguji && data.penguji !== state.namaPenguji) {
        return renderLayout(`
            <div class="bg-white rounded-2xl shadow-sm p-8 text-center max-w-lg mx-auto mt-10 border border-gray-100">
                <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500 border border-red-100 transform rotate-3">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Akses Ditolak</h3>
                <p class="text-gray-500 text-sm mb-6">Data ini dikunci karena diinput oleh penguji lain. Anda hanya dapat mengedit data peserta Anda sendiri.</p>
                <button onclick="resetFormPenilaian()" class="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-sm transition inline-flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
                    Kembali / Cari Peserta Lain
                </button>
            </div>
        `);
    }

    let optionsTahun = tahunAjaranList.map(t => `<option value="${t}" ${data.tahunAjaran === t ? 'selected' : ''}>${t}</option>`).join('');

    return renderLayout(`
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">${isEdit ? (fromDraft ? 'Melanjutkan Input (Draft)' : 'Edit Nilai Hafalan') : 'Input Nilai Baru'}</h2>
            <button onclick="resetFormPenilaian()" class="w-full sm:w-auto bg-white border border-gray-200 hover:border-gray-900 hover:text-gray-900 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Bersihkan Form
            </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-8 mb-4 sm:mb-6 border border-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div class="md:col-span-2 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl relative">
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cari Data Pendaftar (Wajib)</label>
                    <div class="flex gap-2 w-full relative">
                        <input type="text" id="searchInput" onkeyup="tampilkanPreviewPencarian()" autocomplete="off" placeholder="Ketik nama yang dicari..." class="flex-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 text-sm shadow-sm outline-none font-medium">
                        <button onclick="cariSiswa()" class="flex-none w-20 sm:w-24 px-0 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-bold shadow-sm transition text-sm text-center">Cari</button>
                    </div>
                    <div id="searchDropdown" class="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl hidden max-h-48 overflow-y-auto z-50"></div>
                    <div id="searchResult" class="mt-2 text-xs font-bold text-red-500 hidden"></div>
                </div>

                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nama Lengkap (Otomatis)</label>
                    <input type="text" id="inputNama" value="${data.nama}" readonly class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Kelas (Otomatis)</label>
                    <input type="text" id="inputKelas" value="${data.kelas}" readonly class="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tahun Ajaran</label>
                    <select id="inputTahun" onchange="simpanDraft()" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-900 text-sm font-semibold outline-none">
                        ${optionsTahun}
                    </select>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Semester</label>
                    <select id="inputSemester" onchange="simpanDraft()" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-900 text-sm font-semibold outline-none">
                        <option value="1" ${data.semester == '1' ? 'selected' : ''}>Semester 1</option>
                        <option value="2" ${data.semester == '2' ? 'selected' : ''}>Semester 2</option>
                    </select>
                </div>
                <div class="md:col-span-2 mt-2">
                    <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Juz yang Diujikan</label>
                    <select id="inputJuz" onchange="generateSurahInputs()" class="w-full px-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-gray-500 text-sm font-bold text-white outline-none">
                        ${[30, 29, 28, 27, 26].map(j => `<option value="${j}" ${data.juz == j ? 'selected' : ''}>Juz ${j}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm p-5 sm:p-8 border border-gray-100 ${!data.id ? 'opacity-50 pointer-events-none' : ''}" id="areaPenilaian">
            ${!data.id ? '<div class="text-center text-xs font-bold text-red-500 mb-5 bg-red-50 py-3 rounded-lg border border-red-100 uppercase tracking-widest">Pilih nama peserta di atas terlebih dahulu!</div>' : ''}

            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 border-b border-gray-100 pb-4 gap-3">
                <h3 class="text-base font-bold text-gray-900 uppercase tracking-widest text-[11px]" id="titleSurah">Nilai Surat</h3>
                <div class="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full sm:w-auto justify-between sm:justify-end">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rata-rata:</div>
                    <div id="displayRata" class="font-black text-xl text-gray-900">${data.rataRata || 0}</div>
                    <div id="displayStatus" class="text-[10px] px-2.5 py-1 rounded font-bold ml-2 uppercase tracking-widest border ${data.keterangan === 'Lulus' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}">${data.keterangan || '-'}</div>
                </div>
            </div>

            <div id="surahContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"></div>

            <div class="mt-8 border-t border-gray-100 pt-6">
                <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Catatan Penguji</label>
                <textarea id="inputCatatan" oninput="simpanDraft()" rows="3" class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 text-sm font-medium resize-none outline-none" placeholder="Tulis catatan opsional...">${data.catatan || ''}</textarea>
            </div>

            <div class="mt-6 flex justify-end">
                <input type="hidden" id="inputId" value="${data.id}">
                <button onclick="simpanPenilaian()" class="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-gray-200 transition active:scale-95 text-sm border border-gray-800 tracking-wide">
                    ${isEdit ? 'Update Nilai' : 'Simpan Nilai'}
                </button>
            </div>
        </div>
    `);
}

function generateSurahInputs() {
    const juz = document.getElementById('inputJuz').value;
    const container = document.getElementById('surahContainer');
    if (!container) return;

    document.getElementById('titleSurah').innerText = `Surat Juz ${juz}`;
    const listSurah = surahData[juz] || [];
    let html = '';

    const savedDraft = localStorage.getItem('draftPenilaian_Arkan');
    const draftData = savedDraft ? JSON.parse(savedDraft) : null;

    let existingScores = {};
    if (state.currentStudent && state.currentStudent.juz == juz) {
        existingScores = state.currentStudent.nilai || {};
    } else if (draftData && draftData.juz == juz) {
        existingScores = draftData.nilai || {};
    }

    listSurah.forEach(surah => {
        const val = existingScores[surah] !== undefined ? existingScores[surah] : '';
        html += `
            <div class="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition bg-white group">
                <label class="text-sm font-semibold text-gray-700 w-2/3 truncate group-hover:text-gray-900 transition">${surah}</label>
                <input type="number" min="0" max="100" class="surah-input w-20 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-900 text-center font-bold text-gray-900 outline-none transition" data-surah="${surah}" value="${val}" oninput="hitungRataRata(); simpanDraft()" placeholder="0">
            </div>
        `;
    });
    container.innerHTML = html;
    hitungRataRata();

    if (state.view === 'penilaian') simpanDraft();
}

function hitungRataRata() {
    const inputs = document.querySelectorAll('.surah-input');
    let total = 0; let count = 0; let hasDiBawah78 = false;

    inputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) {
            total += val; count++;
            if (val < 78) hasDiBawah78 = true;
        }
    });

    const rata = inputs.length > 0 ? Math.round(total / inputs.length) : 0;
    let status = ''; let statusBg = ''; let statusText = '';

    if (rata < 80) {
        status = 'Belum Lulus'; statusBg = 'bg-red-50 border-red-200'; statusText = 'text-red-700';
    } else if (rata >= 80 && hasDiBawah78) {
        status = 'Remedial'; statusBg = 'bg-amber-50 border-amber-200'; statusText = 'text-amber-700';
    } else {
        status = 'Lulus'; statusBg = 'bg-emerald-50 border-emerald-200'; statusText = 'text-emerald-700';
    }

    const elRata = document.getElementById('displayRata');
    if (elRata) {
        elRata.innerText = rata;
        const elStatus = document.getElementById('displayStatus');
        elStatus.innerText = rata > 0 ? status : '-';
        elStatus.className = `text-[10px] px-2.5 py-1 rounded font-bold ml-2 uppercase tracking-widest border ${rata > 0 ? statusBg + ' ' + statusText : 'bg-gray-100 text-gray-500 border-gray-200'}`;
    }
    return { rata, status };
}

function simpanPenilaian() {
    const id = document.getElementById('inputId').value;
    if (!id) return showToast('Pilih peserta terlebih dahulu!', 'error');

    const existingData = state.db.find(d => d.id === id) || {};
    const inputs = document.querySelectorAll('.surah-input');
    let nilai = {};
    inputs.forEach(input => {
        const surah = input.getAttribute('data-surah');
        nilai[surah] = input.value === '' ? 0 : parseFloat(input.value);
    });

    const hasil = hitungRataRata();

    const payload = {
        id: id,
        nama: existingData.nama,
        kelas: existingData.kelas,
        tanggal_lahir: existingData.tanggalLahir || existingData.tanggal_lahir,
        umur: existingData.umur,
        cita_cita: existingData.citaCita || existingData.cita_cita,
        nama_ayah: existingData.namaAyah || existingData.nama_ayah,
        nama_ibu: existingData.namaIbu || existingData.nama_ibu,
        pengampu: existingData.pengampu,
        tahun_ajaran: document.getElementById('inputTahun').value,
        semester: document.getElementById('inputSemester').value,
        juz: document.getElementById('inputJuz').value,
        nilai: nilai,
        rata_rata: hasil.rata,
        keterangan: hasil.status,
        catatan: document.getElementById('inputCatatan').value.trim(),
        penguji: existingData.penguji ? existingData.penguji : (state.namaPenguji || 'Penguji'),
        tanggal: new Date().toISOString()
    };

    server.saveData(payload, 'laporan');
}

function simpanDraft() {
    if (state.view !== 'penilaian') return;
    const inputJuzEl = document.getElementById('inputJuz');
    if (!inputJuzEl) return;

    const inputs = document.querySelectorAll('.surah-input');
    let nilai = {};
    inputs.forEach(input => {
        const surah = input.getAttribute('data-surah');
        nilai[surah] = input.value === '' ? '' : parseFloat(input.value);
    });

    const draft = {
        id: document.getElementById('inputId')?.value || '',
        nama: document.getElementById('inputNama')?.value || '',
        kelas: document.getElementById('inputKelas')?.value || kelasList[0],
        tahunAjaran: document.getElementById('inputTahun')?.value || '',
        semester: document.getElementById('inputSemester')?.value || '1',
        juz: inputJuzEl.value || '30',
        catatan: document.getElementById('inputCatatan')?.value || '',
        nilai: nilai
    };
    localStorage.setItem('draftPenilaian_Arkan', JSON.stringify(draft));
}

function resetFormPenilaian() {
    state.currentStudent = null;
    localStorage.removeItem('draftPenilaian_Arkan');
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    if (document.getElementById('inputNama')) document.getElementById('inputNama').value = '';
    if (document.getElementById('inputKelas')) document.getElementById('inputKelas').value = '';
    if (document.getElementById('inputCatatan')) document.getElementById('inputCatatan').value = '';
    if (document.getElementById('inputId')) document.getElementById('inputId').value = '';
    document.querySelectorAll('.surah-input').forEach(el => el.value = '');
    navigate('penilaian');
}

function tampilkanPreviewPencarian() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();
    const dropdown = document.getElementById('searchDropdown');
    const resEl = document.getElementById('searchResult');
    resEl.classList.add('hidden');

    if (!input) { dropdown.classList.add('hidden'); return; }

    const matches = state.db.filter(d => String(d.nama || '').toLowerCase().includes(input));

    if (matches.length > 0) {
        let html = '';
        matches.forEach(m => {
            const statusText = m.keterangan ? m.keterangan : 'Belum Dinilai';
            const warnaStatus = statusText === 'Lulus' ? 'text-emerald-600' : statusText === 'Remedial' ? 'text-amber-600' : statusText === 'Belum Lulus' ? 'text-red-500' : 'text-gray-500';
            html += `
                <div onclick="pilihSiswaEdit('${m.id}')" class="px-5 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition">
                    <div class="font-bold text-gray-900 text-sm">${m.nama}</div>
                    <div class="text-[11px] text-gray-500 mt-1 font-medium">
                        ${m.kelas} &bull; Juz ${m.juz} &bull; <span class="${warnaStatus} font-bold">${statusText}</span>
                    </div>
                </div>
            `;
        });
        dropdown.innerHTML = html;
        dropdown.classList.remove('hidden');
    } else {
        dropdown.innerHTML = `<div class="px-5 py-4 text-xs text-gray-500 font-medium">Tidak menemukan peserta...</div>`;
        dropdown.classList.remove('hidden');
    }
}

function pilihSiswaEdit(id) {
    const found = state.db.find(d => d.id === id);
    if (found) {
        if (state.role === 'penguji' && found.penguji && found.penguji !== state.namaPenguji) {
            showToast('Akses Ditolak: Anda tidak dapat mengedit data yang diinput oleh penguji lain.', 'error');
            return;
        }
        document.getElementById('searchDropdown').classList.add('hidden');
        document.getElementById('searchInput').value = '';
        navigate('penilaian', found);
    }
}

function cariSiswa() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    if (!q) return;
    document.getElementById('searchDropdown').classList.add('hidden');
    const found = state.db.find(d => String(d.nama || '').toLowerCase().includes(q));
    const resEl = document.getElementById('searchResult');
    if (found) {
        if (state.role === 'penguji' && found.penguji && found.penguji !== state.namaPenguji) {
            showToast('Akses Ditolak: Anda tidak dapat mengedit data yang diinput oleh penguji lain.', 'error');
            return;
        }
        resEl.classList.add('hidden');
        document.getElementById('searchInput').value = '';
        navigate('penilaian', found);
    } else {
        resEl.innerText = "Data tidak ditemukan. Pastikan ejaan sesuai.";
        resEl.classList.remove('hidden');
    }
}
