export async function get() {
	return {
		status: 200,
		body: {
			name: 'foo'
		}
	};
}
export async function post({ body, headers }) {
	return {
		status: 200,
		body: { color: 'blue' }
	};
}
