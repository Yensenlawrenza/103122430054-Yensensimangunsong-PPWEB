var URL_PENGUMUMAN = "pengumuman.txt";
var SUMBER = {
  mock: { nama: "Mock lokal", url: "/api/users?delay=1500" },
  eksternal: { nama: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com/users" }
};

var elHitungan = document.getElementById("hitungan");
var elBtnHitung = document.getElementById("btn-hitung");
var elWaktuAwal = document.getElementById("waktu-awal");

var elBtnPengumuman = document.getElementById("btn-pengumuman");
var elStatusPengumuman = document.getElementById("status-pengumuman");
var elIsiPengumuman = document.getElementById("isi-pengumuman");

var elSumber = document.getElementById("sumber");
var elBtnPeserta = document.getElementById("btn-peserta");
var elStatusPeserta = document.getElementById("status-peserta");
var elInfoPeserta = document.getElementById("info-peserta");
var elDaftarPeserta = document.getElementById("daftar-peserta");

function setStatus(el, teks, kelas) {
  el.textContent = teks;
  el.className = "status" + (kelas ? " " + kelas : "");
}

var hitungan = 0;
elWaktuAwal.textContent = new Date().toLocaleString("id-ID");
elBtnHitung.addEventListener("click", function () {
  hitungan++;
  elHitungan.textContent = hitungan;
});

elBtnPengumuman.addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", URL_PENGUMUMAN, true); 
  xhr.setRequestHeader("Cache-Control", "no-cache"); 
  xhr.timeout = 10000;

  elBtnPengumuman.disabled = true;
  elIsiPengumuman.textContent = "";
  setStatus(elStatusPengumuman, "Memuat pengumuman...", "loading");

  function selesai() { elBtnPengumuman.disabled = false; }

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) return; // 4 = DONE
    if (xhr.status === 200) {
      elIsiPengumuman.textContent = xhr.responseText;
      setStatus(elStatusPengumuman, "Pengumuman berhasil dimuat.", "ok");
    } else if (xhr.status === 404) {
      setStatus(elStatusPengumuman,
        "Gagal: berkas pengumuman tidak ditemukan (HTTP 404). Periksa nama berkas.", "error");
    } else if (xhr.status !== 0) {
      setStatus(elStatusPengumuman,
        "Gagal memuat pengumuman. Status HTTP: " + xhr.status + " " + xhr.statusText, "error");
    }

    if (xhr.status !== 0) selesai();
  };
  xhr.onerror = function () {
    setStatus(elStatusPengumuman, "Gangguan jaringan: pengumuman tidak dapat dimuat.", "error");
    selesai();
  };
  xhr.ontimeout = function () {
    setStatus(elStatusPengumuman, "Permintaan pengumuman melebihi batas waktu.", "error");
    selesai();
  };
  xhr.send();
});

elBtnPeserta.addEventListener("click", function () {
  var kunci = elSumber.value;
  var sumber = SUMBER[kunci];

  elBtnPeserta.disabled = true;
  elDaftarPeserta.innerHTML = "";
  elInfoPeserta.textContent = "";
  setStatus(elStatusPeserta, "Memuat data peserta dari " + sumber.nama + "...", "loading");

  fetch(sumber.url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("HTTP " + response.status + (response.statusText ? " " + response.statusText : ""));
      }
      return response.json();
    })
    .then(function (data) {
      var tampil = data.slice(0, 3);
      tampil.forEach(function (user) {
        var li = document.createElement("li");
        li.textContent = user.name + " (" + user.email + ")";
        elDaftarPeserta.appendChild(li);
      });
      elInfoPeserta.textContent = "Sumber: " + sumber.nama + " | Jumlah data ditampilkan: " + tampil.length;
      setStatus(elStatusPeserta,
        tampil.length ? "Data peserta berhasil dimuat." : "Tidak ada data peserta.", "ok");
    })
    .catch(function (err) {
      var pesan = "Gagal mengambil data dari " + sumber.nama + " (" + err.message + ").";
      if (kunci === "eksternal") {
        pesan += " Periksa koneksi internet Anda atau pilih sumber Mock lokal secara manual.";
      } else {
        pesan += " Pastikan server lokal masih berjalan.";
      }
      setStatus(elStatusPeserta, pesan, "error");
    })
    .finally(function () {
      elBtnPeserta.disabled = false;
    });
});
