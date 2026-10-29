import CardMahasiswa from './CardMahasiswa'
import { useState } from 'react'


function DaftarMahasiswa() {
    const [mahasiswa] = useState([
        {id: 1, nama: "Yensen simangunsong", nim: "103122430054"},
        {id: 2, nama: "eccen", nim: "103122400041"},
        {id: 3, nama: "samudra", nim: "103122400042"},
        
    ])
  return (
    <div>
      {mahasiswa.map((mhs) => (
        <CardMahasiswa key={mhs.id} nama={mhs.nama} nim={mhs.nim} />
      ))}
    </div>
  )
}

export default DaftarMahasiswa;
