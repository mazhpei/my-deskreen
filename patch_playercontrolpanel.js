const fs = require('fs');
const file = 'src/client-viewer/src/components/PlayerControlPanel/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Interface update
content = content.replace(
`interface PlayerControlPanelProps {
	onSwitchChangedCallback: (isEnabled: boolean) => void;
	isPlaying: boolean;
	isDefaultPlayerTurnedOn: boolean;
	handleClickFullscreen: () => 'entered' | 'exited' | 'failed';
	handleClickPlayPause: () => void;
	setVideoQuality: (q: VideoQualityType) => void;
	selectedVideoQuality: VideoQualityType;
	screenSharingSourceType: ScreenSharingSourceType;
	// toaster: undefined | HTMLDivElement;
}`,
`interface PlayerControlPanelProps {
	onSwitchChangedCallback: (isEnabled: boolean) => void;
	isPlaying: boolean;
	isDefaultPlayerTurnedOn: boolean;
	handleClickFullscreen: () => 'entered' | 'exited' | 'failed';
	handleClickPlayPause: () => void;
	setVideoQuality: (q: VideoQualityType) => void;
	selectedVideoQuality: VideoQualityType;
	screenSharingSourceType: ScreenSharingSourceType;
	isFlipped?: boolean;
	handleFlip?: () => void;
}`
);

// 2. Destructuring update
content = content.replace(
`	const {
		onSwitchChangedCallback,
		isPlaying,
		isDefaultPlayerTurnedOn,
		handleClickPlayPause,
		handleClickFullscreen,
		selectedVideoQuality,
		setVideoQuality,
		screenSharingSourceType,
	} = props;`,
`	const {
		onSwitchChangedCallback,
		isPlaying,
		isDefaultPlayerTurnedOn,
		handleClickPlayPause,
		handleClickFullscreen,
		selectedVideoQuality,
		setVideoQuality,
		screenSharingSourceType,
		isFlipped,
		handleFlip,
	} = props;`
);

// 3. Remove "Get Deskreen Pro" button (from <Col xs> with "get-deskreen-pro-tooltip" down to </Col>)
const startStr = `<Col xs>
								<Tooltip
									content={t('get-deskreen-pro-tooltip')}
									position={Position.BOTTOM}`;
const endStr = `</Text>
										</div>
									</Button>
								</Tooltip>
							</Col>`;

if (content.includes(startStr) && content.includes(endStr)) {
    const startIdx = content.indexOf(startStr);
    const endIdx = content.indexOf(endStr) + endStr.length;
    content = content.slice(0, startIdx) + content.slice(endIdx);
} else {
    console.log("Could not find Get Deskreen Pro chunk");
}

// 4. Update "Flip" button
content = content.replace(
`<Tooltip
													content={t('flip-the-screen-is-pro-version-only')}
													position={Position.TOP}
												>
													<span
														style={{
															display: 'block',
															width: '100%',
															textAlign: 'center',
														}}
													>
														<Button
															icon="key-tab"
															minimal
															style={videoQualityButtonStyle}
															disabled={true}
														>
															{t('Flip')}
														</Button>
													</span>
												</Tooltip>`,
`<Tooltip
													content={t('Flip Screen')}
													position={Position.TOP}
												>
													<span
														style={{
															display: 'block',
															width: '100%',
															textAlign: 'center',
														}}
													>
														<Button
															icon="key-tab"
															minimal
															style={videoQualityButtonStyle}
															onClick={handleFlip}
															active={isFlipped}
														>
															{t('Flip')}
														</Button>
													</span>
												</Tooltip>`
);

fs.writeFileSync(file, content);
console.log('PlayerControlPanel patched');
