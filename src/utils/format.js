export function formatDate(date) {
  const newDate = new Date(date);
  const day =
    newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
  const month =
    newDate.getMonth() + 1 < 10 ? "0" + newDate.getMonth() : newDate.getMonth();
  const year = newDate.getFullYear();
  const time = newDate.getHours() + ":" + newDate.getMinutes();
  return day + "." + month + "." + year + ", " + time;
}

export function formatSize(size) {
  const formattedSize = size / 1024 / 1024;
  return formattedSize.toFixed(1) + " МБ";
}
