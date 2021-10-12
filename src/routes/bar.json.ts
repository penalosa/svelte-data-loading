let name = '';

export async function get() {
	return {
		status: 200,
		body: {
			name
		}
	};
}
export async function put({ body, headers }) {
	name = body.name;
	return {
		status: 200,
		body: { name },
		headers: {
			'Mark-Changed': '/bar.json'
		}
	};
}
export async function del({ headers }) {
	name = '';
	return {
		status: 200,
		body: { name: '' },
		headers: {
			'Mark-Changed': '/bar.json'
		}
	};
}
