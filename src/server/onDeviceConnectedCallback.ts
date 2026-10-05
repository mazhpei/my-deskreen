import { getDeskreenGlobal } from '../main/helpers/getDeskreenGlobal';
import { Device } from '../common/Device';
import SharingSessionStatusEnum from '../features/SharingSessionService/SharingSessionStatusEnum';
import DesktopCapturerSourceType from '../common/DesktopCapturerSourceType';

let cachedSourceId: string | null = null;

export async function onDeviceConnectedCallback(device: Device): Promise<void> {
	const deskreenGlobal = getDeskreenGlobal();
	const { connectedDevicesService, sharingSessionService } = deskreenGlobal;
	if (!connectedDevicesService.isSlotAvailable()) {
		const waitingSession =
			sharingSessionService.waitingForConnectionSharingSession;
		waitingSession?.denyConnectionForPartner();
		waitingSession?.setStatus(SharingSessionStatusEnum.NOT_CONNECTED);
		sharingSessionService.waitingForConnectionSharingSession = null;
		connectedDevicesService.resetPendingConnectionDevice();
		return;
	}
	connectedDevicesService.setPendingConnectionDevice(device);

	try {
		let sourceId = cachedSourceId;
			if (!sourceId) {
				const screenSources = deskreenGlobal.desktopCapturerSourcesService.getScreenSources();
				if (screenSources && screenSources.length > 0) {
					sourceId = screenSources[0].id;
					cachedSourceId = sourceId;
				}
			}
			if (!sourceId) {
				const source = await deskreenGlobal.desktopCapturerSourcesService.requestPortalSource([DesktopCapturerSourceType.SCREEN]);
				if (source) {
					sourceId = source.id;
					cachedSourceId = sourceId;
				}
			}
			
			if (sourceId) {
				const session = sharingSessionService.sharingSessions.get(device.sharingSessionID);
				if (session) {
					session.setDesktopCapturerSourceID(sourceId);
					connectedDevicesService.addDevice(device);
					session.setStatus(SharingSessionStatusEnum.CONNECTED);
					session.callPeer();
					session.setStatus(SharingSessionStatusEnum.SHARING);
					if (sharingSessionService.waitingForConnectionSharingSession?.id === session.id) {
						sharingSessionService.waitingForConnectionSharingSession = null;
					}
					connectedDevicesService.resetPendingConnectionDevice();
					return;
				}
			}
		} catch (err) {
			console.error('Auto-allow failed', err);
		}
	}
