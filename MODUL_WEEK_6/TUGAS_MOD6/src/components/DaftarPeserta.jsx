import ItemPeserta from "./ItemPeserta.jsx";

function DaftarPeserta({ daftar, totalData, editId, onEdit, onHapus, onToggleHadir }) {
  if (totalData === 0) {
    return <p className="kosong">Belum ada peserta.</p>;
  }
  if (daftar.length === 0) {
    return <p className="kosong">Peserta tidak ditemukan.</p>;
  }

  return (
    <ul className="daftar">
      {daftar.map((p) => (
        <ItemPeserta
          key={p.id}
          peserta={p}
          sedangDiedit={p.id === editId}
          onEdit={onEdit}
          onHapus={onHapus}
          onToggleHadir={onToggleHadir}
        />
      ))}
    </ul>
  );
}

export default DaftarPeserta;
