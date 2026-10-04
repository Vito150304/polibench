import { Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend, PolarRadiusAxis} from 'recharts';
import useMultiLeaderboard from '../../hooks/useMultiLeaderboard';

function RadarChartComponent({ filters, datasetId}) {
    const { data, isLoading, error } = useMultiLeaderboard({
        dataset_uuid: datasetId,
        metric: filters.multiMetrics, //fare attenzione e verificare che sia coerente con gli altri componenti e il backend
        split: filters.split,
        sort_by: filters.sortBy,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

/*Cosa ti manda il backend:
[
  { model_name: "Modello A", metrics: { "NDCG@10": 0.8, "Recall@10": 0.6 } },
  { model_name: "Modello B", metrics: { "NDCG@10": 0.9, "Recall@10": 0.5 } }
]
Cosa vuole Recharts per tracciare il poligono:

[
  { metrica: "NDCG@10", "Modello A": 0.8, "Modello B": 0.9 },
  { metrica: "Recall@10", "Modello A": 0.6, "Modello B": 0.5 }
]

Quindi devo convertire i dati nel formato idoneo. Non posso usare il map direttamente su data perché avrei un nuovo vettore
che potrebbe avere meno elementi (modelli) rispetto al numero di metriche. Quindi, devo fare il map direttamente sulle metriche
*/

    const radarData = filters.multiMetrics?.map((metric) => {
        //es: { metrica: "NDCG@10" }
        let vertice = { metrica: metric };

        data?.forEach((modello) => {
            vertice[modello.model_name] = modello[metric];
        });
        return vertice;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <RadarChart responsive data={radarData} style={{ width: '100%', aspectRatio: '16/9' }}>
            <PolarGrid /> 
            <PolarAngleAxis dataKey="metrica" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            {data.map((modello, index) => (
                <Radar key={index} name={modello.model_name} dataKey={modello.model_name} stroke={colors[index]} fill={colors[index]} fillOpacity={0.3} />
            ))} {/*da migliorare assolutamente la questione del numero dei modelli e dei colori. Se ho tanti modelli, a prescindere
                dall'opacità, non si capirà niente. Devo trovare una soluzione migliore*/}
            
            <Legend />
        </RadarChart>
    )
}
export default RadarChartComponent;