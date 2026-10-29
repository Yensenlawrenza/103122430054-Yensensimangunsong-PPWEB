function FilterPeserta({ keyword, filterKelas, onKeywordChange, onFilterChange }) {
  return (
    <div className="filter">
      <h2>Cari dan saring</h2>
      <div className="filter-baris">
        <div className="form-grup">
          <label htmlFor="cari">Cari nama atau NIM</label>
          <input
            id="cari"
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Ketik nama atau NIM"
            autoComplete="off"
          />
        </div>
        <div className="form-grup">
          <label htmlFor="filter-kelas">Filter kelas</label>
          <select
            id="filter-kelas"
            value={filterKelas}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="semua">Semua kelas</option>
            <option value="SE-08-01">SE-08-01</option>
            <option value="SE-08-02">SE-08-02</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterPeserta;
