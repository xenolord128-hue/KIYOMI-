/**
 * Central Checkout, Delivery, and Payment Configuration for Patowary Fashion
 * 
 * Website owners can easily update:
 * 1. Mobile payment numbers for bKash, Nagad, Upay
 * 2. Delivery charges for Inside Dhaka and Outside Dhaka
 * 3. Support and order policies
 */

export const PAYMENT_CONFIG = {
  bkash: "01730943993",
  nagad: "01730943993",
  upay: "01730943993",
  type: "Send Money", // Personal / Merchant
  instructions: {
    bkash: "Send the exact order amount to our bKash number below using the 'Send Money' option in your bKash app. Then enter your Sender Number and Transaction ID (TrxID) below.",
    nagad: "Send the exact order amount to our Nagad number below using the 'Send Money' option in your Nagad app. Then enter your Sender Number and Transaction ID (TrxID) below.",
    upay: "Send the exact order amount to our Upay number below using the 'Send Money' option in your Upay app. Then enter your Sender Number and Transaction ID (TrxID) below.",
  }
};

export const DELIVERY_CONFIG = {
  insideDhaka: {
    id: "inside_dhaka",
    label: "Inside Dhaka",
    city: "Dhaka",
    charge: 60,
    estimatedDays: "2-3 Days",
  },
  outsideDhaka: {
    id: "outside_dhaka",
    label: "Outside Dhaka",
    city: "Outside Dhaka (All 64 Districts)",
    charge: 120,
    estimatedDays: "3-5 Days",
  },
  // Optional free delivery threshold (set to Infinity or 0 to adjust)
  freeDeliveryThreshold: 3500,
};

/**
 * Bangladesh phone number validator
 * Supports +8801XXXXXXXXX, 8801XXXXXXXXX, or 01XXXXXXXXX
 */
export function isValidBangladeshPhone(phone: string): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^(?:\+?880|0)?1[3-9]\d{8}$/.test(clean);
}

/**
 * Generate unique order ID in format: PF-YYYYMMDD-XXXX
 * Example: PF-20261002-8492
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `PF-${dateStr}-${randomSuffix}`;
}
