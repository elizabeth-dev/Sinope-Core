import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Profile = createParamDecorator((
	data,
	req: Request,
) => {
	return req.query.profile;
});
