function RingkasanPeserta({ peserta, jumlahTampil }) {
  const total = peserta.length;
  const hadir = peserta.filter((p) => p.hadir).length;
  const belumHadir = total - hadir;

  const item = [
    { label: "Total peserta", nilai: total },
    { label: "Hadir", nilai: hadir },
    { label: "Belum hadir", nilai: belumHadir },
    { label: "Hasil ditampilkan", nilai: jumlahTampil },
  ];

  return (
    <section className="ringkasan" aria-label="Ringkasan peserta">
      {item.map((i) => (
        <div className="ringkasan-kartu" key={i.label}>
          <span className="ringkasan-label">{i.label}</span>
          <strong className="ringkasan-nilai" data-testid={i.label}>
            {i.nilai}
          </strong>
        </div>
      ))}
    </section>
  );
}

export default RingkasanPeserta;
