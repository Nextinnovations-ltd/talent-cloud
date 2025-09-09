const SanitizeNumberCurrency = (val: unknown): string => {
    if (val === undefined || val === null) return '';
    
    const cleaned = String(val).replace(/,/g, '').trim();
    if (cleaned === '') return '';
    
    const num = Number(cleaned);
    if (isNaN(num)) return '';
    
    // Format with commas, no decimals
    return num.toLocaleString();
};

export default SanitizeNumberCurrency;


