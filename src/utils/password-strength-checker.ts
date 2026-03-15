function containsUpperCase(str: string): boolean {
  return /[A-Z]/.test(str);
}

function containsLowerCase(str: string): boolean {
  return /[a-z]/.test(str);
}

function containsNumber(str: string): boolean {
  return /\d/.test(str);
}

function containsSpecialCharacter(str: string): boolean {
  return /[^\w\d]/.test(str);
}

function isAcceptableLength(str: string): boolean {
  const MAX_PASSWORD_LENGTH = 10;
  return str.length >= MAX_PASSWORD_LENGTH;
}

export function isStrongPassword(str: string): boolean {
  return (
    containsLowerCase(str) &&
    containsUpperCase(str) &&
    containsNumber(str) &&
    containsSpecialCharacter(str) &&
    isAcceptableLength(str)
  );
}
