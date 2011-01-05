function xhr(method, url, params, callbacks) { // method: 'GET' or 'POST'
    if (callbacks.before) callbacks.before();
    var xhr = new XMLHttpRequest();

    if (callbacks.modify) {
        var req = {
            method: method,
            url: url,
            params: params
        };
        callbacks.modify(req);
        method = req.method;
        url = req.url;
        params = req.params;
    }

    var data = ''
    for (var name in params) if (params.hasOwnProperty(name)) {
        data += encodeURIComponent(name) + "=" + encodeURIComponent(params[name]) + "&";
    }

    if (method.match(/get/i)) {
        // getのときurl書き換え
        if (data.length > 0) {
            if (!url.match('?')) url += '?';
            url += data;
        }
    }

    xhr.open(method.toUpperCase(), url, true);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (callbacks.after) callbacks.after();

            if (xhr.status == 200) {
                if (callbacks.ok) callbacks.ok(xhr);
            } else {
                if (callbacks.ng) callbacks.ng(xhr);
            }
        }
    };
    if (method == 'POST') xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(method.match(/post/i) ? data : null);
}

function parseHeader(url, callback) {
    chrome.cookies.getAll({ url: url }, function(cookies) {
        var str = '';
        cookies.forEach(function(item) {
            str += item.name + '=' + item.value + '; ';
        });
        callback(str);
    });
}

function wget_handler(info, tab) {
    var url = info.linkUrl ||info.pageUrl;
    var endpoint = localStorage["endpoint"] || 'http://127.0.0.1';
    parseHeader(url, function(cookie_str) {
        xhr(
            'POST',
            endpoint,
            {uri: url, cookie: cookie_str  },
            {ok: function(data){ console.log(data.status) },
             ng: function(data){ console.log(data.status) }
            }
           );
    });
}

chrome.contextMenus.create({
    "title" : "slink",
    "type" : "normal",
    "contexts" : ["link"],
    "onclick" : wget_handler
});

chrome.contextMenus.create({
    "title" : "slink (page)",
    "type" : "normal",
    "contexts" : ["page"],
    "onclick" : wget_handler
});
