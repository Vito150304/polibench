import styles from '../styles/HomePage.module.css';

function HomePage() {
    return (
        <>
            <div className={styles.introduction}>
                <h1 className={styles.title}>Welcome to Polibench!</h1>
                <h3>What is Polibench?</h3>
                <p>Polibench is a benchmarking tool designed to evaluate the performance of various <span>models</span> applied to
                datasets. Performance evaluation is influenced by multiple factors, including the choice of dataset, 
                model architecture, and training procedure, as well as <span>hyperparameters</span>.</p>
                </div>
            <div className={styles.howItWorks}>
                <h3>How does it work?</h3>
                <span>Six steps procedure.</span>
                <ol className={styles.steps}>
                    <li>Register a dataset</li>
                    <li>Create a version</li>
                    <li>Define the pipeline</li> 
                    <li>Choose a model</li>
                    <li>Submit experiment</li>
                    <li>View, or compare, the results on the dashboard.</li>
                </ol>
            </div>
            <div className={styles.features}>
                <div className={styles.feature}>
                    <h4>UUID-first API</h4>
                    <p>Every entity is identified by a unique UUID (Universally Unique Identifier), ensuring consistent and reliable access to resources.</p>
                </div>
                <div className={styles.feature}>
                    <h4>Reproducibility</h4>
                    <p>Polibench ensures that experiments can be reproduced consistently by tracking all relevant metadata.</p>
                </div>
                <div className={styles.feature}>
                    <h4>Live Leaderboard</h4>
                    <p>Metrics are denormalised for fast queries - leaderboard results come from indexed reads, no aggregation.</p>
                </div>
            </div>
            <div className={styles.builtWith}>
                <h3>Built with</h3>
                <ul>
                    <li>FastAPI</li>
                    <li>React</li>
                    <li>MongoDB</li>
                    <li>Docker</li>
                    <li>Beanie</li>
                    <li>Pydantic</li>
                </ul>
            </div>
        </>
    );
}
export default HomePage;