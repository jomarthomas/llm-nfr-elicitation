import adapter from '@sveltejs/adapter-auto';
import autoprefixer from 'autoprefixer';
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: sveltePreprocess({
		scss: {
			prependData: `
				@use "src/styles/root/_mixins.scss" as *;
			`,
		},
		postcss: {
			plugins: [autoprefixer()]
		}
	}),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$data: 'src/data',
			$utils: 'src/utils',
			$types: 'src/types',
			$styles: 'src/styles/routes',
			$components: 'src/components',
		},
	},
	compilerOptions: {
		runes: true
	}
};

export default config;
