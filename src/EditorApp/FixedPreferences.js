import Button from "lib/Button"
import Highlighted from "./Highlighted"
import React from "react"
import ReadmeEditor from "./ReadmeEditor"
import renderModesEnum from "./Preferences/renderModesEnum"
import Transition from "lib/Transition"

function useScrollY() {
	const [scrollY, setScrollY] = React.useState(() => window.scrollY)

	React.useEffect(() => {
		const handler = e => {
			setScrollY(window.scrollY)
		}
		handler()
		window.addEventListener("scroll", handler, false)
		return () => {
			window.removeEventListener("scroll", handler, false)
		}
	}, [])

	return [scrollY, setScrollY]
}

const FixedPreferences = ({
	prefsTuple: [prefs, prefsDispatch],
	showOutlineTuple: [showOutline, setShowOutline],
	saveStatus,
}) => {

	const [scrollY] = useScrollY()

	return (
		// NOTE: Use flex flex-col for the sidebar
		<div className="p-4 pt-0 fixed inset-0 flex flex-col z-40 pointer-events-none">

			{/* Preferences */}
			<Transition
				// NOTE: Use duration-200 not duration-300 and omit
				// transition-timing-function
				unmountOnExit={false}
				show={scrollY > 0}
				enter="transition duration-200"
				enterFrom="bg-transparent shadow-none"
				enterTo="bg-white shadow-hero"
				leave="transition duration-200"
				leaveFrom="bg-white shadow-hero"
				leaveTo="bg-transparent shadow-none"
			>
				<div className="-mx-4 px-2 relative flex-shrink-0 flex flex-row justify-between">

					{/* LHS */}
					<div className="flex-shrink-0 flex flex-row pointer-events-auto">
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={() => setShowOutline(!showOutline)}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M4 6h16M4 12h16M4 18h7"></path>
							</svg>
							Toggle Outline
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.zoomOut}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
							</svg>
							Zoom Out
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.zoomIn}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
							</svg>
							Zoom In
						</Button>
						<div
							className="p-2 flex flex-row items-center font-medium text-xxs transition duration-300"
							style={{ opacity: !saveStatus || saveStatus === 3 ? "0" : "1" }}
						>
							Saved
							<svg
								className="ml-1 w-4 h-4 text-green-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="3"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
					</div>

					{/* RHS */}
					<div className="flex-shrink-0 flex flex-row pointer-events-auto">
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.toggleReadOnly}
						>
							{!prefs.readOnly ? (
								<svg
									className="mr-2 w-4 h-4 text-gray-500"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
								</svg>
							) : (
								<svg
									className="mr-2 w-4 h-4 text-gray-500"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" fillRule="evenodd"></path>
								</svg>
							)}
							Preview ({navigator.userAgent.indexOf("Mac OS X") === -1 ? "Control-" : "⌘"}P)
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.showReadme}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
							</svg>
							Readme (Esc)
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.showHTML}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
							</svg>
							HTML
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.showReact_js}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
							</svg>
							JSX
						</Button>
						<Button
							className="p-2 flex flex-row items-center font-medium text-xxs"
							onClick={prefsDispatch.showJSON}
						>
							<svg
								className="mr-2 w-4 h-4 text-gray-500"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
							</svg>
							JSON
						</Button>
					</div>

				</div>
			</Transition>

			{/* Sidebar */}
			<div className="flex-shrink-0 h-4" />
			<Transition
				show={prefs.showSidebar}
				enter="transition ease-out duration-300"
				enterFrom="transform opacity-0 translate-x-32"
				enterTo="transform opacity-100 translate-x-0"
				leave="transition ease-in duration-300"
				leaveFrom="transform opacity-100 translate-x-0"
				leaveTo="transform opacity-0 translate-x-32"
			>
				<div className="p-6 self-end w-full max-w-lg max-h-full bg-white rounded-lg shadow-hero-lg overflow-y-scroll scrolling-touch pointer-events-auto">
					{prefs.renderMode === renderModesEnum.Readme ? (
						<ReadmeEditor readOnly={prefs.readOnly} />
					) : (
						<span className="inline-block">
							<pre className="whitespace-pre font-mono text-xs leading-snug subpixel-antialiased" style={{ MozTabSize: 2, tabSize: 2 }}>
								<Highlighted extension={prefs.extension}>
									{prefs[prefs.renderMode]}
								</Highlighted>
							</pre>
						</span>
					)}
				</div>
			</Transition>

		</div>
	)
}

export default FixedPreferences
