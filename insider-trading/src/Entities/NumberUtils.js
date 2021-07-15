class NumberUtils {

    // Format the number to have commas
    static formatWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Convery a numer with commas and a peso sign
    static formatCurrency(x) {
        return "₱" + x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default NumberUtils;
