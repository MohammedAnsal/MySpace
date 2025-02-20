export const generateOtp = (): string => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  console.log(`Generated Otp is :- ${otp}`);
  return otp;
};
