import { Trophy } from 'lucide-react';
import { LiaMedalSolid } from "react-icons/lia"; //secondo posto
import { BiMedal } from "react-icons/bi"; //terzo posto



function BarTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        //logica per trovare i primi 3 valori massimi. Lo scopo è puramente grafico
        let icon = null;
        if (data.rank === 1) icon = <Trophy className="trophy-icon" />;
        else if (data.rank === 2) icon = <LiaMedalSolid className="medal-icon" />;
        else if (data.rank === 3) icon = <BiMedal className="medal-icon" />;


        return (
            <div className="custom-tooltip">
                <p className="label">
                    {icon}
                    {`Model: ${data.model_name} (${data.pipeline_code})`}
                </p> {/*label rappresenta il valore sull'asse x. Per il barChart, in Xaxis ho messo il model_name*/}

                <p className="score">{`Score: ${data.value}`}</p>
                <p className="author">{`Initiated by: ${data.submitted_by_display_name}`}</p>
                <p className="hyperparams">{`Hyperparameters: ${JSON.stringify(data.training_config)}`}</p>
            </div>
        );
    }
    return null;
}
export default BarTooltip;