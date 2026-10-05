const fs = require('fs');
const file = 'src/client-viewer/src/containers/PlayerView/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add onTouchEnd to the wrapper
content = content.replace(
`onClick={handleScreenClick}`,
`onClick={handleScreenClick}
			onTouchEnd={handleScreenClick}`
);

fs.writeFileSync(file, content);
console.log('PlayerView touch patched');
