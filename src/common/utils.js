/*jslint node: true */
'use strict';

// convert x to a string a add as many characters char 
// as needed to make sure the result length is equal to n
function pad_left (x, char, n) {
	let result = String(x);
	while (result.length < n) {
		result = char + result;
	}
	return result;
}

function extend (obj, prop) {
	for (let p in prop) {
		obj[p] = prop[p];
	}
	return obj;
}

function pad (x) {
	return pad_left(x, 0, 2);
}

function getTimeStamp() {
    let now = new Date(),
        hours = pad(now.getHours()),
        minutes = pad(now.getMinutes()),
        seconds = pad(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

function topological_sort(nodes, edges) {
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
}


module.exports = {
	pad_left: pad_left,
	pad: pad,
	extend: extend,
	getTimeStamp: getTimeStamp,
	topological_sort: topological_sort,
};