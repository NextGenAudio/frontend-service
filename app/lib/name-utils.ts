export function getFullName(firstName?: string, lastName?: string) {
  const f = firstName || "";
  const l = lastName || "";
  const fName = f ? `${f.charAt(0).toUpperCase()}${f.slice(1)}` : "";
  const lName = l ? `${l.charAt(0).toUpperCase()}${l.slice(1)}` : "";
  return `${fName}${fName && lName ? " " : ""}${lName}`.trim();
}

export default getFullName;
