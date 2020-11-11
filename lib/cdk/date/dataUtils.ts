export function checkDateInRange(target: Date, from: Date, to: Date) {
  const targetTime = target.getTime();
  if (targetTime <= to.getTime() && targetTime >= from.getTime()) {
    return true;
  }
  return false;
}
