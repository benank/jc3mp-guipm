const ui = new WebUIWindow('guipm', 'package://guipm/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;
ui.hidden = true;

jcmp.events.AddRemoteCallable('AddMessage', (id, entry) => {
    jcmp.ui.CallEvent('guipm/AddMessage', id, entry);
})

jcmp.events.AddRemoteCallable('AddPlayer', (id, name) => {
    AddPlayer(id, name);
})

jcmp.events.AddRemoteCallable('RemovePlayer', (id) => {
    jcmp.ui.CallEvent('guipm/RemovePlayer', id);
})

jcmp.events.AddRemoteCallable('InitPlayers', (data) => {
    data = JSON.parse(data);
    data.forEach(function(entry) 
    {
        AddPlayer(entry.id, entry.name);
    });
})

jcmp.ui.AddEvent('guipm/SendMessage', (message, id) => 
{
    jcmp.events.CallRemote('SendMessage', message, id);
})

jcmp.ui.AddEvent('guipm/ToggleOpen', (open) => {
    ui.hidden = open;
    jcmp.localPlayer.controlsEnabled = open;
})

jcmp.ui.AddEvent('guipm/Ready', () => {
    jcmp.events.CallRemote('GUIReady');
    ReadSettings();
})


function AddPlayer(id, name)
{
    if (id != jcmp.localPlayer.networkId)
    {
        jcmp.ui.CallEvent('guipm/AddPlayer', id, name);
    }
}

const notify_on_setting = "guipm/notify_on";
const sound_on_setting = "guipm/sound_on";

jcmp.ui.AddEvent('guipm/UpdateSettings', (notify_on, sound_on) => {
    jcmp.settings.Set(notify_on_setting, notify_on);
    jcmp.settings.Set(sound_on_setting, sound_on);
})

function ReadSettings()
{
    let notify_on = true;
    let sound_on = true;

    if (!jcmp.settings.Exists(notify_on_setting))
    {
        jcmp.settings.Set(notify_on_setting, true);
    }

    if (!jcmp.settings.Exists(sound_on_setting))
    {
        jcmp.settings.Set(sound_on_setting, true);
    }

    notify_on = jcmp.settings.Get(notify_on_setting);
    sound_on = jcmp.settings.Get(sound_on_setting);

    
    jcmp.print(`2notify:${notify_on} 2sound:${sound_on}`);

    if (typeof notify_on != 'boolean') 
    {
        jcmp.print("NOT BOOLEAN 1");
        notify_on = true;
        jcmp.settings.Delete(notify_on_setting);
    }

    if (typeof sound_on != 'boolean') 
    {
        jcmp.print("NOT BOOLEAN 2");
        sound_on = true;
        jcmp.settings.Delete(sound_on_setting);
    }

    jcmp.print(`notify:${notify_on} sound:${sound_on}`);
    jcmp.ui.CallEvent('guipm/SetSettings', notify_on, sound_on);

}