import styles from "../styles/FilterMenu.module.css";

function FilterMenu({ filters, setFilters, metricOptions }) {
    return (
        <div className={styles.container}>
            <div className={styles.filterGroup}>
                <label htmlFor="metric" className={styles.label}>Metric:</label>
                <select 
                    id="metric" 
                    className={styles.select}
                    value={filters.metric} 
                    onChange={(e) => setFilters({ ...filters, metric: e.target.value })}
                >
                    {metricOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>

            <div className={styles.filterGroup}>
                <span className={styles.label}>Split:</span>
                <button 
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setFilters({ 
                        ...filters, 
                        split: filters.split === 'validation' ? 'test' : 'validation' 
                    })}
                >
                    {filters.split === 'validation' ? 'Validation (click for Test)' : 'Test (click for Validation)'}
                </button>
            </div>
        </div>
    );
}

export default FilterMenu;