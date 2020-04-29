import React from "react"

// NOTE: Shadows browser API
export const Node = React.forwardRef(({ id, tag, style, ...props }, ref) => (
	React.createElement(tag || "div", {
		ref,
		id,
		"style": {
			// NOTE: white-space: pre-wrap is needed because of
			// contenteditable
			whiteSpace: "pre-wrap", // Takes precedence (because of <Pre>)
			...style,
		},
		"data-codex-node": true,
		...props,
	})
))

export const Root = React.forwardRef(({ id, tag, style, ...props }, ref) => (
	React.createElement(tag || "div", {
		ref,
		id,
		"style": {
			// NOTE: white-space: pre-wrap is needed because of
			// contenteditable
			whiteSpace: "pre-wrap", // Takes precedence (because of <Pre>)
			...style,
		},
		"data-codex-root": true,
		...props,
	})
))