import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

const compare = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => {
  const hash = createHash('sha256').update(value).digest('hex');
  return await bcrypt.compare(hash, hashedValue);
};

const hash = async (value: string, salt: number = 10): Promise<string> => {
  const hash = sha256(value);
  return await bcrypt.hash(hash, salt);
};

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export default {compare, hash, sha256}