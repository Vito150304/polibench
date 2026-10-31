const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB 
const VALID_SPLITS = ['', 'test', 'validation'];
const VALID_DIRECTIONS = ['', 'min', 'max'];

// Restituisce un messaggio d'errore, oppure '' se il file è valido.
export const validateMetricsCsv = async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) return 'The file must have the .csv extension.';
    if (file.size === 0) return 'The file is empty.';
    if (file.size > MAX_SIZE_BYTES) return 'The file is too large (maximum 1 MB).';


    const firstBytes = new Uint8Array(await file.slice(0, 3).arrayBuffer());
    if (firstBytes[0] === 0xEF && firstBytes[1] === 0xBB && firstBytes[2] === 0xBF) {
        return 'The file starts with a hidden BOM character. Save it again as UTF-8 without BOM (for example with Notepad).';
    }
    const text = await file.text();

    const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
    if (lines.length < 2) return 'The file must contain a header and at least one row of results.';
    if (lines[0].includes(';')) return 'Columns must be separated by commas, not by semicolons.';

    const header = lines[0].split(',');
    const metricIdx = header.indexOf('metric');
    const valueIdx = header.indexOf('value');
    if (metricIdx === -1 || valueIdx === -1) {
        return 'The first row must contain the columns "metric" and "value".';
    }
    const splitIdx = header.indexOf('split');
    const kIdx = header.indexOf('k');
    const directionIdx = header.indexOf('direction');

    for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map((cell) => cell.trim());
        const get = (idx) => (idx === -1 ? '' : (cells[idx] ?? ''));
        const row = i + 1; // numero di riga nel file, contando l'intestazione come riga 1

        if (get(metricIdx) === '') return `Row ${row}: the "metric" field is missing.`;
        const value = get(valueIdx);
        if (value === '' || !Number.isFinite(Number(value))) {
            return `Row ${row}: "value" must be a number (use a dot as the decimal separator).`;
        }
        if (!VALID_SPLITS.includes(get(splitIdx).toLowerCase())) {
            return `Row ${row}: "split" must be "test" or "validation".`;
        }
        if (!VALID_DIRECTIONS.includes(get(directionIdx).toLowerCase())) {
            return `Row ${row}: "direction" must be "min" or "max".`;
        }
        if (get(kIdx) !== '' && !/^\d+$/.test(get(kIdx))) {
            return `Row ${row}: "k" must be a whole number.`;
        }
    }
    return '';
};