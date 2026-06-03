// =========================================================================
// js/app.js
// Router & App Init: Otak dari SPA, mengatur lalu lintas halaman
// =========================================================================

const app = document.getElementById('app');

// --- HELPER FUNCTIONS ---

function formatDateToYYYYMMDD(dateObjOrString) {
    if (!dateObjOrString) return "";
    try {
        if (typeof dateObjOrString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateObjOrString.trim())) {
            return dateObjOrString.trim();
        }
        const d = new Date(dateObjOrString);
        if (isNaN(d.getTime())) return dateObjOrString.toString().trim();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        return dateObjOrString ? dateObjOrString.toString().trim() : "";
    }
}

function getCurrentPeriod() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    if (month >= 6) {
        return { semester: '1', tahunAjaran: `${year}/${year + 1}` };
    } else {
        return { semester: '2', tahunAjaran: `${year - 1}/${year}` };
    }
}

// --- NAVIGASI ---

function navigate(view, data = null) {
    state.view = view;

    if (data !== null) {
        state.currentStudent = data;
    } else if (view !== 'penilaian' && view !== 'pendaftaran') {
        state.currentStudent = null;
    }

    // Simpan posisi layar terakhir untuk auto-resume saat direfresh
    if (state.role) {
        const session = JSON.parse(localStorage.getItem('userSession_Arkan') || '{}');
        session.lastView = view;
        localStorage.setItem('userSession_Arkan', JSON.stringify(session));
    }

    render();
    window.scrollTo(0, 0);
}

// --- AUTH ---

function login(role) {
    if (role === 'admin') {
        const user = document.getElementById('username').value.trim();
        const pass = document.getElementById('password').value.trim();
        const err = document.getElementById('loginError');

        if (!user || !pass) {
            err.innerText = "Username dan password tidak boleh kosong!";
            err.classList.remove('hidden');
            return;
        }
        server.login(user, pass);
    } else {
        state.role = 'pengunjung';
        state.namaPenguji = 'Pengunjung';
        state.username = null;
        localStorage.setItem('userSession_Arkan', JSON.stringify({ role: state.role, nama: state.namaPenguji, lastView: 'dashboard' }));
        navigate('dashboard');
        showToast("Berhasil masuk sebagai pengunjung.");
    }
}

function logout() {
    state.role = null;
    state.namaPenguji = null;
    state.username = null;
    localStorage.removeItem('userSession_Arkan');
    navigate('login');
}

// --- FUNGSI FILTER GLOBAL ---

function updateFilterCetak() {
    state.filterCetak = {
        tahunAjaran: document.getElementById('printFilterTahun').value,
        semester: document.getElementById('printFilterSemester').value
    };
    render();
}

function updateFilterHaflah() {
    state.filterHaflah = document.getElementById('filterTahunHaflah').value;
    render();
}

// --- RENDER / ROUTER UTAMA ---

function render() {
    let html = '';
    if (state.role === 'pengunjung' && state.view !== 'login' && state.view !== 'cetak') {
        html = viewDashboardPengunjung();
    } else {
        switch (state.view) {
            case 'login':        html = viewLogin();          break;
            case 'dashboard':    html = viewDashboard();      break;
            case 'pendaftaran':  html = viewPendaftaran();    break;
            case 'dataPendaftar':html = viewDataPendaftar();  break;
            case 'penilaian':    html = viewPenilaian();      break;
            case 'laporan':      html = viewLaporan();        break;
            case 'haflah':       html = viewHaflah();         break;
            case 'cetak':        html = viewCetak();          break;
            case 'cetakSemua':   html = viewCetakSemua();     break;
            case 'profil':       html = viewProfil();         break;
            default:             html = viewLogin();
        }
    }
    app.innerHTML = html;

    if (state.view === 'penilaian') generateSurahInputs();
    if (state.view === 'dashboard' && state.role !== 'pengunjung') initDashboardChart();
    if (state.view === 'laporan' && state.searchLaporan) filterLaporanDOM();
}

// --- CHART DASHBOARD ---

function initDashboardChart() {
    const ctx = document.getElementById('kelulusanChart');
    if (!ctx) return;

    const period = getCurrentPeriod();
    const currentDb = state.db.filter(d => d.tahunAjaran === period.tahunAjaran && d.semester === period.semester);
    const lulus = currentDb.filter(d => d.keterangan === 'Lulus').length;
    const remedial = currentDb.filter(d => d.keterangan === 'Remedial').length;
    const belumLulus = currentDb.filter(d => d.keterangan === 'Belum Lulus').length;

    if (window.myDashboardChart) {
        window.myDashboardChart.destroy();
    }

    window.myDashboardChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Lulus', 'Remedial', 'Belum Lulus'],
            datasets: [{
                data: [lulus, remedial, belumLulus],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { bodyFont: { family: 'Inter' } }
            }
        }
    });
}

// --- INISIALISASI APLIKASI ---
server.init();
