// =========================================================================
// js/pages/profil.js
// Halaman Pengaturan Akun / Profil Penguji
// =========================================================================

function viewProfil() {
    if (state.role !== 'admin' && state.role !== 'penguji') {
        return renderLayout(`<div class="text-center py-20 text-red-500 font-bold">Akses Ditolak.</div>`);
    }

    return renderLayout(`
        <div class="max-w-xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100 mt-2 sm:mt-6">
            <div class="flex items-center gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-100">
                <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                    <h2 class="text-lg sm:text-xl font-bold text-gray-800">Pengaturan Akun</h2>
                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Ubah nama tampilan dan password Anda.</p>
                </div>
            </div>

            <div class="space-y-4 sm:space-y-5">
                <div>
                    <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Username Login (Tetap)</label>
                    <input type="text" value="${state.username || '-'}" disabled class="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Nama Tampilan (Di Laporan)</label>
                    <input type="text" id="profilNama" value="${state.namaPenguji}" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium">
                </div>
                <div class="pt-4 border-t border-gray-100">
                    <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Password Lama <span class="text-red-500">*</span></label>
                    <input type="password" id="profilOldPass" placeholder="Masukkan password saat ini untuk verifikasi" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Password Baru</label>
                    <input type="password" id="profilNewPass" placeholder="Biarkan kosong jika tidak ingin ganti sandi" class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm">
                </div>

                <div id="profilError" class="text-red-600 text-xs font-bold hidden text-center bg-red-50 py-3 rounded-lg px-3 border border-red-100 mt-2"></div>

                <div class="pt-4 flex gap-3 justify-end">
                    <button onclick="navigate('dashboard')" class="px-4 sm:px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition w-1/3 sm:w-auto text-center">Batal</button>
                    <button id="btnUpdateProfil" onclick="submitProfil()" class="px-5 sm:px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-black transition w-2/3 sm:w-auto text-center">Simpan Perubahan</button>
                </div>
            </div>
        </div>
    `);
}

function submitProfil() {
    const oldPass = document.getElementById('profilOldPass').value.trim();
    const newPass = document.getElementById('profilNewPass').value.trim();
    const newNama = document.getElementById('profilNama').value.trim();
    const err = document.getElementById('profilError');

    if (!oldPass) {
        err.innerText = "Password Lama wajib diisi untuk verifikasi keamanan!";
        err.classList.remove('hidden');
        return;
    }
    if (!newNama) {
        err.innerText = "Nama tampilan tidak boleh kosong!";
        err.classList.remove('hidden');
        return;
    }

    server.updateProfil(oldPass, newPass, newNama);
}
