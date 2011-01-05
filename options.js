function save_options() {
    localStorage["endpoint"] = document.querySelector('input[name="endpoint"]').value;

    var status = document.querySelector("#status");
    status.textContent = "Options Saved.";
    setTimeout(function() {
        status.textContent = "";
    }, 750);
}

function restore_options() {
    var endpoint = localStorage["endpoint"];
    if (!endpoint) {
        return;
    }
    document.querySelector('input[name="endpoint"]').value = endpoint;
}
