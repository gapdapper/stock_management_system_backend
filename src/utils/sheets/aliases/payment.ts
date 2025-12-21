export const PaymentTypeAliases = [
  {
    id: 1,
    paymentType: "Credit Card",
    pattern: [/credit card/i, /บัตรเครดิต/i, /บัตร เดบิต/i, /MIXEDCARD/i],
  },
  {
    id: 2,
    paymentType: "Bank Transfer",
    pattern: [
      /Mobile Banking/i,
      /Bank Transfer/i,
      /โอนเงินผ่านธนาคาร/i,
      /โอนเงิน/i,
      /SCB/i,
      /KBank/i,
      /MBanking/i,
      /Bualuang/i,
      /Krungthai/i,
      /K PLUS/i,
    ],
  },
  {
    id: 3,
    paymentType: "Promptpay",
    pattern: [/Promptpay/i, /PROMPTPAY/i, /พร้อมเพย์/i, /QR พร้อมเพย์/i],
  },
  {
    id: 4,
    paymentType: "Cash on Delivery",
    pattern: [/Cash on Delivery/i, /เก็บเงินปลายทาง/i, /COD/i],
  },
  {
    id: 5,
    paymentType: "TMN Express",
    pattern: [/TMN_Express/i, /ทีเอ็มเอ็น เอ็กซ์เพรส/i, /TMN Express/i],
  },
  {
    id: 6,
    paymentType: "Shopee Wallet",
    pattern: [/Shopee Wallet/i, /ShopeePay/i, /Shopee Wallet/i],
  },
  {
    id: 7,
    paymentType: "Airpay Wallet",
    pattern: [/Airpay Wallet/i, /Airpay/i, /Airpay Wallet/i],
  },
  {
    id: 8,
    paymentType: "Airpay Credit Card",
    pattern: [/Airpay Credit Card/i, /Airpay บัตรเครดิต/i, /Airpay Credit Card/i],
  },
  {
    id: 9,
    paymentType: "Shopee Credit",
    pattern: [/Shopee Credit/i, /เครดิต Shopee/i, /Shopee Credit/i],
  },
  {
    id: 10,
    paymentType: "TikTok Pay Later",
    pattern: [/TikTok Pay Later/i, /จ่ายทีหลัง TikTok/i, /TikTok Pay Later/i],
  },
  {
    id: 11,
    paymentType: "Shopee Pay Later",
    pattern: [/SPayLater/i, /Shopee Pay Later/i],
  },
  {
    id: 12,
    paymentType: "Other",
    pattern: [/Other/i, /อื่นๆ/i, /อื่นๆ/i],
  },
  {
    id: 13,
    paymentType: "Shopee Pay",
    pattern: [/ShopeePay/i, /ShopeePay - ตัดบัญชีธนาคาร/i],
  },
  {
    id: 14,
    paymentType: "True Money",
    pattern: [/TrueMoney/i, /True Money Wallet/i],
  },
];
