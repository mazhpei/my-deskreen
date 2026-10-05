const fs = require('fs');

// 1. Fix PlayerControlPanel/index.tsx
const pcpFile = 'src/client-viewer/src/components/PlayerControlPanel/index.tsx';
let pcpContent = fs.readFileSync(pcpFile, 'utf8');

const handleContributeClickStr = `	const handleContributeClick = useCallback(() => {
		trackAnalyticsEvent('contribute_clicked', {
			destination: 'https://deskreen.com/download',
		});
		window.open('https://deskreen.com/download', '_blank');
	}, []);`;

pcpContent = pcpContent.replace(handleContributeClickStr, '');
fs.writeFileSync(pcpFile, pcpContent);

// 2. Fix PlayerView/index.tsx
const pvFile = 'src/client-viewer/src/containers/PlayerView/index.tsx';
let pvContent = fs.readFileSync(pvFile, 'utf8');

pvContent = pvContent.replace('let timeout;', 'let timeout: ReturnType<typeof setTimeout>;');
fs.writeFileSync(pvFile, pvContent);

console.log('Fixed typescript errors');
