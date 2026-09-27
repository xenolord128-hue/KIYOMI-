import emailjs from '@emailjs/browser';

/**
 * Official EmailJS Configuration for Patowary Fashion
 */
export const EMAILJS_PUBLIC_KEY = 'D2zGVMBFHIdv57Oz8';
export const EMAILJS_SERVICE_ID = 'service_8o5g6ad';
export const EMAILJS_TEMPLATE_ID = 'template_l8b795c';

// Initialize EmailJS once using the public key
let isInitialized = false;
export function initEmailJS() {
  if (!isInitialized && typeof window !== 'undefined') {
    try {
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
      });
      isInitialized = true;
    } catch (err) {
      console.error('[EmailJS] Initialization failed:', err);
    }
  }
}

// Auto-run init
initEmailJS();

/**
 * Form Submission Payload interface
 */
export interface FormSubmissionPayload {
  formType: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  country?: string | null;
  productOrService?: string | null;
  productId?: string | number | null;
  package?: string | null;
  quantity?: number | string | null;
  price?: number | string | null;
  total?: number | string | null;
  orderId?: string | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  deliveryAddress?: string | null;
  deliveryCharge?: number | string | null;
  notes?: string | null;
  message?: string | null;
  subject?: string | null;
  serviceName?: string | null;
  selectedPackage?: string | null;
  formElement?: HTMLFormElement | null;
  customFields?: Record<string, any>;
}

export interface SendResult {
  success: boolean;
  error?: string;
}

// Set of in-flight submissions to prevent accidental duplicate requests
const inFlightKeys = new Set<string>();

/**
 * Automatically format the current date, time, and timezone according to the user's local timezone
 */
export function getSubmissionTimestamps(): {
  date: string;
  time: string;
  timezone: string;
  fullTimestamp: string;
} {
  const now = new Date();

  let timezone = 'Asia/Dhaka';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka';
  } catch (e) {
    // fallback
  }

  // Example: "27 September 2026"
  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: timezone,
  }).format(now);

  // Example: "3:15 PM"
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(now);

  return {
    date,
    time: `${time} (${timezone})`,
    timezone,
    fullTimestamp: `${date} at ${time} [${timezone}]`,
  };
}

/**
 * Format field key into readable Title Case label
 */
function humanizeLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Cleanly format value or output "Not provided"
 */
function formatValue(val: any): string {
  if (val === null || val === undefined) return 'Not provided';
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : 'Not provided';
  }
  if (typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return 'Not provided';
    return val
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return Object.entries(item)
            .map(([k, v]) => `${humanizeLabel(k)}: ${formatValue(v)}`)
            .join(', ');
        }
        return String(item);
      })
      .join('; ');
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val);
    if (entries.length === 0) return 'Not provided';
    return entries
      .map(([k, v]) => `${humanizeLabel(k)}: ${formatValue(v)}`)
      .join(' | ');
  }
  return String(val);
}

/**
 * Extract all actual form inputs, textareas, selects, checkboxes, and radios from HTMLFormElement
 */
export function extractFieldsFromFormElement(
  form: HTMLFormElement
): Record<string, string> {
  const result: Record<string, string> = {};
  const elements = Array.from(form.elements);

  for (const el of elements) {
    const input = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const placeholder = 'placeholder' in input ? (input as HTMLInputElement | HTMLTextAreaElement).placeholder : '';
    if (!input.name && !input.id && !placeholder) continue;

    // Skip submit and reset buttons
    if (input.type === 'submit' || input.type === 'button' || input.type === 'reset') {
      continue;
    }

    const fieldKey = input.name || input.id || placeholder || 'Field';

    if (input.type === 'checkbox') {
      const checkbox = input as HTMLInputElement;
      result[fieldKey] = checkbox.checked ? 'Yes' : 'No';
    } else if (input.type === 'radio') {
      const radio = input as HTMLInputElement;
      if (radio.checked) {
        result[fieldKey] = radio.value || 'Selected';
      }
    } else {
      result[fieldKey] = input.value?.trim() || '';
    }
  }

  return result;
}

/**
 * Central function to send form data through EmailJS
 */
export async function sendFormViaEmailJS(
  payload: FormSubmissionPayload
): Promise<SendResult> {
  initEmailJS();

  const { date, time, timezone } = getSubmissionTimestamps();

  // Create an in-flight key to prevent duplicate simultaneous clicks
  const flightKey = `${payload.formType}-${payload.name || payload.email || payload.phone || ''}-${payload.orderId || ''}`;
  if (inFlightKeys.has(flightKey)) {
    console.warn('[EmailJS] Duplicate submission in-flight blocked:', flightKey);
    return { success: false, error: 'A submission is currently being processed. Please wait a moment.' };
  }
  inFlightKeys.add(flightKey);

  try {
    // 1. Collect all raw fields from formElement if provided
    const extractedFormFields: Record<string, string> = payload.formElement
      ? extractFieldsFromFormElement(payload.formElement)
      : {};

    // 2. Normalize primary fields
    const formType = payload.formType || 'Website Form';
    const name = payload.name || payload.firstName ? `${payload.firstName || ''} ${payload.lastName || ''}`.trim() : (extractedFormFields['fullName'] || extractedFormFields['name'] || '');
    const email = payload.email || extractedFormFields['email'] || '';
    const phone = payload.phone || extractedFormFields['phone'] || extractedFormFields['phoneNumber'] || '';
    const whatsapp = payload.whatsapp || extractedFormFields['whatsapp'] || '';
    const address = payload.address || payload.deliveryAddress || extractedFormFields['address'] || extractedFormFields['shippingAddress'] || '';
    const city = payload.city || extractedFormFields['city'] || '';
    const district = payload.district || extractedFormFields['district'] || '';
    const country = payload.country || extractedFormFields['country'] || 'Bangladesh';

    const productOrService = payload.productOrService || payload.serviceName || extractedFormFields['product'] || extractedFormFields['service'] || '';
    const productId = payload.productId !== undefined && payload.productId !== null ? String(payload.productId) : (extractedFormFields['productId'] || '');
    const pkg = payload.package || payload.selectedPackage || extractedFormFields['package'] || '';
    const quantity = payload.quantity !== undefined && payload.quantity !== null ? String(payload.quantity) : (extractedFormFields['quantity'] || '');
    const price = payload.price !== undefined && payload.price !== null ? String(payload.price) : (extractedFormFields['price'] || '');
    const total = payload.total !== undefined && payload.total !== null ? String(payload.total) : (extractedFormFields['total'] || '');

    const paymentMethod = payload.paymentMethod || extractedFormFields['paymentMethod'] || '';
    const transactionId = payload.transactionId || payload.orderId || extractedFormFields['transactionId'] || extractedFormFields['orderId'] || '';
    const message = payload.message || payload.notes || extractedFormFields['message'] || extractedFormFields['notes'] || extractedFormFields['comment'] || '';
    const subject = payload.subject || `New ${formType} Submission - Patowary Fashion`;

    // 3. Compile all submitted fields dictionary for all_form_data
    const allFieldsDict: Record<string, string> = {};

    // Put primary fields first in clean order
    if (payload.orderId) allFieldsDict['Order ID'] = formatValue(payload.orderId);
    allFieldsDict['Form Type'] = formatValue(formType);
    allFieldsDict['Submission Date'] = formatValue(date);
    allFieldsDict['Submission Time'] = formatValue(time);
    allFieldsDict['Timezone'] = formatValue(timezone);

    if (name) allFieldsDict['Full Name'] = formatValue(name);
    if (email) allFieldsDict['Email Address'] = formatValue(email);
    if (phone) allFieldsDict['Phone Number'] = formatValue(phone);
    if (whatsapp) allFieldsDict['WhatsApp Number'] = formatValue(whatsapp);

    if (address) allFieldsDict['Address'] = formatValue(address);
    if (city) allFieldsDict['City'] = formatValue(city);
    if (district) allFieldsDict['District'] = formatValue(district);
    if (country) allFieldsDict['Country'] = formatValue(country);

    if (productOrService) allFieldsDict['Product / Service'] = formatValue(productOrService);
    if (productId) allFieldsDict['Product ID'] = formatValue(productId);
    if (pkg) allFieldsDict['Package / Variant'] = formatValue(pkg);
    if (quantity) allFieldsDict['Quantity'] = formatValue(quantity);
    if (price) allFieldsDict['Price'] = formatValue(price);
    if (total) allFieldsDict['Total Amount'] = formatValue(total);
    if (payload.deliveryCharge !== undefined && payload.deliveryCharge !== null) {
      allFieldsDict['Delivery Charge'] = formatValue(payload.deliveryCharge);
    }

    if (paymentMethod) allFieldsDict['Payment Method'] = formatValue(paymentMethod);
    if (transactionId) allFieldsDict['Transaction / Reference ID'] = formatValue(transactionId);
    if (message) allFieldsDict['Message / Notes'] = formatValue(message);

    // Merge any extracted form element fields that weren't captured above
    for (const [key, val] of Object.entries(extractedFormFields)) {
      const label = humanizeLabel(key);
      if (!allFieldsDict[label]) {
        allFieldsDict[label] = formatValue(val);
      }
    }

    // Merge any custom fields
    if (payload.customFields) {
      for (const [key, val] of Object.entries(payload.customFields)) {
        const label = humanizeLabel(key);
        allFieldsDict[label] = formatValue(val);
      }
    }

    // Build the formatted "all_form_data" string
    const allFormDataLines = Object.entries(allFieldsDict).map(
      ([k, v]) => `${k}: ${v}`
    );
    const allFormDataStr = allFormDataLines.join('\n');

    // 4. Construct template parameters matching the required variables
    const templateParams: Record<string, string> = {
      form_type: formatValue(formType),
      submission_date: formatValue(date),
      submission_time: formatValue(time),
      name: formatValue(name),
      email: formatValue(email),
      phone: formatValue(phone),
      whatsapp: formatValue(whatsapp),
      product_or_service: formatValue(productOrService),
      product_id: formatValue(productId),
      package: formatValue(pkg),
      quantity: formatValue(quantity),
      price: formatValue(price),
      total: formatValue(total),
      address: formatValue(address),
      city: formatValue(city),
      district: formatValue(district),
      country: formatValue(country),
      payment_method: formatValue(paymentMethod),
      transaction_id: formatValue(transactionId),
      order_id: formatValue(payload.orderId || transactionId),
      delivery_address: formatValue(payload.deliveryAddress || address),
      delivery_charge: formatValue(payload.deliveryCharge),
      notes: formatValue(payload.notes || message),
      message: formatValue(message),
      subject: formatValue(subject),
      service_name: formatValue(payload.serviceName || productOrService),
      selected_package: formatValue(payload.selectedPackage || pkg),
      all_form_data: allFormDataStr,
    };

    // Also populate individual custom field keys as lowercase/snake_case parameters for EmailJS template flexibility
    for (const [k, v] of Object.entries(allFieldsDict)) {
      const sanitizedKey = k.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
      if (!templateParams[sanitizedKey]) {
        templateParams[sanitizedKey] = v;
      }
    }

    console.log(`[EmailJS] Dispatching email for form "${formType}"...`, templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('[EmailJS] Dispatched successfully:', response.status, response.text);
    return { success: true };
  } catch (error: any) {
    console.error('[EmailJS] Execution failed with error:', error);
    const errorMessage =
      error?.text ||
      error?.message ||
      'Unable to submit your information right now. Please try again.';
    return {
      success: false,
      error: errorMessage,
    };
  } finally {
    // Keep lock active briefly to prevent rapid duplicate clicks
    setTimeout(() => {
      inFlightKeys.delete(flightKey);
    }, 2500);
  }
}
