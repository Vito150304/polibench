
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// 1. I dati finti (strutturati esattamente come risponderà il tuo backend)
const mockLeaderboardData = [
  {
    model_name: "LightGCN",
    ndcg: 0.82,
    training_config: { learning_rate: 0.001, epochs: 150, batch_size: 1024 },
    author: "Mario Rossi"
  },
  {
    model_name: "BPR-MF",
    ndcg: 0.75,
    training_config: { learning_rate: 0.01, epochs: 100, batch_size: 512 },
    author: "Giulia Bianchi"
  },
  {
    model_name: "ItemKNN",
    ndcg: 0.65,
    training_config: { k: 50, similarity: "cosine" },
    author: "Mario Rossi"
  }
];

// 2. IL TOOLTIP INTERATTIVO E PERSONALIZZATO
const CustomTooltip = ({ active, payload, label }) => {
  // Se il mouse è sopra una barra e ci sono dati...
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Peschiamo l'intero oggetto dalla riga dei dati

    return (
      <div style={{
        backgroundColor: '#1a1a1a', 
        padding: '15px', 
        border: '1px solid #555', 
        borderRadius: '8px', 
        color: '#fff',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.5)' // Ombreggiatura elegante
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#8884d8' }}>🏆 {label}</h4>
        
        <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>
          <strong>NDCG@10:</strong> <span style={{ color: '#4ade80' }}>{data.ndcg}</span>
        </p>
        
        <hr style={{ borderColor: '#444', margin: '10px 0' }} />
        
        <p style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#aaa' }}>
          <strong>Avviato da:</strong> {data.author}
        </p>
        
        <div style={{ margin: '0', fontSize: '13px', color: '#aaa' }}>
          <strong>Iperparametri:</strong>
          {/* Un mini-blocco di codice per formattare bene il JSON degli iperparametri */}
          <pre style={{ 
              margin: '5px 0 0 0', 
              padding: '8px', 
              backgroundColor: '#2d2d2d', 
              borderRadius: '4px',
              fontSize: '11px'
          }}>
            {JSON.stringify(data.training_config, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
  return null; // Se il mouse è fuori, nascondi tutto
};

// 3. IL GRAFICO PRINCIPALE
export default function LeaderboardDemo() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Leaderboard: Risultati Modelli</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        <em>Passa il mouse sulle barre azzurre per scoprire la configurazione nascosta di ogni esperimento.</em>
      </p>

      {/* Il contenitore responsivo con altezza fissa a 400px */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={mockLeaderboardData}>
            
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} vertical={false} />
            
            <XAxis dataKey="model_name" tick={{ fill: '#333', fontWeight: 'bold' }} />
            {/* Dato che NDCG va da 0 a 1, forziamo l'asse Y ad avere questa scala */}
            <YAxis domain={[0, 1]} />
            
            {/* Inseriamo il nostro componente magico e uno sfondo grigio chiaro al passaggio del mouse */}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5' }} />
            
            {/* La barra ha un raggio per smussare solo gli angoli in alto (radius) */}
            <Bar dataKey="ndcg" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={60} />
            
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}