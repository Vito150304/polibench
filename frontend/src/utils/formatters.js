export const formatUuid = (uuid, length = 8) => {
    if (!uuid) return '-';
    return uuid.slice(0, length) + '...';
}

export const formatDate = (date) => {
    if (!date) return '-';
    const formattedDate = new Date(date);

    return formattedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true // AM/PM
    });
}