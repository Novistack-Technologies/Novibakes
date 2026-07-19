import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/* Generate NB-YYMMDD-XXXX style order ID */
const generateOrderId = () => {
  const now  = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6).padEnd(4, "0");
  return `NB-${date}-${rand}`;
};

/**
 * Save an order to Firestore before WhatsApp redirect.
 * Returns the generated orderId.
 */
export const saveOrder = async ({
  orderId: providedId,
  customer,   // { name, phone, email }
  items,      // [{ name, selectedWeight, quantity, unitPrice, totalPrice }]
  subtotal,
  deliveryFee,
  total,
  paymentMethod,
  transactionId,
  address,
  city,
  pincode,
  deliveryDate,
  deliveryTime,
  specialInstructions,
}) => {
  const orderId = providedId || generateOrderId();

  await addDoc(collection(db, "orders"), {
    orderId,
    status:   "pending",
    createdAt: serverTimestamp(),

    customer: {
      name:  customer.name.trim(),
      phone: customer.phone.trim(),
      email: customer.email?.trim() || "",
    },

    items: items.map((i) => ({
      name:           i.name,
      selectedWeight: i.selectedWeight,
      quantity:       i.quantity,
      unitPrice:      i.unitPrice || 0,
      totalPrice:     i.totalPrice,
    })),

    subtotal:    subtotal,
    deliveryFee: deliveryFee,
    total:       total,

    paymentMethod:      paymentMethod,
    transactionId:      transactionId?.trim() || "",

    address:             address.trim(),
    city:                city.trim(),
    pincode:             pincode?.trim() || "",
    deliveryDate:        deliveryDate || "",
    deliveryTime:        deliveryTime || "",
    specialInstructions: specialInstructions?.trim() || "",
  });

  return orderId;
};

export { generateOrderId };
