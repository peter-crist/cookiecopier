function copy() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            if (currentTab) {
                const domain = new URL(currentTab.url).hostname;

                chrome.cookies.getAll({ domain: domain }, function (cookies) {
                    const accessTokenObject = cookies.find(cookie => cookie.name === "access_token");
                    const accessTokenValue = accessTokenObject ? accessTokenObject.value : null;

                    if (accessTokenValue) {
                        resolve(accessTokenValue)
                    } else {
                        reject("Access token not found");
                    }
                });
            } else {
                reject("Current tab not found");
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    copy().then(token => {
        var access_token_elem = document.getElementById('access_token');
        copyToClipboard(token)

        access_token_elem.textContent = "✅ Your access token has been copied to your clipboard! 📋";

    }).catch(error => {
        console.log(error);
    });
});

async function copyToClipboard(textToCopy) {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}