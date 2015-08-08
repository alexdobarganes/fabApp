var gui = require('nw.gui');

console.log(gui.App.argv);

var url = _.find(gui.App.argv, function (a) {
    return a.indexOf('--http://') != -1;
}).substring(2);


gui.Screen.Init();
win = gui.Window.get();

var screenCB = {
    onDisplayBoundsChanged: function (screen) {
        resetBounds(screen.bounds);
    },
    onDisplayAdded: function (screen) {
        resetBounds(screen.bounds);
    },

    onDisplayRemoved: function (screen) {
        resetBounds(screen.bounds);
    }
};

// listen to screen events
gui.Screen.on('displayBoundsChanged', screenCB.onDisplayBoundsChanged);
document.addEventListener('DOMContentLoaded', function () {
    if (url != undefined) {
        console.log(url);
        $('#mainFrame').attr('src', url).load(function () {
            win.show();
            var frame = document.getElementById('mainFrame');
            frame.contentWindow.minimize = minimize;
            frame.contentWindow.restore = restore;
            frame.contentWindow.openExternal = openExternal;
            frame.contentWindow.restart = restart;
            frame.contentWindow.setBadge = setBadge;
            resetBounds(gui.Screen.screens[0].bounds);
            console.log(this);
        });
    }
});

function connectionLost() {
    var frame = document.getElementById('mainFrame');
    frame.contentWindow.onDisconnection.apply(frame, arguments);
}

function resetBounds(bounds) {
    win.setMaximumSize(bounds.width, bounds.height);
    win.resizeTo(bounds.width, bounds.height);
    win.moveTo(bounds.x, bounds.y);
}
function openExternal(url) {
    gui.Shell.openExternal(url);
}
function restore() {
    win.restore();
    win.setAlwaysOnTop(true);
    win.requestAttention(true);
}
function setBadge(value) {
    if (value === 0 || isNaN(value) || value === null)
        value = "";
    win.setBadgeLabel(value);
}
function minimize() {
    win.minimize();
}
function restart() {
    win.reload();
}