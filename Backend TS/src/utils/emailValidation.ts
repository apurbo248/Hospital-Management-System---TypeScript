// Trusted domains list
const trustedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];

export const validateEmailDomain = (email:any) => {
  if (!email || typeof email !== "string") {
    return { valid: false, reason: "Email is required and must be a string" };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const parts = normalizedEmail.split("@");

  // Must contain exactly one '@' and a non-empty local part
  if (parts.length !== 2 || !parts[0]) {
    return { valid: false, reason: "Invalid email format" };
  }

  const domain = parts[1];

  if (!trustedDomains.includes(domain)) {
    return { valid: false, reason: "Unrecognized or unsupported email domain" };
  }

  return { valid: true };
};