export default function isOlder(dateValue: string, years: number): Boolean {
  const calcDate = new Date();
  const setDate = new Date(dateValue);
  const currentYear = calcDate.getFullYear();
  calcDate.setFullYear(currentYear - years);
  return calcDate > setDate;
}
