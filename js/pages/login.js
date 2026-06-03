// =========================================================================
// js/pages/login.js
// Halaman Login
// =========================================================================

function viewLogin() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 24px 24px;"></div>

            <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-gray-100">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm transform rotate-3">
                        <svg class="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <h1 class="text-2xl font-black text-gray-900 leading-tight tracking-tight">Sertifikasi Al-Qur'an</h1>
                    <p class="text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px] sm:text-xs mt-2">SDIT Arkan Cendekia</p>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Username Penguji</label>
                        <input type="text" id="username" class="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition text-sm outline-none font-medium" placeholder="Masukkan username">
                    </div>
                    <div>
                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                        <input type="password" id="password" class="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition text-sm outline-none font-medium" placeholder="Masukkan password"
                            onkeydown="if(event.key==='Enter') login('admin')">
                    </div>
                    <div id="loginError" class="text-red-500 text-xs font-bold hidden text-center bg-red-50 py-3 rounded-lg px-3 border border-red-100"></div>

                    <button id="btnLogin" onclick="login('admin')" class="w-full bg-gray-900 text-white py-3.5 mt-2 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-300 active:scale-95 border border-gray-900 tracking-wide">Masuk Dashboard</button>
                </div>

                <div class="mt-8 flex items-center justify-center">
                    <div class="border-t border-gray-200 flex-grow"></div>
                    <span class="px-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Atau</span>
                    <div class="border-t border-gray-200 flex-grow"></div>
                </div>

                <button onclick="login('pengunjung')" class="mt-6 w-full bg-white text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition border-2 border-gray-200 active:scale-95 flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Cari Hasil Anak
                </button>
            </div>
        </div>
    `;
}
