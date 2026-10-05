import { Trophy } from 'lucide-react';
import { LiaMedalSolid } from "react-icons/lia"; //secondo posto
import { BiMedal } from "react-icons/bi"; //terzo posto



function CustomTooltip({ active, payload, label }) {
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


        return (
            <div className="custom-tooltip">
                {data === payload[indexofMax].payload && <Trophy className="trophy-icon" /> && (
                    <>
                        <p className="label">{data.model_name}</p>
                        <p className="author">{`${label}: ${data.uv}`}</p>  {/*continuare a modificare dopo aver visto lo swagger*/}
                    </>
                )}
                {data === payload[indexofSecondMax].payload && <LiaMedalSolid className="medal-icon" /> && (
                    <>
                        <p className="label">{data.model_name}</p>
                    </>
                )}
                {data === payload[indexofThirdMax].payload && <BiMedal className="medal-icon" /> && (
                    <>
                        <p className="label">{data.model_name}</p>
                    </>
                )}


                
                <p className="label">{data.model_name}</p> 
                <p className="intro">{`PV: ${data.pv}`}</p>
                <p className="desc">{`AMT: ${data.amt}`}</p>
            </div>
        );
    }
    return null;
}
export default CustomTooltip;