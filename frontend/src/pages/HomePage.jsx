import styles from '../styles/HomePage.module.css';
import landingPage from '../assets/landingPage.jpg';

function HomePage() {
    return (
        <>
        <div className={styles.page}>
            <div className={styles.HighSection}>
                <div className={styles.leftSide}>
                    <h1 className={styles.title}>POLIBENCH</h1>
                    <p>A benchmarking tool designed to evaluate the performance of various <span>models</span> applied to
                    datasets. Performance evaluation is influenced by multiple factors, including the choice of dataset, 
                    model architecture, and training procedure, as well as <span>hyperparameters</span>.</p>
                </div>
                <div className={styles.RightSide}>
                    <div className={styles.image}>
                        <img src={landingPage} alt="Landing Image" />
                    </div>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <h4>Live Leaderboard</h4>
                            <p>Metrics are denormalised for fast queries - leaderboard results come from indexed reads, no aggregation.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.howItWorks}>
                <ol className={styles.steps}>
                    <li>Register a dataset</li>
                    <li>Create a version</li>
                    <li>Define the pipeline</li> 
                    <li>Choose a model</li>
                    <li>Submit experiment</li>
                    <li>View, or compare, the results on the dashboard.</li>
                </ol>
            </div>
            <div className={styles.middleSection}>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <h4>UUID-first API</h4>
                        <p>Every entity is identified by a unique UUID (Universally Unique Identifier), ensuring consistent and reliable access to resources.</p>
                    </div>
                    <div className={styles.feature}>
                        <h4>Reproducibility</h4>
                        <p>Polibench ensures that experiments can be reproduced consistently by tracking all relevant metadata.</p>
                    </div>
                </div>
            </div>
            <div className={styles.bottomSection}>
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
            </div>
        </div>
        </>
    );
}
export default HomePage;