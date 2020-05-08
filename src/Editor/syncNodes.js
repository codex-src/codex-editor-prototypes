// Replaces attributes (on element dst). Non-overlapping
// attributes are removed. Returns whether an attribute was
// replaced or removed.
export function replaceAttributes(src, dst) {
	const attrKeys = new Set()
	for (const attr of [...src.attributes, ...dst.attributes]) {
		attrKeys.add(attr.nodeName)
	}
	let replaced = false
	for (const key of attrKeys) {
		const value = src.getAttribute(key)
		if (value === null || value === dst.getAttribute(key)) {
			if (value === null) {
				dst.removeAttribute(key)
				replaced = true
			}
			// No-op
			continue
		}
		dst.setAttribute(key, value)
		replaced = true
	}
	return replaced
}

// Shallowly syncs two nodes. Propagates isEqualNode.
export function shallowlySyncNodes(src, dst) {
	if (dst.isEqualNode(src)) {
		return true
	}
	// Text handling:
	if (src.nodeType === Node.TEXT_NODE && src.nodeType === dst.nodeType) {
		dst.nodeValue = src.nodeValue
		return true
	// Element handling (elements must be the same type):
	} else if (src.nodeType === Node.ELEMENT_NODE && src.nodeType === dst.nodeType && src.nodeName === dst.nodeName) {
		// Did not replace; cannot be assumed to be the same:
		if (!replaceAttributes(src, dst)) {
			return false
		}
		// Did replace:
		return dst.isEqualNode(src)
	}
	// Text-to-element and element-to-text handling:
	const clonedNode = src.cloneNode(true)
	dst.replaceWith(clonedNode)
	return true
}

// Deeply syncs two nodes. Note that the ancestor nodes are
// not synced. Returns an array of the synced nodes.
//
// TODO: Reduce mutations from 2 to 1 for the 90% case
//
// Hello, world!<enter>
// - Hello, world! <- Rerenders
//
export function deeplySyncNodes(src, dst, __recursion = 0) {
	const syncedNodes = []

	if (__recursion && shallowlySyncNodes(src, dst)) {
		return syncedNodes
	}
	// Iterate forwards:
	let x = 0
	const min = Math.min(src.childNodes.length, dst.childNodes.length)
	for (; x < min; x++) {
		if (!dst.childNodes[x].isEqualNode(src.childNodes[x])) { // FIXME?
			deeplySyncNodes(src.childNodes[x], dst.childNodes[x], __recursion + 1)
			syncedNodes.push(dst.childNodes[x])
			x++ // Eagerly increment (because of break)
			break
		}
	}
	// Iterate backwards:
	let srcEnd = src.childNodes.length
	let dstEnd = dst.childNodes.length
	for (; srcEnd > x && dstEnd > x; srcEnd--, dstEnd--) {
		if (!dst.childNodes[dstEnd - 1].isEqualNode(src.childNodes[srcEnd - 1])) { // FIXME?
			deeplySyncNodes(src.childNodes[srcEnd - 1], dst.childNodes[dstEnd - 1], __recursion + 1)
			syncedNodes.push(dst.childNodes[dstEnd - 1])
		}
	}
	// Append extraneous nodes (forwards):
	if (x < srcEnd) {
		for (; x < srcEnd; x++) {
			const clonedNode = src.childNodes[x].cloneNode(true)
			syncedNodes.push(clonedNode)
			if (x >= dst.childNodes.length) {
				dst.appendChild(clonedNode)
				continue
			}
			dst.insertBefore(clonedNode, dst.childNodes[x])
		}
	// Remove extraneous nodes (backwards):
	} else if (x < dstEnd) {
		for (; x < dstEnd; dstEnd--) {
			dst.childNodes[dstEnd - 1].remove()
		}
	}
	return syncedNodes
}