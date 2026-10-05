const fs = require('fs');
const file = 'src/client-viewer/src/containers/PlayerView/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace isFlipped with rotation
content = content.replace(
`	const [isFlipped, setIsFlipped] = useState(false);`,
`	const [rotation, setRotation] = useState(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);`
);

// Replace mousemove with click logic
const oldMouseLogic = `	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;
		const handleMouseMove = () => {
			setIsControlsVisible(true);
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				setIsControlsVisible(false);
			}, 2500);
		};
		window.addEventListener('mousemove', handleMouseMove);
		handleMouseMove();
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			clearTimeout(timeout);
		};
	}, []);`;
	
const newClickLogic = `	const handleScreenClick = useCallback(() => {
		setIsControlsVisible(true);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setIsControlsVisible(false);
		}, 3000);
	}, []);

	useEffect(() => {
		// trigger once on mount so it shows initially
		handleScreenClick();
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [handleScreenClick]);`;
	
content = content.replace(oldMouseLogic, newClickLogic);

// Add onClick to main wrapper
content = content.replace(
`<div
			style={{
				position: 'absolute',
				zIndex: 1,
				top: 0,
				left: 0,
				width: '100%',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
		>`,
`<div
			style={{
				position: 'absolute',
				zIndex: 1,
				top: 0,
				left: 0,
				width: '100%',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
			}}
			onClick={handleScreenClick}
		>`
);

// Remove onMouseEnter from control panel wrapper
content = content.replace(
`onMouseEnter={() => setIsControlsVisible(true)}`,
`onClick={(e) => e.stopPropagation()} // Prevent clicking the panel itself from bubbling if needed, but actually we WANT clicking the panel to keep it open, so we can do onClick={handleScreenClick} too.`
);

content = content.replace(
`onClick={(e) => e.stopPropagation()} // Prevent clicking the panel itself from bubbling if needed, but actually we WANT clicking the panel to keep it open, so we can do onClick={handleScreenClick} too.`,
`onClick={handleScreenClick}`
);

// Update PlayerControlPanel props
content = content.replace(
`					isFlipped={isFlipped}
					handleFlip={() => setIsFlipped(!isFlipped)}`,
`					rotation={rotation}
					handleRotate={() => setRotation((prev) => (prev + 90) % 360)}`
);

// Update wrapper transform
content = content.replace(
`transform: isFlipped ? 'scaleX(-1)' : 'none',`,
`transform: \`rotate(\${rotation}deg)\`,`
);

// Also need to make sure the wrapper rotates nicely. If width and height are swapped during rotation, object-fit should handle it, but sometimes it doesn't. We'll leave it as standard rotate for now.
content = content.replace(
`						transition: 'opacity 0.4s ease, transform 0.4s ease',`,
`						transition: 'opacity 0.4s ease, transform 0.4s ease',
						pointerEvents: isControlsVisible ? 'auto' : 'none',`
); // So we don't click invisible buttons

// wait, the player wrapper should have transition for rotation
content = content.replace(
`transform: \`rotate(\${rotation}deg)\`,`,
`transform: \`rotate(\${rotation}deg)\`,
						transition: 'transform 0.3s ease',`
);

fs.writeFileSync(file, content);
console.log('PlayerView updated');
