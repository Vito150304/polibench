//import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';
function SmoothLineChart() {
    const data = [ //copia-incollati per testare
  {
    name: 'Page A',
    uv: 400,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 300,
    pv: 4567,
    amt: 2400,
  },
  {
    name: 'Page C',
    uv: 320,
    pv: 1398,
    amt: 2400,
  },
  {
    name: 'Page D',
    uv: 200,
    pv: 9800,
    amt: 2400,
  },
  {
    name: 'Page E',
    uv: 278,
    pv: 3908,
    amt: 2400,
  },
  {
    name: 'Page F',
    uv: 189,
    pv: 4800,
    amt: 2400,
  },
];

return (
    <LineChart responsive data={data} style={{ width: '100%', aspectRatio: '16/9' }}>
        <CartesianGrid strokeDasharray="5 5" />
        <Line dataKey="uv" type="monotone" name="Vito"  />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'UV', position: 'insideLeft', angle: -90 }} />
        <Legend />
        <Tooltip />
    </LineChart>
)
}
export default SmoothLineChart;