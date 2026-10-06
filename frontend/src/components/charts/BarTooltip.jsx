import { Trophy } from 'lucide-react';
import { LiaMedalSolid } from "react-icons/lia"; //secondo posto
import { BiMedal } from "react-icons/bi"; //terzo posto



function BarTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        //logica per trovare i primi 3 valori massimi. Lo scopo è puramente grafico
        let max = payload[0].value;
        let indexofMax = 0;
        payload.forEach((modello, index) => {
            if (modello.value > max) {
                max = modello.value;
                indexofMax = index;
            }
        });

        let secondMax = payload[0].value;
        let indexofSecondMax = 0;
        payload.forEach((modello, index) => {
            if (modello.value > secondMax && index !== indexofMax) {
                secondMax = modello.value;
                indexofSecondMax = index;
            }
        });

        let thirdMax = payload[0].value;
        let indexofThirdMax = 0;
        payload.forEach((modello, index) => {
            if (modello.value > thirdMax && index !== indexofMax && index !== indexofSecondMax) {
                thirdMax = modello.value;
                indexofThirdMax = index;
            }
        });

        let icon = null;
        if (data === payload[indexofMax].payload) {
            icon = <Trophy className="trophy-icon" />;
        } else if (data === payload[indexofSecondMax].payload) {
            icon = <LiaMedalSolid className="medal-icon" />;
        } else if (data === payload[indexofThirdMax].payload) {
            icon = <BiMedal className="medal-icon" />;
        }


        return (
            <div className="custom-tooltip">
                <p className="label">
                    {icon}
                    {`Modello: ${label}`}
                </p> {/*label rappresenta il valore sull'asse x. Per il barChart, in Xaxis ho messo il model_name*/}

                <p className="score">{`Punteggio: ${data.value}`}</p>
                <p className="author">{`Avviato da: ${data.submitted_by_display_name}`}</p>
                <p className="hyperparams">{`Iperparametri: ${JSON.stringify(data.training_config)}`}</p>
            </div>
        );
    }
    return null;
}
export default BarTooltip;