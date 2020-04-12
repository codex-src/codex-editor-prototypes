import React from "react"
import useEditorState from "./useEditorState"

// Gets syntax from a string or an array of strings.
function getSyntax(syntax) {
	let s1 = ""
	let s2 = ""
	if (syntax === null) {
		// No-op; defer to end
	} else if (typeof syntax === "string") {
		s1 = syntax
		s2 = syntax
	} else if (Array.isArray(syntax)) {
		s1 = syntax[0]
		if (syntax.length === 2) {
			s2 = syntax[1]
		}
	}
	return [s1, s2]
}

const Syntax = props => {
	const [state] = useEditorState()
	if (!props.children || state.readOnly) {
		return null
	}
	// NOTE: props.className does **not** concatenate
	return <span className="text-md-blue-a400" {...props} />
}

const Markdown = ({ syntax, ...props }) => {
	const [s1, s2] = getSyntax(syntax)
	return (
		<React.Fragment>

			{/* LHS */}
			<Syntax {...props}>
				{s1}
			</Syntax>

			{/* RHS */}
			{props.children}
			<Syntax {...props}>
				{s2}
			</Syntax>

		</React.Fragment>
	)
}

export default Markdown
