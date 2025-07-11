export function formatPrice(price) {
    if (price >= 100000 && price < 10000000) {
        return (price / 100000).toFixed(2) + 'Lac'
    } else if (price >= 10000000 ) {
        return (price / 10000000).toFixed(2) + 'Cr'
    } else {
        return price;
    }
}