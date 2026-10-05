export default (
	peerConnection: PeerConnection,
	payload: { users: PartnerPeerUser[] },
): void => {
	const filteredPartner = payload.users.filter((user: PartnerPeerUser) => {
		return peerConnection.user.username !== user.username;
	});

	if (filteredPartner[0] === undefined) return;

	// If a call is already started, don't destroy it. Just ignore the new user joining the same room.
	if (peerConnection.isCallStarted) {
		return;
	}

	[peerConnection.partner] = filteredPartner;

	if (peerConnection.partner.username !== '') {
		peerConnection.toggleLockRoom(true);
		peerConnection.emitUserEnter();
	}
};
