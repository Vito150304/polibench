

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${data.uv}`}</p> {/*aggiornare con i dati non mockuppati*/}
                <p className="intro">{`PV: ${data.pv}`}</p>
                <p className="desc">{`AMT: ${data.amt}`}</p>
            </div>
        );
    }
    return null;
}
export default CustomTooltip;