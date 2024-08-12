import { z } from 'zod';
import { dev } from '$app/environment';

// const publicKeyStartsWith = dev ? 'pk_' : 'pk_live_';
const secretKeyStartsWith = dev ? 'sk_' : 'sk_live_';

// Name has a default value just to display something in the form.
export const schema = z.object({
	id: z.string().optional(),
	secretKey: z.string().startsWith(secretKeyStartsWith, {
		message: `Secret key must start with ${secretKeyStartsWith}`
	})
});
