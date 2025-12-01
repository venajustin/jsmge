
function testfn() {
    return "<form onsubmit='getStatus()'>" +
        "<button type='submit' >ClickMe</button>" +
        "test"+
        "</form>";
}

function getStatus(e) {
    e.preventDefault();
    let status = fetch("/status");
    alert("Status: " + status);
}

module.exports = { testfn, getStatus };
