// =========================================================================
// js/api.js
// Database & API Supabase: Semua operasi CRUD ke Supabase
// =========================================================================

// PENTING! MASUKKAN CREDENTIALS SUPABASE ANDA DI BAWAH INI
const SUPABASE_URL = 'https://eypymzelfwyeqsgjurcg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5cHltemVsZnd5ZXFzZ2p1cmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTEzMDAsImV4cCI6MjA5MzEyNzMwMH0.Sa-hAA6OoluJBNwP2qc7Wb6Qfv58Mh8IIin1FwSCzII';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- OBJEK SERVER: Semua fungsi komunikasi dengan Supabase ---
const server = {
    init: async () => {
        if (SUPABASE_URL.includes('ISI_DENGAN_PROJECT_URL')) {
            showToast("Tolong konfigurasikan SUPABASE_URL di js/api.js terlebih dahulu.", "error");
            return;
        }

        app.innerHTML = '<div class="h-screen flex flex-col items-center justify-center p-6 text-center"><div class="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4"></div><div class="text-lg font-bold text-gray-900 mb-1">Memuat Data...</div><div class="text-xs text-gray-400">Menghubungkan ke database...</div></div>';

        try {
            const { data: dataSertif, error: errSertif } = await supabaseClient.from('sertifikasi').select('*').order('tanggal', { ascending: false });
            if (errSertif) throw errSertif;

            const { data: dataPenguji, error: errPenguji } = await supabaseClient.from('penguji').select('nama');
            if (errPenguji) throw errPenguji;

            state.db = (dataSertif || []).map(d => ({
                id: d.id,
                nama: d.nama,
                kelas: d.kelas,
                tahunAjaran: d.tahun_ajaran,
                semester: d.semester,
                juz: d.juz,
                rataRata: d.rata_rata,
                keterangan: d.keterangan,
                nilai: d.nilai || {},
                tanggal: d.tanggal,
                catatan: d.catatan,
                penguji: d.penguji,
                tanggalLahir: d.tanggal_lahir,
                umur: d.umur,
                citaCita: d.cita_cita,
                namaAyah: d.nama_ayah,
                namaIbu: d.nama_ibu,
                pengampu: d.pengampu
            }));

            state.pengujiList = dataPenguji ? dataPenguji.map(p => p.nama) : [];
            render();
        } catch (error) {
            showToast("Gagal memuat data. Error: " + error.message, "error");
            render();
        }
    },

    login: async (username, password) => {
        const btn = document.getElementById('btnLogin');
        const err = document.getElementById('loginError');
        err.classList.add('hidden');

        btn.innerText = 'Memeriksa...';
        btn.disabled = true;
        btn.classList.add('opacity-70');

        try {
            const { data, error } = await supabaseClient
                .from('penguji')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .single();

            btn.innerText = 'Masuk Dashboard';
            btn.disabled = false;
            btn.classList.remove('opacity-70');

            if (data) {
                state.role = data.role;
                state.namaPenguji = data.nama;
                state.username = data.username;

                const session = { role: state.role, nama: state.namaPenguji, username: state.username, lastView: 'dashboard' };
                localStorage.setItem('userSession_Arkan', JSON.stringify(session));

                navigate('dashboard');
                showToast(`Ahlan wa sahlan, ${state.namaPenguji}!`);
            } else {
                err.innerText = "Username atau password salah!";
                err.classList.remove('hidden');
            }
        } catch (error) {
            btn.innerText = 'Masuk Dashboard';
            btn.disabled = false;
            btn.classList.remove('opacity-70');
            err.innerText = "Error Jaringan Supabase: " + error.message;
            err.classList.remove('hidden');
        }
    },

    updateProfil: async (oldPassword, newPassword, newNama) => {
        const btn = document.getElementById('btnUpdateProfil');
        const err = document.getElementById('profilError');
        err.classList.add('hidden');

        btn.innerText = 'Menyimpan...';
        btn.disabled = true;

        try {
            const { data: checkData } = await supabaseClient
                .from('penguji')
                .select('*')
                .eq('username', state.username)
                .eq('password', oldPassword)
                .single();

            if (!checkData) {
                throw new Error("Password saat ini (lama) tidak cocok!");
            }

            const updatePayload = { nama: newNama };
            if (newPassword && newPassword.trim() !== '') {
                updatePayload.password = newPassword;
            }

            const { error } = await supabaseClient
                .from('penguji')
                .update(updatePayload)
                .eq('username', state.username);

            if (error) throw error;

            showToast("Profil diperbarui. Silakan login kembali.");
            logout();
        } catch (error) {
            err.innerText = error.message;
            err.classList.remove('hidden');
            btn.innerText = 'Simpan Perubahan';
            btn.disabled = false;
        }
    },

    saveData: async (payload, viewToNavigate) => {
        app.innerHTML = '<div class="h-screen flex flex-col items-center justify-center p-6 text-center"><div class="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mb-4"></div><div class="text-lg font-bold text-gray-900">Menyimpan Data...</div></div>';
        try {
            let insertPayload = { ...payload };
            if (!insertPayload.id) delete insertPayload.id;

            const { error } = await supabaseClient
                .from('sertifikasi')
                .upsert(insertPayload)
                .select();

            if (error) throw error;

            localStorage.removeItem('draftPenilaian_Arkan');
            showToast("Data berhasil disimpan!");

            await server.init();
            if (state.view !== 'laporan' && state.view !== 'dataPendaftar') navigate(viewToNavigate);
            else navigate(state.view);
        } catch (error) {
            showToast("Gagal menyimpan data! Error: " + error.message, "error");
            navigate(viewToNavigate || 'dashboard');
        }
    },

    deleteData: async (id, sourceView = 'laporan') => {
        app.innerHTML = '<div class="h-screen flex flex-col items-center justify-center p-6 text-center"><div class="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div><div class="text-lg font-bold text-red-600">Menghapus Data...</div></div>';
        try {
            const { error } = await supabaseClient
                .from('sertifikasi')
                .delete()
                .eq('id', id);

            if (error) throw error;

            showToast("Data berhasil dihapus.", "success");
            await server.init();
            navigate(sourceView);
        } catch (error) {
            showToast("Gagal menghapus data! Error: " + error.message, "error");
            navigate(sourceView);
        }
    }
};
