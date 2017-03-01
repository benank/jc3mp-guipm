jcmp.events.Add('PlayerReady', (player) => 
{
    jcmp.events.CallRemote('AddPlayer', null, player.networkId, player.name);
})

jcmp.events.AddRemoteCallable('GUIReady', (player) => 
{
    let data = [];
    jcmp.players.forEach(function(p) 
    {
        data.push({id: p.networkId, name: p.name});
    });
    jcmp.events.CallRemote('InitPlayers', player, JSON.stringify(data));
})

jcmp.events.Add('PlayerDestroyed', (player) => {
    jcmp.events.CallRemote('RemovePlayer', null, player.networkId);
})

jcmp.events.AddRemoteCallable('SendMessage', (player, message, id) => 
{
    message = message.trim();
    let target = jcmp.players.find(p => p.networkId == id);
    if (typeof target == 'undefined' || target == null || message.length == 0)
    {
        return;
    }

    if (target != null && typeof target != 'undefined')
    {
        jcmp.events.CallRemote('AddMessage', target, player.networkId, JSON.stringify({type: "from", msg: message}));
    }
    jcmp.events.CallRemote('AddMessage', player, target.networkId, JSON.stringify({type: "to", msg: message}));
})