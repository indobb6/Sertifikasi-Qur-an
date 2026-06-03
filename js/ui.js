// =========================================================================
// js/ui.js
// Komponen Tampilan Utama: Navbar dan Notifikasi (Toast/Dialog)
// =========================================================================

// --- CUSTOM TOAST NOTIFICATION ---
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3.5 rounded-xl font-bold shadow-2xl z-[100] transition-all duration-300 -translate-y-24 opacity-0 flex items-center gap-3 w-[90%] max-w-sm ${type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white border border-gray-700'}`;

    const icon = type === 'error'
        ? '<svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
        : '<svg class="w-6 h-6 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    toast.innerHTML = `${icon} <span class="text-sm tracking-wide leading-tight">${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => { toast.classList.remove('-translate-y-24', 'opacity-0'); }, 10);
    setTimeout(() => {
        toast.classList.add('-translate-y-24', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// --- CUSTOM CONFIRM DIALOG ---
function showConfirmDialog(title, message, onConfirm) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity opacity-0';
    dialog.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-95 transition-transform duration-300">
            <div class="p-6">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-sm text-gray-500">${message}</p>
            </div>
            <div class="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
                <button id="btnCancelDialog" class="px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition">Batal</button>
                <button id="btnConfirmDialog" class="px-4 py-2 bg-red-600 rounded-xl text-sm font-bold text-white hover:bg-red-700 transition shadow-sm">Ya, Hapus</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);

    setTimeout(() => {
        dialog.classList.remove('opacity-0');
        dialog.querySelector('div').classList.remove('scale-95');
    }, 10);

    const closeDialog = () => {
        dialog.classList.add('opacity-0');
        dialog.querySelector('div').classList.add('scale-95');
        setTimeout(() => dialog.remove(), 300);
    };

    document.getElementById('btnCancelDialog').onclick = closeDialog;
    document.getElementById('btnConfirmDialog').onclick = () => {
        closeDialog();
        onConfirm();
    };
}

// --- NAVBAR / LAYOUT UTAMA ---
function renderLayout(content) {
    const isAdminOrPenguji = state.role === 'admin' || state.role === 'penguji';

    return `
        <div class="min-h-screen flex flex-col bg-gray-50 print:bg-white">
            <header class="bg-gray-900 text-white shadow-md sticky top-0 z-40 pt-[env(safe-area-inset-top)] no-print">
                <div class="max-w-7xl mx-auto px-4 sm:px-6">
                    <div class="flex justify-between items-center h-14 sm:h-16">
                        <div class="flex items-center gap-3">
                            <div>
                                <h1 class="font-bold text-base sm:text-xl leading-tight tracking-tight">Sertifikasi Al-Qur'an</h1>
                                <p class="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold">SDIT Arkan Cendekia</p>
                            </div>
                            <div class="hidden md:flex ml-8 space-x-1 lg:space-x-2">
                                <button onclick="navigate('dashboard')" class="px-2.5 py-2 rounded-lg text-sm font-medium ${state.view === 'dashboard' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 transition'}">${isAdminOrPenguji ? 'Dashboard' : 'Cek Hasil'}</button>
                                ${isAdminOrPenguji ? `
                                <button onclick="navigate('pendaftaran')" class="px-2.5 py-2 rounded-lg text-sm font-medium ${state.view === 'pendaftaran' || state.view === 'dataPendaftar' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 transition'}">Pendaftaran</button>
                                <button onclick="navigate('penilaian')" class="px-2.5 py-2 rounded-lg text-sm font-medium ${state.view === 'penilaian' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 transition'}">Penilaian</button>
                                <button onclick="navigate('laporan')" class="px-2.5 py-2 rounded-lg text-sm font-medium ${state.view === 'laporan' ? 'bg-gray-700 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 transition'}">Hasil Sertifikasi</button>
                                <button onclick="navigate('haflah')" class="px-2.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${state.view === 'haflah' ? 'bg-indigo-600 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 transition'}">
                                    <svg class="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> Haflah
                                </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="flex items-center gap-2 sm:gap-3">
                            ${isAdminOrPenguji ? `
                            <button onclick="navigate('profil')" class="text-gray-300 hover:text-white p-1.5 sm:p-2 rounded-xl transition hover:bg-gray-800" title="Pengaturan Akun">
                                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </button>
                            ` : ''}
                            <span class="hidden sm:block text-[10px] sm:text-xs bg-gray-800 px-3 py-1.5 rounded-lg text-gray-300 font-bold border border-gray-700 tracking-widest uppercase">${state.role}</span>
                            <button onclick="logout()" class="text-xs sm:text-sm bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg font-bold transition shadow-sm text-white border border-red-500">Keluar</button>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 pb-24 md:pb-8 print:p-0 print:m-0">
                ${content}
            </main>

            <!-- pb-[env...] menjaga navbar agar tidak terpotong oleh home indicator di iPhone -->
            <nav class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] no-print">
                <div class="flex justify-around items-center h-[72px] pb-1 px-1">
                    <button onclick="navigate('dashboard')" class="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full ${state.view === 'dashboard' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" fill="${state.view === 'dashboard' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span class="text-[10px] font-bold tracking-wide leading-none">${isAdminOrPenguji ? 'Beranda' : 'Cek Hasil'}</span>
                    </button>

                    ${isAdminOrPenguji ? `
                    <button onclick="navigate('pendaftaran')" class="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full relative ${state.view === 'pendaftaran' || state.view === 'dataPendaftar' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" fill="${state.view === 'pendaftaran' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        <span class="text-[10px] font-bold tracking-wide leading-none">Daftar</span>
                    </button>
                    <button onclick="navigate('penilaian')" class="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full relative ${state.view === 'penilaian' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" fill="${state.view === 'penilaian' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        <span class="text-[10px] font-bold tracking-wide leading-none">Input</span>
                    </button>
                    <button onclick="navigate('laporan')" class="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full ${state.view === 'laporan' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" fill="${state.view === 'laporan' ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span class="text-[10px] font-bold tracking-wide leading-none">Hasil</span>
                    </button>
                    <button onclick="navigate('haflah')" class="flex-1 flex flex-col items-center justify-center gap-1 w-full h-full relative ${state.view === 'haflah' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        <span class="text-[10px] font-bold tracking-wide leading-none">Haflah</span>
                    </button>
                    ` : ''}
                </div>
            </nav>
        </div>
    `;
}
