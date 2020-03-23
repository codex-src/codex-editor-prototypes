import React from "react"
import uuidv4 from "uuid/v4"

import "./AppRichText.css"

const Markdown = ({ syntax, ...props }) => {
	let start = ""
	let end = ""
	if (typeof syntax === "string") {
		start = syntax
		end = syntax
	} else if (Array.isArray(syntax)) {
		;[start, end] = syntax
	}

	return (
		<React.Fragment>
			{start && (
				<span className="text-md-blue-a400">
					{start}
				</span>
			)}
			{props.children}
			{end && (
				<span className="text-md-blue-a400">
					{end}
				</span>
			)}
		</React.Fragment>
	)
}

const Em = ({ syntax, ...props }) => (
	<span className="italic">
		<Markdown syntax={syntax || console.error("Em: syntax={syntax} must be set")}>
			{props.children}
		</Markdown>
	</span>
)

const Strong = ({ syntax, ...props }) => (
	<span className="font-bold">
		<Markdown syntax={syntax || console.error("Strong: syntax={syntax} must be set")}>
			{props.children}
		</Markdown>
	</span>
)

const Header = ({ id, syntax, ...props }) => (
	<div id={id} className="font-medium text-4xl">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)
const Subheader = ({ id, syntax, ...props }) => (
	<div id={id} className="font-medium text-2xl">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)
const H3 = ({ id, syntax, ...props }) => (
	<div id={id} className="font-semibold text-xl">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)
const H4 = ({ id, syntax, ...props }) => (
	<div id={id} className="font-semibold text-lg">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)
const H5 = ({ id, syntax, ...props }) => (
	<div id={id} className="font-semibold">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)
const H6 = ({ id, syntax, ...props }) => (
	<div id={id} className="font-semibold">
		<Markdown syntax={syntax}>
			{props.children}
		</Markdown>
	</div>
)

const Paragraph = ({ id, ...props }) => (
	<div id={id}>
		{props.children || (
			<br />
		)}
	</div>
)

const data = [
	{
		id: uuidv4(),
		component: Header,
		syntax: ["# "],
		children: "This is a header",
	},
	{
		id: uuidv4(),
		component: Subheader,
		syntax: ["## "],
		children: "This is a subheader",
	},
	{
		id: uuidv4(),
		component: H3,
		syntax: ["### "],
		children: "H3",
	},
	{
		id: uuidv4(),
		component: H4,
		syntax: ["#### "],
		children: "H4",
	},
	{
		id: uuidv4(),
		component: H5,
		syntax: ["##### "],
		children: "H5",
	},
	{
		id: uuidv4(),
		component: H6,
		syntax: ["###### "],
		children: "H6",
	},
	{
		id: uuidv4(),
		component: Paragraph,
		syntax: null,
		children: null,
	},
	{
		id: uuidv4(),
		component: Paragraph,
		syntax: null,
		children: [
			{
				component: Em,
				syntax: "_",
				children: [
					"em ",
					{
						component: Strong,
						syntax: "**",
						children: "and",
					},
				],
			},
			" ",
			{
				component: Strong,
				syntax: "**",
				children: "strong",
			},
		],
	},
	{
		id: uuidv4(),
		component: Paragraph,
		syntax: null,
		children: null,
	},
	{
		id: uuidv4(),
		component: Paragraph,
		syntax: null,
		children: [
			{
				component: Em,
				syntax: "_",
				children: "em",
			},
			" ",
			{
				component: Strong,
				syntax: "**",
				children: [
					{
						component: Em,
						syntax: "_",
						children: "and",
					},
					" strong",
				],
			},
		],
	},
]

// Parses component children objects into renderable React
// components.
function parseReact(children) {
	if (children === null || typeof children === "string") {
		return children
	}
	const components = []
	for (const each of children) {
		if (each === null || typeof each === "string") {
			components.push(each)
			continue
		}
		const { component: Component } = each
		components.push((
			<Component key={components.length} syntax={each.syntax}>
				{parseReact(each.children)}
			</Component>
		))
	}
	return components
}

// function parseVDOM(markdown) {
// 	const body = markdown.split("\n")
//
// 	const data = []
// 	for (let index = 0; index < body.length; index++) {
//
// 	}
// 	return data
// }

// Converts a data structure to plain text (GitHub Flavored
// Markdown is an option).
function convertToText(data, { gfm }) {
	let result = ""
	const recurse = children => {
		if (children === null || typeof children === "string") {
			result += children || ""
			return
		}
		for (const each of children) {
			if (each === null || typeof each === "string") {
				result += each || ""
				continue
			}
			result += (gfm && each.syntax) || ""
			recurse(each.children)
			result += (gfm && each.syntax) || ""
		}
	}
	for (const each of data) {
		// (Code based on <Markdown>)
		const { syntax } = each
		let start = ""
		let end = ""
		if (typeof syntax === "string") {
			start = syntax
			end = syntax
		} else if (Array.isArray(syntax)) {
			;[start, end] = syntax
		}
		result += (gfm && start) || ""
		recurse(each.children)
		result += (gfm && end) || ""
		if (each !== data[data.length - 1]) {
			result += "\n" // EOL
		}
	}
	return result
}

// Renders an editor.
const Editor = props => {
	const text = convertToText(data, { gfm: false })
	const markdown = convertToText(data, { gfm: true })

	return (
		<div className="text-lg">

			{/* Blocks */}
			{data.map(({ component: Component, ...each }) => (
				<Component key={each.id} id={each.id} syntax={each.syntax}>
					{parseReact(each.children)}
				</Component>
			))}

			{/* Debugger */}
			<div className="py-6 whitespace-pre-wrap font-mono text-xs" style={{ tabSize: 2 }}>
				{JSON.stringify({
					text,
					markdown,
					charCount: [...text].length,
					wordCount: text.split(/\s+/).filter(Boolean).length,
					data,
				}, null, "\t")}
			</div>

		</div>
	)
}

const App = props => (
	<div className="flex flex-row justify-center">
		<div className="py-32 w-full max-w-3xl">
			<Editor />
		</div>
	</div>
)

export default App
