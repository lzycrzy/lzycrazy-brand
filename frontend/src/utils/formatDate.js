export function formatDate(isoDate) {
    
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const simpleDate = `${year}-${month}-${day}`;
    return simpleDate

}