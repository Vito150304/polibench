function FilterMenu({ filters, setFilters }) {
    return (
        <>
            <div className="filter-menu">
                <label>Metrica: </label>
                <select value={filters.metric} onChange={(e) => setFilters({ ...filters, metric: e.target.value })}> {/*value={filters.metric} dice al menu: "mostra esattamente quello che c'è scritto nella variabile filters.metric". */}
                    <option value="NDCG@10">NDCG@10</option>
                    <option value="Precision@10">Precision@10</option>
                    <option value="Recall@10">Recall@10</option>
                </select>
                <label>Split: </label>
                <button onClick={() => setFilters({ ...filters, split: filters.split === 'validation' ? 'test' : 'validation' })}>{filters.split === 'validation' ? 'Switch to Test' : 'Switch to Validation'}</button>
                <label>Ordina per: </label>
                <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                    <option value="asc">Ascendente</option>
                    <option value="desc">Discendente</option>
                </select>
            </div>
        </>
    )
}
export default FilterMenu;