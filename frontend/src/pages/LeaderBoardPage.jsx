import SmoothLineChart from '../components/charts/SmoothLineChart';
import BarChartComponent from '../components/charts/BarChart';
import RadarChartComponent from '../components/charts/RadarChart';

function LeaderBoardPage() {
    return (
        <div>
            <h2>Leader Board Page</h2>
            <SmoothLineChart />
            <BarChartComponent />
            <RadarChartComponent />
        </div>
    );
}
export default LeaderBoardPage;