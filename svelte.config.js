import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter({
			pages: 'heart-beat', // output to the /heart-beat folder
			assets: 'heart-beat',
			fallback: null
		}),
		paths: {
			base: dev ? '' : '/hlavac-zije', // github repo name
		}

	},
	extensions: ['.svelte', '.svx']
};

export default config;
