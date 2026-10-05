const fs = require('fs');
const file = 'src/client-viewer/src/containers/PlayerView/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useState, useEffect to imports
content = content.replace("import { useEffect, useRef, useCallback } from 'react';", "import { useEffect, useRef, useCallback, useState } from 'react';");

// 2. Add isFlipped, setIsFlipped, isControlsVisible, and mousemove logic
const stateLogic = `
	const [isFlipped, setIsFlipped] = useState(false);
	const [isControlsVisible, setIsControlsVisible] = useState(true);

	useEffect(() => {
		let timeout;
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
	}, []);
`;
content = content.replace("const toasterRef = useRef<Awaited<ReturnType<typeof OverlayToaster.create>> | null>(null);", "const toasterRef = useRef<Awaited<ReturnType<typeof OverlayToaster.create>> | null>(null);\n" + stateLogic);

// 3. Update PlayerControlPanel props and wrapper
const playerControlPanelOld = `			<PlayerControlPanel
				onSwitchChangedCallback={(isEnabled) => setIsWithControls(isEnabled)}
				isDefaultPlayerTurnedOn={isWithControls}
				handleClickFullscreen={() => {
					const result = togglePlayerFullscreen();
					if (result === 'failed') {
						console.warn('Unable to toggle fullscreen');
					}
					return result;
				}}
				handleClickPlayPause={handlePlayPauseWithNotification}
				isPlaying={isPlaying}
				setVideoQuality={setVideoQuality}
				selectedVideoQuality={videoQuality}
				screenSharingSourceType={screenSharingSourceType}
			/>`;

const playerControlPanelNew = `			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					zIndex: 10,
					transition: 'opacity 0.4s ease, transform 0.4s ease',
					opacity: isControlsVisible ? 1 : 0,
					transform: isControlsVisible ? 'translateY(0)' : 'translateY(-100%)',
				}}
				onMouseEnter={() => setIsControlsVisible(true)}
			>
				<PlayerControlPanel
					onSwitchChangedCallback={(isEnabled) => setIsWithControls(isEnabled)}
					isDefaultPlayerTurnedOn={isWithControls}
					handleClickFullscreen={() => {
						const result = togglePlayerFullscreen();
						if (result === 'failed') {
							console.warn('Unable to toggle fullscreen');
						}
						return result;
					}}
					handleClickPlayPause={handlePlayPauseWithNotification}
					isPlaying={isPlaying}
					setVideoQuality={setVideoQuality}
					selectedVideoQuality={videoQuality}
					screenSharingSourceType={screenSharingSourceType}
					isFlipped={isFlipped}
					handleFlip={() => setIsFlipped(!isFlipped)}
				/>
			</div>`;
content = content.replace(playerControlPanelOld, playerControlPanelNew);

// 4. Update PLAYER_WRAPPER_ID style to include scaleX
const wrapperStyleOld = `					style={{
						position: 'relative',
						width: '100%',
						height: '100%',
						backgroundColor: 'black',
					}}`;
const wrapperStyleNew = `					style={{
						position: 'relative',
						width: '100%',
						height: '100%',
						backgroundColor: 'black',
						transform: isFlipped ? 'scaleX(-1)' : 'none',
					}}`;
content = content.replace(wrapperStyleOld, wrapperStyleNew);

fs.writeFileSync(file, content);
console.log('PlayerView patched');
