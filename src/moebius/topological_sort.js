/*jslint node: true */
'use strict';

module.exports = function topological_sort(nodes, edges) {
	let result = [],
		starting_nodes = nodes.filter(has_no_incoming_edge);

	while (starting_nodes.length) {
		let node = starting_nodes.pop();
		result.push(node);
		for (let m of nodes) {
			let edge = get_edge(node, m);
			if (edge) {
				edges.splice(edges.indexOf(edge), 1);
				if (has_no_incoming_edge(m))
					starting_nodes.push(m);
			}
		} 
	}
	if (edges.length) {
		throw new Error('not a directed acyclic graph');
	} 
	return result;

	function get_edge(e, f) {
		for (let edge of edges) {
			if (edge.from === e && edge.to === f) return edge;
		}
		return false;
	}

	function has_no_incoming_edge(e) {
		for (let edge of edges) {
			if (edge.to === e) return false;
		}
		return true;
	}
};
