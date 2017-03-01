$(document).ready(function() 
{
    $('.window').draggable({handle: ".title", stack: 'div', disabled: false});
    
    let messages = [];
    let current_user = -1;
    const open_key = 119; // F8
    let open = false;
    let sound_enabled = true;
    let notify_enabled = true;

    function changePlayer(id, name)
    {
        id = id.replace('networkId_', '');
        if (typeof messages["networkId_" + id] == 'undefined')
        {
            messages["networkId_" + id] = [];
        }

        $('.message-area').empty();
        
        messages["networkId_" + id].forEach(function(entry) 
        {
            CreateMessage(id, entry);
        });
        
        $('.message-title').text(name);
        current_user = id;
        $("#input-area").attr("placeholder", "Type a message to " + name + "...");
        $("#input-area").val(""); // Clear textbox 
        $("#input-area").focus();

    }

    function AddPlayer(id, name)
    {
        messages["networkId_" + id] = [];
        let entry = $('#networkId_' + id);
        if (entry.length > 0)
        {
            entry.remove(); // If it exists, remove it
        }

        let player = document.createElement("div");
        player.textContent = name;
        player.id = "networkId_" + id;
        player.className = "player-entry";
        $('.players').append(player);
        $(".player-entry").click(function() 
        {
            changePlayer(this.getAttribute('id'), this.textContent);
        })
    }

    function RemovePlayer(id)
    {
        messages["networkId_" + id] = [];
        let entry = $('#networkId_' + id);
        if (entry.length > 0)
        {
            entry.remove(); // If it exists, remove it
        }

        if (current_user == id)
        {
            $('.message-area').empty();
            $('.message-title').text("Select a player to begin");
            current_user = -1;
            $("#input-area").attr("placeholder", "Type a message...");
            $("#input-area").val(""); // Clear textbox 
        }
    }

    function AddMessage(id, entry)
    {
        messages["networkId_" + id].push(entry);
        
        if (current_user == id)
        {
            CreateMessage(id, entry);
        }
    }

    function CreateMessage(id, entry) // type: to or from, msg: text
    {
        let message = document.createElement("div");
        message.textContent = entry.msg;
        message.className = "message " + entry.type;
        $('.message-area').append(message);
        let element = document.getElementById("messages");
        element.scrollTop = element.scrollHeight;
    }
    
    $(".mute-icon.notify").hover(function()
    {
        ToggleNotifyIcon(true);
    }, function()
    {
        ToggleNotifyIcon(false);
    });

    function ToggleNotifyIcon(hovered)
    {
        if (notify_enabled)
        {
            if (hovered)
            {
                $("#notify-toggle").removeClass("fa fa-bell");
                $("#notify-toggle").addClass("fa fa-bell-slash");
            }
            else
            {
                $("#notify-toggle").removeClass("fa fa-bell-slash");
                $("#notify-toggle").addClass("fa fa-bell");
            }
        }
        else
        {
            if (hovered)
            {
                $("#notify-toggle").removeClass("fa fa-bell-slash");
                $("#notify-toggle").addClass("fa fa-bell");
            }
            else
            {
                $("#notify-toggle").removeClass("fa fa-bell");
                $("#notify-toggle").addClass("fa fa-bell-slash");
            }
        }
    }

    $(".mute-icon.sound").hover(function()
    {
        ToggleSoundIcon(true);
    }, function()
    {
        ToggleSoundIcon(false);
    });

    function ToggleSoundIcon(hovered)
    {
        if (sound_enabled)
        {
            if (hovered)
            {
                $("#sound-toggle").removeClass("fa fa-volume-up");
                $("#sound-toggle").addClass("fa fa-volume-off");
            }
            else
            {
                $("#sound-toggle").removeClass("fa fa-volume-off");
                $("#sound-toggle").addClass("fa fa-volume-up");
            }
        }
        else
        {
            if (hovered)
            {
                $("#sound-toggle").removeClass("fa fa-volume-off");
                $("#sound-toggle").addClass("fa fa-volume-up");
            }
            else
            {
                $("#sound-toggle").removeClass("fa fa-volume-up");
                $("#sound-toggle").addClass("fa fa-volume-off");
            }
        }
    }

    function ToggleSound(enabled)
    {
        sound_enabled = enabled;
        ToggleSoundIcon(false);
        jcmp.CallEvent('guipm/UpdateSettings', notify_enabled, sound_enabled);
    }

    function ToggleNotify(enabled)
    {
        notify_enabled = enabled;
        ToggleNotifyIcon(false);
        jcmp.CallEvent('guipm/UpdateSettings', notify_enabled, sound_enabled);
    }

    $(".mute-icon.sound").click(function() 
    {
        ToggleSound(!sound_enabled);
    });

    $(".mute-icon.notify").click(function() 
    {
        ToggleNotify(!notify_enabled);
    });

    jcmp.AddEvent('guipm/SetSettings', (notify, sound) => {
        ToggleNotify(notify);
        ToggleSound(sound);
    })

    
    $(".close-icon").hover(function()
    {
        $("#close-button").css("color", "red");
    }, function()
    {
        $("#close-button").css("color", "white");
    });

    $(".close-icon").click(function()
    {
        jcmp.HideCursor();
        jcmp.CallEvent('guipm/ToggleOpen', true);
        open = !open;
        $("#close-button").css("color", "white");
    });

    document.onkeyup = (e) => 
    {
        const keycode = (typeof e.which === 'number') ? e.which : e.keyCode;
        if (keycode == 13)
        {
            let msg = $("#input-area").val();
            if (msg.length > 0 && current_user > -1)
            {
                jcmp.CallEvent('guipm/SendMessage', msg, current_user);
            }
            $("#input-area").val("");
        }
        else if (keycode == open_key)
        {
            open = !open;
            jcmp.CallEvent('guipm/ToggleOpen', !open);
            if (open) 
            {
                jcmp.ShowCursor(); 
                $("#input-area").val("");
                $("#input-area").blur();
            } 
            else 
            {
                jcmp.HideCursor();
                $("#input-area").blur();
            }
        }

    };

    jcmp.AddEvent('guipm/AddMessage', (id, entry) => {
        entry = JSON.parse(entry);
        AddMessage(id, entry);
    })

    jcmp.AddEvent('guipm/AddPlayer', (id, name) => {
        AddPlayer(id, name);
    })

    jcmp.AddEvent('guipm/RemovePlayer', (id) => {
        RemovePlayer(id);
    })


    jcmp.CallEvent('guipm/Ready');

})
