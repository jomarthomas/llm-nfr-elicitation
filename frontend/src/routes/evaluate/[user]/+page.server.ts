import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const userName = params.user;
	if (userName === undefined || userName.length === 0) {
		throw redirect(307, '/?error=Unauthorized');
	}
	const validUsers = ['santhosh', 'jomar', 'nathalia'];
  
	if (!validUsers.includes(userName)) {
		throw redirect(307, '/?error=Unauthorized');
	}
};
