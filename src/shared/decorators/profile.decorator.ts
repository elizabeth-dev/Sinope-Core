import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Profile = createParamDecorator((
	data,
	ctx: ExecutionContext,
) => {
	const req = ctx.switchToHttp().getRequest();
	return req.query.profile;
});
