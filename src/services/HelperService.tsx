export const getOrdinal = (n: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return n + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};