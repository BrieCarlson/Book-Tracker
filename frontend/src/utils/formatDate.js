export function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  let formattedDate;

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-");

    formattedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  } else {
    formattedDate = new Date(date);
  }

  if (isNaN(formattedDate.getTime())) {
    return "N/A";
  }

  return formattedDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}

export function formatDateTime(date) {
  if (!date) {
    return "N/A";
  }

  const formattedDate = new Date(date);

  if (isNaN(formattedDate.getTime())) {
    return "N/A";
  }

  return formattedDate.toLocaleString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}