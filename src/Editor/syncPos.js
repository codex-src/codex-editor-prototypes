import * as documentNodes from "./documentNodes"
import { newRange } from "./constructors"

// Computes a range data structure based on the DOM.
function computeDOMRange(root, pos) {
	const range = newRange()
	const recurse = on => {
		if (pos - (on.nodeValue || "").length <= 0) {
			Object.assign(range, {
				node: on,
				offset: pos,
			})
			return true
		}
		for (const each of on.childNodes) {
			if (recurse(each)) {
				return true
			}
			pos -= (each.nodeValue || "").length
			const next = each.nextElementSibling
			if (next && documentNodes.isNode(next)) {
				pos--
			}
		}
		return false
	}
	recurse(root)

	// FIXME:
	//
	// <ul data-codex-root>
	//   <li data-codex-node> <- to { node, offset: 2 }
	//     <div class="hidden">
	//       ... <- from { node, offset: 0 }
	//     </div>
	//     <br>
	//   </li>
	// </ul>
	//
	if (range.node.nodeType === Node.TEXT_NODE && range.node.parentElement.classList.contains("hidden")) {
		range.node = range.node.parentElement.parentElement
		range.offset = range.node.children.length - 1
	}

	return range
}

// Computes a meta DOM cursor; uses VDOM and DOM to compute.
function computeMetaRange(editorState, pos) {
	let id = ""
	for (const each of editorState.nodes) {
		if (pos - each.data.length <= 0) {
			id = each.id
			break
		}
		pos -= (each.data + "\n").length
	}
	const node = document.getElementById(id)
	if (!id || !node) {
		throw new Error(`computeMetaRange: could not query node (id=${id || "\"\""}`)
	}
	return computeDOMRange(node, pos)
}

// Synchronizes DOM cursors.
function syncPos(editorState, [pos1, pos2]) {
	const selection = document.getSelection()
	if (!selection || selection.rangeCount) {
		throw new Error("syncPos: selection exists when it should not")
	}
	const range1 = computeMetaRange(editorState, pos1.pos)
	let range2 = { ...range1 }
	if (!editorState.collapsed) {
		range2 = computeMetaRange(editorState, pos2.pos)
	}
	const range = document.createRange()
	range.setStart(range1.node, range1.offset)
	range.setEnd(range2.node, range2.offset)
	selection.addRange(range)
}

export default syncPos
