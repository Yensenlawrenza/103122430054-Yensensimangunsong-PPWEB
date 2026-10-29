import { useState } from "react";
import RingkasanPeserta from "./components/RingkasanPeserta.jsx";
import FormPeserta from "./components/FormPeserta.jsx";
import FilterPeserta from "./components/FilterPeserta.jsx";
import DaftarPeserta from "./components/DaftarPeserta.jsx";

const DATA_AWAL = [
  { id: "m-1", nama: "Yensen", nim: "12345678", kelas: "SE-08-02", hadir: true },
  { id: "m-2", nama: "Cia", nim: "87654321", kelas: "SE-08-01", hadir: false },
  { id: "m-3", nama: "Given", nim: "13246578", kelas: "SE-08-02", hadir: false },
];

const FORM_KOSONG = { nama: "", nim: "", kelas: "" };
const KELAS_VALID = ["SE-08-01", "SE-08-02"];

function App() {
  const [peserta, setPeserta] = useState(DATA_AWAL);
  const [nextId, setNextId] = useState(4);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editId, setEditId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [filterKelas, setFilterKelas] = useState("semua");
  const [galat, setGalat] = useState({});
  const [pesan, setPesan] = useState("");

  // ---------- Data turunan ----------
  const kataCari = keyword.trim().toLowerCase();
  const hasil = peserta.filter((p) => {
    const cocokCari =
      kataCari === "" ||
      p.nama.toLowerCase().includes(kataCari) ||
      p.nim.toLowerCase().includes(kataCari);
    const cocokKelas = filterKelas === "semua" || p.kelas === filterKelas;
    return cocokCari && cocokKelas;
  });

  // ---------- Form ----------
  function resetForm() {
    setForm(FORM_KOSONG);
    setEditId(null);
    setGalat({});
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((lama) => ({ ...lama, [name]: value }));
    setGalat((lama) => ({ ...lama, [name]: undefined }));
  }

  function validasi(nama, nim, kelas) {
    const hasilGalat = {};
    if (nama === "") {
      hasilGalat.nama = "Nama wajib diisi.";
    } else if (nama.length < 3) {
      hasilGalat.nama = "Nama minimal 3 karakter.";
    }
    if (nim === "") {
      hasilGalat.nim = "NIM wajib diisi.";
    } else if (!/^\d{8}$/.test(nim)) {
      hasilGalat.nim = "NIM harus terdiri atas tepat 8 digit angka.";
    } else if (peserta.some((p) => p.nim === nim && p.id !== editId)) {
      hasilGalat.nim = "NIM sudah digunakan peserta lain.";
    }
    if (!KELAS_VALID.includes(kelas)) {
      hasilGalat.kelas = "Kelas wajib dipilih (SE-08-01 atau SE-08-02).";
    }
    return hasilGalat;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nama = form.nama.trim();
    const nim = form.nim.trim();
    const kelas = form.kelas;

    const hasilGalat = validasi(nama, nim, kelas);
    if (Object.keys(hasilGalat).length > 0) {
      setGalat(hasilGalat);
      setPesan("");
      return; // data dan isi form tidak berubah
    }

    if (editId === null) {
      const baru = { id: `m-${nextId}`, nama, nim, kelas, hadir: false };
      setPeserta([...peserta, baru]);
      setNextId(nextId + 1);
      setPesan(`Peserta ${nama} berhasil ditambahkan.`);
    } else {
      setPeserta(
        peserta.map((p) => (p.id === editId ? { ...p, nama, nim, kelas } : p))
      );
      setPesan(`Data peserta ${nama} berhasil diperbarui.`);
    }
    resetForm();
  }

  function handleEdit(id) {
    const target = peserta.find((p) => p.id === id);
    if (!target) return;
    setEditId(id);
    setForm({ nama: target.nama, nim: target.nim, kelas: target.kelas });
    setGalat({});
    setPesan("");
  }

  function handleBatal() {
    resetForm();
    setPesan("");
  }

  // ---------- Hapus & kehadiran ----------
  function handleHapus(id) {
    setPeserta(peserta.filter((p) => p.id !== id));
    if (editId === id) {
      resetForm();
    }
    setPesan("");
  }

  function handleToggleHadir(id) {
    setPeserta(peserta.map((p) => (p.id === id ? { ...p, hadir: !p.hadir } : p)));
    setPesan("");
  }

  return (
    <main className="app">
      <h1>Manajemen Peserta Praktikum</h1>

      <RingkasanPeserta peserta={peserta} jumlahTampil={hasil.length} />

      <section className="panel">
        <FormPeserta
          form={form}
          galat={galat}
          modeEdit={editId !== null}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onBatal={handleBatal}
        />
        {pesan && (
          <p className="pesan-sukses" role="status">
            {pesan}
          </p>
        )}
        <FilterPeserta
          keyword={keyword}
          filterKelas={filterKelas}
          onKeywordChange={setKeyword}
          onFilterChange={setFilterKelas}
        />
      </section>

      <DaftarPeserta
        daftar={hasil}
        totalData={peserta.length}
        editId={editId}
        onEdit={handleEdit}
        onHapus={handleHapus}
        onToggleHadir={handleToggleHadir}
      />
    </main>
  );
}

export default App;
