import bcrypt from "bcryptjs";

const passwordCompareSync = (loginPassword, hashPassword) =>
  bcrypt.compareSync(loginPassword, hashPassword);

export default passwordCompareSync;
