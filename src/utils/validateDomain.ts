export function validateDomain(
  email: string,
  allowedDomains: string | undefined,
) {
  // If no domains are specified, allow all domains
  if (!allowedDomains) {
    return true;
  }

  const domains = allowedDomains.split(",").map((domain) => domain.trim());
  const emailDomain = email.split("@")[1];

  return domains.includes(emailDomain);
}
