const fs = require('fs');
const file = 'src/client-viewer/src/components/PlayerControlPanel/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Interface
content = content.replace(
`	isFlipped?: boolean;
	handleFlip?: () => void;`,
`	rotation?: number;
	handleRotate?: () => void;`
);

// 2. Destructuring
content = content.replace(
`		isFlipped,
		handleFlip,`,
`		rotation,
		handleRotate,`
);

// 3. Button
content = content.replace(
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
												</Tooltip>`,
`<Tooltip
													content={t('Rotate Screen')}
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
															icon="refresh"
															minimal
															style={videoQualityButtonStyle}
															onClick={handleRotate}
															active={rotation !== 0}
														>
															{t('Rotate')}
														</Button>
													</span>
												</Tooltip>`
);

fs.writeFileSync(file, content);
console.log('PlayerControlPanel updated');
