function LineTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;


        return (
            <div className="custom-tooltip">
                <p className="label">{`Modello: ${label}`}</p> {/*label rappresenta il valore sull'asse x. Per il barChart, in Xaxis ho messo il model_name*/}
                <p className="score">{`Punteggio: ${data.best_value}`}</p>
                <p className="author">{`Avviato da: ${data.submitted_by_display_name}`}</p>
                <p className="hyperparams">{`Iperparametri: ${JSON.stringify(data.best_training_config)}`}</p>
            </div>
        );
    }
    return null;
}
export default LineTooltip;