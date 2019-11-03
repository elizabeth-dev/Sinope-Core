import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { from, Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable()
export class CryptoService {
	constructor(private readonly config: ConfigService) {
	}

	public hash(password: string): Observable<string> {
		return from(bcrypt.hash(password, this.config.cryptoConfig.saltRounds));
	}

	public compareHash(
		password: string,
		hash: string,
	): Observable<boolean> {
		return from(bcrypt.compare(password, hash));
	}
}
