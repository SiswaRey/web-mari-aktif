let lombaData = [];
let editingId = null;

// Inisialisasi data contoh
function initData() {
    lombaData = [
        {
            id: 1,
            nama: 'Olimpiade Matematika Nasional',
            deskripsi: 'Kompetisi matematika tingkat nasional untuk siswa SMA/SMK',
            penyelenggara: 'Universitas Indonesia',
            lokasi: 'Jakarta (Online)',
            tanggalExpired: '2025-11-14',
            kategori: 'Matematika',
            hadiah: 'Piala, Sertifikat, Uang Pembinaan Rp 10.000.000',
            persyaratan: 'Siswa SMA/SMK sederajat, Melampirkan kartu pelajar',
            linkKontak: 'https://wa.me/628123456789',
            linkPendaftaran: 'https://olimpiade.ui.ac.id/daftar'
        },
        {
            id: 2,
            nama: 'Kompetisi Fisika Tingkat Nasional',
            deskripsi: 'Ajang kompetisi fisika untuk pelajar berbakat',
            penyelenggara: 'Kementerian Pendidikan',
            lokasi: 'Jawa Barat (Di Kampus)',
            tanggalExpired: '2025-11-13',
            kategori: 'Fisika',
            hadiah: 'Medali Emas, Sertifikat, Beasiswa',
            persyaratan: 'Siswa SMA kelas 10-12, Rekomendasi sekolah',
            linkKontak: 'https://wa.me/628987654321',
            linkPendaftaran: 'https://fisika.kemdikbud.go.id'
        }
    ];
    renderLomba();
}

function renderLomba() {
    const grid = document.getElementById('lombaGrid');
    const today = new Date().toISOString().split('T')[0];
    
    grid.innerHTML = lombaData.map(lomba => {
        const isExpired = lomba.tanggalExpired < today;
        const statusBadge = isExpired 
            ? '<div class="expired-badge">EXPIRED</div>'
            : '<div class="active-badge">AKTIF</div>';
        
        return `
            <div class="lomba-card">
                ${statusBadge}
                <div class="lomba-kategori">${lomba.kategori}</div>
                <h3>${lomba.nama}</h3>
                <p>${lomba.deskripsi}</p>
                
                <div class="lomba-info">
                    <div class="lomba-info-item">
                        <strong>Penyelenggara:</strong>
                        <span>${lomba.penyelenggara}</span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Lokasi:</strong>
                        <span>${lomba.lokasi}</span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Expired:</strong>
                        <span>${formatDate(lomba.tanggalExpired)}</span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Hadiah:</strong>
                        <span>${lomba.hadiah}</span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Persyaratan:</strong>
                        <span>${lomba.persyaratan}</span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Link Kontak:</strong>
                        <span><a href="${lomba.linkKontak}" target="_blank">Hubungi</a></span>
                    </div>
                    <div class="lomba-info-item">
                        <strong>Pendaftaran:</strong>
                        <span><a href="${lomba.linkPendaftaran}" target="_blank">Daftar</a></span>
                    </div>
                </div>

                <div class="lomba-actions">
                    <button class="btn btn-edit" onclick="editLomba(${lomba.id})">✏️ Edit</button>
                    <button class="btn btn-delete" onclick="deleteLomba(${lomba.id})">🗑️ Hapus</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('totalLomba').textContent = lombaData.length;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function openModal() {
    editingId = null;
    document.getElementById('lombaForm').reset();
    document.getElementById('modalTitle').textContent = 'Tambah Lomba Baru';
    document.getElementById('lombaModal').classList.add('active');
}

function closeModal() {
    document.getElementById('lombaModal').classList.remove('active');
    editingId = null;
}

function editLomba(id) {
    const lomba = lombaData.find(l => l.id === id);
    if (!lomba) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Lomba';
    
    const form = document.getElementById('lombaForm');
    form.nama.value = lomba.nama;
    form.deskripsi.value = lomba.deskripsi;
    form.penyelenggara.value = lomba.penyelenggara;
    form.lokasi.value = lomba.lokasi;
    form.tanggalExpired.value = lomba.tanggalExpired;
    form.kategori.value = lomba.kategori;
    form.hadiah.value = lomba.hadiah;
    form.persyaratan.value = lomba.persyaratan;
    form.linkKontak.value = lomba.linkKontak;
    form.linkPendaftaran.value = lomba.linkPendaftaran;

    document.getElementById('lombaModal').classList.add('active');
}

function deleteLomba(id) {
    if (confirm('Apakah Anda yakin ingin menghapus lomba ini?')) {
        lombaData = lombaData.filter(l => l.id !== id);
        renderLomba();
    }
}

document.getElementById('lombaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (editingId) {
        const index = lombaData.findIndex(l => l.id === editingId);
        lombaData[index] = { ...data, id: editingId };
    } else {
        data.id = Date.now();
        lombaData.push(data);
    }

    renderLomba();
    closeModal();
});

// Inisialisasi saat halaman dimuat
initData();