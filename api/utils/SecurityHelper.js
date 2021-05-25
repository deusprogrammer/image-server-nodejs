exports.getAuthenticatedTwitchUserName = (request) => {
    if (request.user && request.user.connected && request.user.connected.twitch) {
        return request.user.connected.twitch.name;
    }
    
    return null;
}

exports.getAuthenticatedTwitchUserId = (request) => {
    if (request.user && request.user.connected && request.user.connected.twitch) {
        return request.user.connected.twitch.userId;
    }
    
    return null;
}

exports.authenticatedUserHasRole = (request, role) => {
    if (request.user.roles) {
        return request.user.roles.includes(role);
    }
    
    return false;
}

exports.authenticatedUserHasAccessToChannel = (request, channelId) => {
    console.log("USER: " + JSON.stringify(request.user));
    console.log("CHANNEL ID: " + channelId);
    if (request.user && request.user.connected && request.user.connected.twitch && request.user.connected.twitch.channels) {
        return request.user.connected.twitch.channels.includes(channelId.toString());
    }
    
    return false;
}