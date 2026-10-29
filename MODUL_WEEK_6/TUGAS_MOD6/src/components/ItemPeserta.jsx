function ItemPeserta({ peserta, sedangDiedit, onEdit, onHapus, onToggleHadir }) {
  const { id, nama, nim, kelas, hadir } = peserta;

  return (
    <li className={"item" + (sedangDiedit ? " item-diedit" : "")}>
      <div className="item-info">
        <strong className="item-nama">{nama}</strong>
        <span>NIM: {nim}</span>
        <span>Kelas: {kelas}</span>
        <span className={"status " + (hadir ? "status-hadir" : "status-belum")}>
          {hadir ? "Hadir" : "Belum hadir"}
        </span>
      </div>
      <div className="item-aksi">
        <button type="button" className="btn" onClick={() => onEdit(id)}>
          Edit
        </button>
        <button type="button" className="btn btn-bahaya" onClick={() => onHapus(id)}>
          Hapus
        </button>
        <button type="button" className="btn" onClick={() => onToggleHadir(id)}>
          {hadir ? "Batalkan hadir" : "Tandai hadir"}
        </button>
      </div>
    </li>
  );
}

export default ItemPeserta;
