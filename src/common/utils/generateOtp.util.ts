import { customAlphabet } from 'nanoid';
export const generateOTP = async () => {
  const otp = customAlphabet('0123456789', 6)();
  console.log(otp);
  return otp;
};
