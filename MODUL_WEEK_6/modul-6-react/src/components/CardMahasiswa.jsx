function CardMahasiswa({ nama, nim }) {
    return (
        <div className="card">
            <h2>{nama}</h2>
            <p>NIM: {nim}</p>
        </div>
    );
}

export default CardMahasiswa;
