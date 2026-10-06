function RadarTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const { metrics, ...pairModelValue } = data;

        return (
            <div className="custom-tooltip">
                <p className="label">{`Metrica: ${metrics}`}</p>
                {/*se usassi JSON.stringify(pairModelValue) avrei LETTERALMENTE 
                Punteggio per ogni modello: {"Modello A":0.9, "Modello B":0.8, "Modello C":0.75}. 
                Funziona, ma è inguardabile e non posso formattare le cose singolarmente se mi serve.
                
                La soluzione è usare Object.entries() */}

                <p className="score-list">{Object.entries(pairModelValue).map(([nomeModello, punteggio], index) => (
                    <p key={index}>{`${nomeModello}: ${punteggio}`}</p>
                ))}</p>
            </div>
        )
    }
    return null;
}
export default RadarTooltip;