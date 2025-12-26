export function maskPhone(phone) {
  if (!phone || phone.length < 4) return '';
  if (phone.length <= 6) return `${phone[0]}*****${phone[phone.length - 1]}`;
  const first2 = phone.slice(0, 2);
  const last2 = phone.slice(-2);
  return `${first2}${'*'.repeat(phone.length - 4)}${last2}`;
}
