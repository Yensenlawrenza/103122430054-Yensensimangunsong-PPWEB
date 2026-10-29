function FormPeserta({ form, galat, modeEdit, onChange, onSubmit, onBatal }) {
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <h2>{modeEdit ? "Ubah peserta" : "Tambah peserta"}</h2>

      <div className="form-grup">
        <label htmlFor="nama">Nama mahasiswa</label>
        <input
          id="nama"
          name="nama"
          type="text"
          value={form.nama}
          onChange={onChange}
          placeholder="Contoh: Yensen"
          autoComplete="off"
        />
        {galat.nama && (
          <span className="galat" role="alert">
            {galat.nama}
          </span>
        )}
      </div>

      <div className="form-grup">
        <label htmlFor="nim">NIM</label>
        <input
          id="nim"
          name="nim"
          type="text"
          inputMode="numeric"
          value={form.nim}
          onChange={onChange}
          placeholder="8 digit angka"
          autoComplete="off"
        />
        {galat.nim && (
          <span className="galat" role="alert">
            {galat.nim}
          </span>
        )}
      </div>

      <div className="form-grup">
        <label htmlFor="kelas">Kelas</label>
        <select id="kelas" name="kelas" value={form.kelas} onChange={onChange}>
          <option value="">Pilih kelas</option>
          <option value="SE-08-01">SE-08-01</option>
          <option value="SE-08-02">SE-08-02</option>
        </select>
        {galat.kelas && (
          <span className="galat" role="alert">
            {galat.kelas}
          </span>
        )}
      </div>

      <div className="form-aksi">
        <button type="submit" className="btn btn-utama">
          {modeEdit ? "Simpan perubahan" : "Tambah peserta"}
        </button>
        {modeEdit && (
          <button type="button" className="btn" onClick={onBatal}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default FormPeserta;
