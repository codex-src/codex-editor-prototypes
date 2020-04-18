// import raw from "raw.macro"
import * as cmap from "Editor2/cmap"
import Button from "Button"
import Editor from "Editor2/Editor"
import Enum from "Enum"
import keyCodes from "Editor2/keyCodes"
import React from "react"
import Transition from "Transition"
import useEditor from "Editor2/useEditor"

import "./App.css"

const LOCALSTORAGE_KEY = "codex-app-v2.3"

const renderModesEnum = new Enum(
	"None",
	// "Text",
	// "GFM",
	"JSON",
	"HTML",
	"HTML__BEM",
	// "Alpine_js",
	// "Angular_js",
	"React_js",
	// "Svelte_js",
	// "Vue_js",
)

// Read from localStorage:
// const data = (() => {
// 	const cache = localStorage.getItem(LOCALSTORAGE_KEY)
// 	if (!cache) {
// 		return raw("./App.md")
// 	}
// 	const json = JSON.parse(cache)
// 	if (!json.data) {
// 		return raw("./App.md")
// 	}
// 	return json.data
// })()

const data = `I seriously agree with this article. I find TypeScript to be a kind of exchange of productivity for correctness, which, to be honest, in the real-world is less practical. Think about it this way — would you rather have end-to-end tests that test your production-ready application or TypeScript complain in development? Think carefully, because the answer is not obvious. **TypeScript takes time to get right. A lot of time. This is time you could be testing your application _in the wild_, rather than testing its correctness in development.** Yes, there _is_ some crossover here, but it’s not 100%. When you use TypeScript, you are **betting on TypeScript** helping you more than hurting you.

What I’m trying to say is that TypeScript is a _very steep bet_. But something about this is unsettling — Go is not dynamic, and I find writing Go to be easier than TypeScript, so what gives? I actually think the crux of the problem is that TypeScript is trying to fix JavaScript. _But what if JavaScript doesn’t need fixing?_ Then TypeScript actually doesn’t pay for itself. I say all of this as a cautionary tale for developers. I’ve been turned on and off multiple times by TypeScript. Ultimately, I think that some languages introduce so much complexity up front that if you try to wrangle them in later, you’re optimizing for the wrong problem.

I’m sure some of you will say that TypeScript makes you more productive, and if you are one of these people, that’s great. But I found I ran into similar problems as Lucas — TypeScript’s documentation and error messages are far from friendly, and TypeScript as a system starts to break down the more complexity you introduce into your app, e.g. recursive types, etc. I’m having bugs where my IDE and app don’t even agree. And I simply don’t have the time to find the root cause of every problem I run into, because most of these problems are concerned with correctness.`

const Settings = ({ renderState, setRenderState }) => (
	<div className="-m-1 flex flex-row pointer-events-auto">
		<Button
			className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
			onClick={e => setRenderState({
				...renderState,
				show: true,
				renderMode: renderModesEnum.JSON,
			})}
		>
			JSON
		</Button>
		<Button
			className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
			onClick={e => setRenderState({
				...renderState,
				show: true,
				renderMode: renderModesEnum.HTML,
			})}
		>
			HTML
		</Button>
		<Button
			className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
			onClick={e => setRenderState({
				...renderState,
				show: true,
				renderMode: renderModesEnum.HTML__BEM,
			})}
		>
			HTML__BEM
		</Button>
		<Button
			className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
			onClick={e => setRenderState({
				...renderState,
				show: true,
				renderMode: renderModesEnum.React_js,
			})}
		>
			React
		</Button>
		<Button
			className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
			onClick={e => setRenderState({
				...renderState,
				show: false,
			})}
		>
			Hide UI
		</Button>
	</div>
)

// const [renderMode, setRenderMode] = React.useState(renderModesEnum.None)

const App = () => {
	// const [state, dispatch] = useEditor(`> Hello\n`)
	const [state, dispatch] = useEditor(data)

	const [renderState, setRenderState] = React.useState(() => ({
		show: false,
		renderMode: renderModesEnum.JSON,
		[renderModesEnum.JSON]: "",
		[renderModesEnum.HTML]: "",
		[renderModesEnum.HTML__BEM]: "",
		[renderModesEnum.React]: "",
	}))

	// Write to localStorage:
	React.useEffect(() => {
		const id = setTimeout(() => {
			const json = JSON.stringify({ data: state.data })
			localStorage.setItem(LOCALSTORAGE_KEY, json)
		}, 100)
		return () => {
			clearTimeout(id)
		}
	}, [state.data])

	// {JSON.stringify(
	// 	{
	// 		renderMode, // Takes precedence
	// 		...state,
	// 		data:      undefined,
	// 		reactVDOM: undefined,
	// 		reactDOM:  undefined,
	// 	},
	// 	null,
	// 	"\t",
	// )}

	React.useEffect(
		React.useCallback(() => {
			const id = setTimeout(() => {
				setRenderState(current => ({
					...current,
					[renderModesEnum.JSON]: JSON.stringify(
						{
							renderMode: renderState.renderMode, // Takes precedence
							...state,
							data:      undefined,
							reactVDOM: undefined,
							reactDOM:  undefined,
						},
						null,
						"\t",
					),
					[renderModesEnum.HTML]:      cmap.toHTML(state.reactVDOM),
					[renderModesEnum.HTML__BEM]: cmap.toHTML__BEM(state.reactVDOM),
					[renderModesEnum.React_js]:  cmap.toReact_js(state.reactVDOM),
				}))
			}, 100)
			return () => {
				clearTimeout(id)
			}
		}, [state, renderState]),
		[state],
	)

	// Binds read-only shortcut (command-p).
	React.useEffect(
		React.useCallback(() => {
			// if (state.readOnly) {
			// 	// No-op
			// 	return
			// }
			const handler = e => {
				if (!e.metaKey || e.keyCode !== keyCodes.P) {
					// No-op
					return
				}
				e.preventDefault()
				dispatch.toggleReadOnly()
			}
			document.addEventListener("keydown", handler)
			return () => {
				document.removeEventListener("keydown", handler)
			}
		}, [dispatch]),
		[state.readOnly],
	)

	return (
		<div className="py-32 flex flex-row justify-center">
			<div className="px-6 w-full max-w-screen-md">

				<div className="p-3 fixed inset-0 z-30 pointer-events-none">
					<div className="flex flex-col items-end">
						<Settings
							renderState={renderState}
							setRenderState={setRenderState}
						/>
						<div className="h-6" />
						<Transition
							show={renderState.show}
							enter="transition ease-out duration-300"
							enterFrom="transform opacity-0 translate-x-64"
							enterTo="transform opacity-100 translate-x-0"
							leave="transition ease-in duration-300"
							leaveFrom="transform opacity-100 translate-x-0"
							leaveTo="transform opacity-0 translate-x-64"
						>
							<div className="p-6 w-full max-w-lg h-full bg-white rounded-lg shadow-hero-lg overflow-y-scroll scrolling-touch pointer-events-auto" style={{ maxHeight: "36em" }}>
								<pre className="whitespace-pre-wrap font-mono text-xs leading-snug subpixel-antialiased" style={{ MozTabSize: 2, tabSize: 2 }}>
									{/* JSON */}
									{renderState.renderMode === renderModesEnum.JSON && (
										renderState[renderModesEnum.JSON]
									)}
									{/* HTML */}
									{renderState.renderMode === renderModesEnum.HTML && (
										renderState[renderModesEnum.HTML]
									)}
									{/* HTML__BEM */}
									{renderState.renderMode === renderModesEnum.HTML__BEM && (
										renderState[renderModesEnum.HTML__BEM]
									)}
									{/* React_js */}
									{renderState.renderMode === renderModesEnum.React_js && (
										renderState[renderModesEnum.React_js]
									)}
								</pre>
							</div>
						</Transition>
					</div>
				</div>

				<Editor
					style={{ fontSize: 17 }}
					state={state}
					dispatch={dispatch}
					// readOnly
				/>

			</div>
		</div>
	)
}

// import Button from "./Button"
// import React from "react"
// import RenderModes from "./Editor/RenderModes"
//
// const Settings = ({ state, setState, ...props }) => (
// 	<div className="flex flex-col items-end">
//
// 		{/* Top */}
// 		<div className="-m-1 flex flex-row">
// 			<Button
// 				className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 				onClick={e => setState({
// 					...state,
// 					renderMode: RenderModes.Text,
// 				})}
// 			>
// 				Plain text
// 			</Button>
// 			<Button
// 				className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 				onClick={e => setState({
// 					...state,
// 					renderMode: RenderModes.GFM,
// 				})}
// 			>
// 				Markdown
// 			</Button>
// 			<Button
// 				className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 				onClick={e => setState({
// 					...state,
// 					renderMode: RenderModes.HTML,
// 				})}
// 			>
// 				HTML
// 			</Button>
// 			<Button
// 				className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 				onClick={e => setState({
// 					...state,
// 					renderMode: RenderModes.HTML__BEM,
// 				})}
// 			>
// 				HTML and BEM classes
// 			</Button>
// 			<Button
// 				className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 				onClick={e => setState({
// 					...state,
// 					renderMode: RenderModes.React_js,
// 				})}
// 			>
// 				React (JSX)
// 			</Button>
// 		</div>
//
// 		{/* Bottom */}
// 		<div className="h-2" />
// 		<div className="-m-1 flex flex-row">
// 			{state.renderMode === RenderModes.GFM && (
// 				<React.Fragment>
// 					<Button
// 						className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 						onClick={e => setState({
// 							...state,
// 							readOnly: !state.readOnly,
// 						})}
// 					>
// 						Toggle readOnly: {String(state.readOnly)}
// 					</Button>
// 					<Button
// 						className="m-1 px-3 py-2 bg-white hover:bg-gray-100 rounded-lg shadow transition duration-75"
// 						onClick={e => setState({
// 							...state,
// 							debugCSS: !state.debugCSS,
// 						})}
// 					>
// 						Toggle debugCSS: {String(state.debugCSS)}
// 					</Button>
// 				</React.Fragment>
// 			)}
// 		</div>
//
// 	</div>
// )
//
// export default Settings

export default App
