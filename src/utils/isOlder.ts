export default function isOlder(dateValue: string, years: number): Boolean {
  const calcDate = new Date();
  const setDate = new Date(dateValue);
  const setYear = setDate.getFullYear();
  const currentYear = calcDate.getFullYear();
  const minYear = Math.abs(currentYear - 100);
  calcDate.setFullYear(currentYear - years);
  return calcDate > setDate && setYear > minYear;
}
