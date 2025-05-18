import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashUtil {
  // 해싱
   async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  // 비밀번호 비교
   async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
