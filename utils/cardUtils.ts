export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export const getCardType = (cardNumber: string): CardType => {
    if (cardNumber.startsWith('4')) {
        return 'visa';
    }
    if (/^5[1-5]/.test(cardNumber)) {
        return 'mastercard';
    }
    if (/^3[47]/.test(cardNumber)) {
        return 'amex';
    }
    if (cardNumber.startsWith('6')) {
        return 'discover';
    }
    return 'unknown';
};