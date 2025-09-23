import { z } from 'zod';

const phoneRegex = new RegExp(
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
);

export const checkoutSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().regex(phoneRegex, { message: "Invalid phone number." }),
    email: z.string().email({ message: "Invalid email address." }),
    address: z.string().min(5, { message: "Address is too short." }),

    cardNumber: z.string().length(19, { message: "Card number must be 16 digits." })
        .regex(/^\d{4}-\d{4}-\d{4}-\d{4}$/, { message: "Invalid card format. Use XXXX-XXXX-XXXX-XXXX." }),
    expiryDate: z.string().length(5, { message: "Expiry date must be in MM/YY format." })
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Invalid format. Use MM/YY." }),
    cvv: z.string().min(3, { message: "CVV must be 3 or 4 digits." }).max(4, { message: "CVV must be 3 or 4 digits." }),
});

export type TCheckoutSchema = z.infer<typeof checkoutSchema>;