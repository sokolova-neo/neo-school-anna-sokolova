import jsonwebtoken from 'jsonwebtoken';
import promisifyAll from 'util-promisifyall';

const jwt = promisifyAll(jsonwebtoken);

const encode = (payload: Record<string, unknown>, secret: string, expiresIn: string): Promise<string> => {
  return jwt.signAsync(payload, secret, { expiresIn });
};

export { encode };
