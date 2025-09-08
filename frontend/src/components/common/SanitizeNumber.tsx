const SanitizeNumber = (val: unknown) => {
    if (val === undefined || val === null) return '';
    const cleaned = String(val).replace(/,/g, '').trim();
    if (cleaned === '') return '';
    const num = Number(cleaned);
    return isNaN(num) ? '' : num;
};

export default  SanitizeNumber;

