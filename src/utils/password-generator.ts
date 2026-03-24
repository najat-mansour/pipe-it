function getRandomChar(chars: string): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return chars.charAt(array[0] % chars.length);
}

export function generateRandomPassword(length: number = 10): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*";

  const allChars = lower + upper + numbers + special;

  const passwordArray: string[] = [
    getRandomChar(lower),
    getRandomChar(upper),
    getRandomChar(numbers),
    getRandomChar(special),
  ];

  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(getRandomChar(allChars));
  }

  return passwordArray.sort(() => Math.random() - 0.5).join("");
}
