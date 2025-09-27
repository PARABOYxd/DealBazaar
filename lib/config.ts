export const contactConfig = {
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+919876543210',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  email: process.env.NEXT_PUBLIC_EMAIL || 'info@electrofurni.com',
  address: process.env.NEXT_PUBLIC_ADDRESS || '123 Business Street, Andheri East',
  city: process.env.NEXT_PUBLIC_CITY || 'Mumbai',
  state: process.env.NEXT_PUBLIC_STATE || 'Maharashtra',
  pincode: process.env.NEXT_PUBLIC_PINCODE || '400093',
};

export default contactConfig;
