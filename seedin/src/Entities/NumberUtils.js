class NumberUtils {
    // Convery a numer with commas and a peso sign
    static formatCurrency(x) {
        return "₱" + x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default NumberUtils;
