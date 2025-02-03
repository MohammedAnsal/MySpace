export const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  console.log(`Generated Otp is :- ${otp} `);
  return otp;
};
