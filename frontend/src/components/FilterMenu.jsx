function FilterMenu({ filters, setFilters, metricOptions }) {
    return (
        <div className="filter-menu">

            <label htmlFor="metric">Metric: </label>
            <select id="metric" value={filters.metric} onChange={(e) => setFilters({ ...filters, metric: e.target.value })}>
                {metricOptions.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>

            <label>Split: </label>
                <button onClick={() => setFilters({ ...filters, split: filters.split === 'validation' ? 'test' : 'validation' })}>
                    {filters.split === 'validation' ? 'Validation (click for Test)' : 'Test (click for Validation)'}
                </button>

        </div>
    )
}
export default FilterMenu;