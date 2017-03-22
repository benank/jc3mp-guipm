jcmp.events.Add('PlayerReady', (player) => 
{
    jcmp.events.CallRemote('guipm/AddPlayer', null, player.networkId, player.name);
})

jcmp.events.AddRemoteCallable('guipm/GUIReady', (player) => 
{
    let data = [];
    jcmp.players.forEach(function(p) 
    {
        data.push({id: p.networkId, name: p.name});
    });
    jcmp.events.CallRemote('guipm/InitPlayers', player, JSON.stringify(data));
})

jcmp.events.Add('PlayerDestroyed', (player) => {
    jcmp.events.CallRemote('guipm/RemovePlayer', null, player.networkId);
})

jcmp.events.AddRemoteCallable('guipm/SendMessage', (player, message, id) => 
{
    message = message.trim();
    message = message.substring(0, (message.length > 1000) ? 1000 : message.length);
    let target = jcmp.players.find(p => p.networkId == id);
    if (typeof target == 'undefined' || target == null || message.length == 0)
    {
        return;
    }

    if (target != null && typeof target != 'undefined')
    {
        jcmp.events.CallRemote('guipm/AddMessage', target, player.networkId, JSON.stringify({type: "from", msg: message}));
    }
    jcmp.events.CallRemote('guipm/AddMessage', player, target.networkId, JSON.stringify({type: "to", msg: message}));
})