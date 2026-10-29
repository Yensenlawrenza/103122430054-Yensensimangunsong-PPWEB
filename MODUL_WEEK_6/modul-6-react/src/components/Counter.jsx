import { useState } from 'react'

function Counter() {
    const [jumlah, setJumlah] = useState(0);

  return (
    <div>
      <p>jumlah klik: {jumlah}</p>
      <button onClick={() => setJumlah(jumlah + 1)}>Tambah</button>
    </div>
  )
}

export default Counter;
