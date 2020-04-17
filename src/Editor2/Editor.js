// import actions from "./actions"
// import computePosRange from "./computePosRange"
// import extendPosRange from "./extendPosRange"
// import keyCodes from "./keyCodes"
// import parse from "./parser"
// import queryRoots from "./queryRoots"
// import readRoots from "./readRoots"
// import syncPos from "./syncPos"
import attrs from "./attrs"
import EditorContext from "./EditorContext"
import React from "react"
import ReactDOM from "react-dom"
import syncTrees from "./syncTrees"
import typeMap from "./typeMap"

import "./Editor.css"

const DEBUG_MODE = true && process.env.NODE_ENV !== "production"

// TODO: Add React.memo?
const ReactEditor = ({ state, dispatch }) => {
	const { Provider } = EditorContext
	return (
		<Provider value={[state, dispatch]}>
			{state.reactVDOM.map(({ type: T, ...each }) => (
				React.createElement(typeMap[T], {
					key: each.id,
					...each,
				})
			))}
		</Provider>
	)
}

// function shouldRenderPos(state) {
// 	const ok = (
// 		state.focused &&
// 		!state.readOnly
// 	)
// 	return ok
// }

// ;(() => {
// 	document.body.classList.toggle("debug-css")
// })()

const Editor = ({ tag, id, className, style, state, dispatch, readOnly }) => {
	const ref = React.useRef()

	const pointerDownRef = React.useRef()

	// Registers props.
	React.useLayoutEffect(() => {
		dispatch.registerProps(readOnly)
	}, [readOnly, dispatch])

	// Renders to the DOM.
	const mounted = React.useRef()
	React.useLayoutEffect(
		React.useCallback(() => {
			ReactDOM.render(<ReactEditor state={state} dispatch={dispatch} />, state.reactDOM, () => {
				// Sync user-managed DOM to the React-managed DOM:
				const mutations = syncTrees(state.reactDOM, ref.current)
				if (!mounted.current) { // || !shouldRenderPos(state)) {
					mounted.current = true
					return
				}
				if (mutations) {
					const s = !mutations ? "" : "s"
					console.log(`syncTrees: ${mutations} mutation${s}`)
				}
				// // Sync DOM cursors to the VDOM cursors:
				// const syncedPos = syncPos(ref.current, [state.pos1, state.pos2])
				// if (syncedPos) {
				// 	console.log("syncPos")
				// }
				// // Update extendedPosRange for edge-cases such as
				// // forward-backspace:
				// const [pos1, pos2] = computePosRange(ref.current)
				// const extendedPosRange = extendPosRange(state, [pos1, pos2])
				// setState(current => ({ ...current, pos1, pos2, extendedPosRange }))
			})
		}, [state, dispatch]),
		[
			state.reactVDOM,
			state.readOnly,
		],
	)

	return (
		<div>

			{React.createElement(
				tag || "div",
				{
					ref,

					id,

					className:
						`codex-editor${
							!className ? "" : ` ${className}`
						}${
							!state.readOnly ? "" : " feature-read-only"
						}`,

					style: {
						...style, // Takes precedence
						...attrs.contenteditable,
					},

					onFocus: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						dispatch.focus()
					},
					onBlur:  () => {
						if (state.readOnly) {
							// No-op
							return
						}
						dispatch.blur()
					},

					onSelect: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						// Guard out of bounds range:
						const selection = document.getSelection()
						if (!selection.rangeCount) {
							// No-op
							return
						}
						const range = selection.getRangeAt(0)
						if (range.startContainer === ref.current || range.endContainer === ref.current) {
							// Iterate to the deepest start node:
							let startNode = ref.current.childNodes[0]
							while (startNode.childNodes.length) {
								startNode = startNode.childNodes[0]
							}
							// Iterate to the deepest end node:
							let endNode = ref.current.childNodes[ref.current.childNodes.length - 1]
							while (endNode.childNodes.length) {
								endNode = endNode.childNodes[endNode.childNodes.length - 1]
							}
							// Correct range:
							range.setStart(startNode, 0)
							range.setEnd(endNode, (endNode.nodeValue || "").length)
							selection.removeAllRanges()
							selection.addRange(range)
						}
						// const [pos1, pos2] = computePosRange(ref.current)
						// const extendedPosRange = extendPosRange(state, [pos1, pos2])
						// setState(current => ({ ...current, pos1, pos2, extendedPosRange }))
					},

					onPointerDown: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						pointerDownRef.current = true
					},
					onPointerMove: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						// Editor must be focused and pointer must be down:
						if (!state.focused || !pointerDownRef.current) {
							pointerDownRef.current = false // Reset to be safe
							return
						}
						// const [pos1, pos2] = computePosRange(ref.current)
						// const extendedPosRange = extendPosRange(state, [pos1, pos2])
						// setState(current => ({ ...current, pos1, pos2, extendedPosRange }))
					},
					onPointerUp: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						pointerDownRef.current = false
					},

					onKeyDown: e => {
						if (state.readOnly) {
							// No-op
							return
						}
						// TODO
					},

					// TODO: onCompositionEnd
					onInput: () => {
						if (state.readOnly) {
							// No-op
							return
						}
						// // Force re-render when empty:
						// if (!ref.current.childNodes.length) {
						// 	setState(current => ({
						// 		...current,
						// 		data: [...state.data],
						// 	}))
						// 	return
						// }
						// const { roots: [root1, root2], root2AtEnd } = queryRoots(ref.current, state.extendedPosRange)
						// const x1 = state.data.findIndex(each => each.id === root1.id)
						// if (x1 === -1) {
						// 	throw new Error("onInput: x1 out of bounds")
						// }
						// const x2 = !root2AtEnd ? state.data.findIndex(each => each.id === root2.id) : state.data.length - 1
						// if (x2 === -1) {
						// 	throw new Error("onInput: x2 out of bounds")
						// }
						// const unparsed = readRoots(ref.current, [root1, root2])
						// const data = [...state.data.slice(0, x1), ...parse(unparsed), ...state.data.slice(x2 + 1)]
						// const [pos1, pos2] = computePosRange(ref.current)
						//
						// // // Correct pos1 (when out of bounds):
						// // const p1 = data.findIndex(each => each.id === pos1.root.id)
						// // if (p1 >= 0 && p1 + 1 < data.length && pos1.root.offset > data[p1].raw.length) {
						// // 	pos1.root.id = data[p1 + 1].id
						// // 	pos1.root.offset = pos1.node.offset
						// // }
						// // // Correct pos2 (when out of bounds):
						// // const p2 = data.findIndex(each => each.id === pos2.root.id)
						// // if (p2 >= 0 && p2 + 1 < data.length && pos2.root.offset > data[p2].raw.length) {
						// // 	pos2.root.id = data[p2 + 1].id
						// // 	pos2.root.offset = pos2.node.offset
						// // }
						//
						// setState(current => ({
						// 	...current,
						// 	data: [...state.data.slice(0, x1), ...parse(unparsed), ...state.data.slice(x2 + 1)],
						// 	pos1,
						// 	pos2,
						// 	// NOTE: Do not extendPosRange here; defer to
						// 	// useLayoutEffect
						// }))
					},

					contentEditable: !state.readOnly,
					suppressContentEditableWarning: !state.readOnly,
				},
			)}

			{DEBUG_MODE && (
				<div className="py-6 whitespace-pre-wrap font-mono text-xs leading-snug" style={{ tabSize: 2 }}>
					{JSON.stringify(
						{
							// extendedPosRange: state.extendedPosRange,
							// id: state.data.map(each => each.id),

							...state,
							reactVDOM: undefined,
							reactDOM: undefined,
						},
						null,
						"\t",
					)}
				</div>
			)}

		</div>
	)
}

export default Editor
