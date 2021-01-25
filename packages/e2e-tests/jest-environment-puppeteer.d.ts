declare module 'jest-environment-puppeteer' {
	export interface JestConfig {
		watch: boolean;
		watchAll: boolean;
	}

	type Default = {
		setup( jestConfig: JestConfig ): Promise< void >;
	};

	declare const m: Default;

	export = m;
}
