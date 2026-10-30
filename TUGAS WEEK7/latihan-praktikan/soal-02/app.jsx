const { useState, useEffect } = React;

const SKENARIO = {
  berhasil: { label: "Berhasil", url: "/api/users?delay=1000", timeout: 5000 },
  kosong:   { label: "Data kosong", url: "/api/users?mode=empty&delay=1000", timeout: 5000 },
  error:    { label: "Error HTTP", url: "/api/users?mode=error&delay=1000", timeout: 5000 },
  timeout:  { label: "Timeout", url: "/api/users?delay=2500", timeout: 700 }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pesanError(err, timeoutMs) {
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return "Timeout: server tidak merespons dalam " + timeoutMs + " ms.";
  }
  if (err.response) {
    return "Gagal: server mengembalikan HTTP " + err.response.status + ".";
  }
  return "Gangguan jaringan: " + err.message;
}

function App() {
  const [skenario, setSkenario] = useState("berhasil");
  const [reloadKey, setReloadKey] = useState(0);
  const [users, setUsers] = useState(null); // null = belum ada hasil
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [postResult, setPostResult] = useState(null);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let aktif = true;
    const { url, timeout } = SKENARIO[skenario];

    async function muat() {
      setLoading(true);
      setError("");
      setUsers(null); 
      try {
        const response = await axios.get(url, { timeout, signal: controller.signal });
        if (!aktif) return;
        setUsers(response.data);
      } catch (err) {
        if (!aktif || axios.isCancel(err)) return; 
        setError(pesanError(err, timeout));
      } finally {
        if (aktif) setLoading(false);
      }
    }
    muat();

    return () => {
      aktif = false;
      controller.abort();
    };
  }, [skenario, reloadKey]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    setPostResult(null);
    setPostError("");

    if (name === "") {
      setFormError("Nama wajib diisi dan tidak boleh hanya spasi.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setFormError("Format email tidak valid. Contoh: nama@example.com");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const response = await axios.post("/api/users", { name, email }, { timeout: 5000 });
      setPostResult({ status: response.status, data: response.data });
    } catch (err) {
      setPostError(pesanError(err, 5000));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Registrasi Peserta</h1>

      <section>
        <h2>Daftar peserta (Axios GET)</h2>
        <label htmlFor="skenario">Skenario</label>
        <select id="skenario" value={skenario} onChange={(e) => setSkenario(e.target.value)}>
          {Object.entries(SKENARIO).map(([kunci, s]) => (
            <option key={kunci} value={kunci}>{s.label}</option>
          ))}
        </select>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)} disabled={loading}>
          Muat ulang
        </button>

        <div role="status" aria-live="polite">
          {loading && <p className="loading">Memuat data peserta...</p>}
          {!loading && error && <p className="error">{error}</p>}
          {!loading && !error && users && users.length === 0 && <p>Data kosong: belum ada peserta.</p>}
        </div>
        {!loading && !error && users && users.length > 0 && (
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name} ({user.email})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Formulir pendaftaran (Axios POST)</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Nama</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          <button type="submit" disabled={submitting}>
            {submitting ? "Mengirim..." : "Kirim pendaftaran"}
          </button>
        </form>

        <div role="status" aria-live="polite">
          {formError && <p className="error">{formError}</p>}
          {postError && <p className="error">{postError}</p>}
        </div>

        {postResult && (
          <div>
            <h3>Response POST</h3>
            <dl>
              <dt>Status HTTP</dt><dd>{postResult.status}</dd>
              <dt>id</dt><dd>{String(postResult.data.id)}</dd>
              <dt>name</dt><dd>{postResult.data.name}</dd>
              <dt>email</dt><dd>{postResult.data.email}</dd>
              <dt>simulated</dt><dd>{String(postResult.data.simulated)}</dd>
            </dl>
            <p className="ok">Simulasi berhasil, data tidak disimpan.</p>
          </div>
        )}
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
