/*
    RoGold

    Coding and design by alexop1000 (AlexOp).
    Contact: https://rogold.me/invite

    Copyright (C) alexop1000 
	All rights reserved.
*/

(async () => {
    if (self !== top) return;
    const hide = await getSetting("Streamer Mode");
    $("body").attr("streamer", hide)
    $(document).ready(() => {
        $("body").attr("streamer", hide)
        if (hide) {
            document.body.setAttribute("streamer", true)
            observe(document, "friend-link", (node) => {
                console.log(node)
                node.href = ""
            })
        }
    })
    setTimeout(async () => {
        if (await getSetting("Keep Sidebar Open")) {
            const body = await first("body")
            body.setAttribute("keepopen", true)
            const nav = await first("#navigation")
            nav.classList.add("nav-show")
        }
    }, 0)
    const runBG = async () => {
        if (didBG) return;
        didBG = true
        const stylingInfo = await getSetting("Theme Creator")
        if (!stylingInfo[0]) return;
        if (stylingInfo[2] != "none" || stylingInfo[3].bi != "") {
            let image
            if (stylingInfo[3].bi != "") {
                if (stylingInfo[3].bi.includes("http")) {
                    const imageLoad = new Image()
                    imageLoad.src = stylingInfo[3].bi
                    await new Promise(resolve => {
                        imageLoad.onload = resolve
                    })
                    image = imageLoad.src
                } else {
                    image = await assembleGet("scaled")
                }
            } else {
                image = chrome.runtime.getURL('/images/backgrounds/' + defaultSettings.Basic["Theme Creator"].options[1].list[stylingInfo[2]].styling["background-image"])
            }
            on(".content", (e) => {
                e.style.background = "transparent"
                e.classList.add("transparent")
            })
            on(".container-footer", e => {
                e.style.setProperty("background", "transparent", "important")
            })
            on("#rbx-body", e => {
                $("#rbx-body").css({ "background-image": `url(${image})`, "background-repeat":  stylingInfo[3]["BG Repeat"], "background-blend-mode": stylingInfo[3]["BG IMG Blend Mode"] })
                $("#rbx-body").addClass("rg-bg")
            })
        }
        Object.entries(defaultSettings.Basic["Theme Creator"].options[2].list).forEach(async(obj) => {
            const value = obj[1], key = obj[0]
            if (value.cf) {
                const sN = decapitalize(key)
                if (stylingInfo[3][sN] != "") {
                   // console.log(value, key, stylingInfo[3][sN])
                    if (value.prop) {
                        document.body.setAttribute(sN, "true")
                        document.querySelector(":root").style.setProperty("--tc-color", stylingInfo[3][sN])
                    } else {
                        const applyTo = await first(value.sel)
                        applyTo.style.backgroundColor = stylingInfo[3][sN]
                        if (applyTo.id == "navigation") {
                            document.getElementById("upgrade-now-button").style.color = stylingInfo[3][sN]
                        }
                        if (value.sel == "#rbx-body") {
                            document.querySelector(".content").style.background = "transparent"
                        }
                    }
                }
            }
        })
        if (stylingInfo[1] != "none") {
            $("#rbx-body").addClass(defaultSettings.Basic["Theme Creator"].options[0].list[stylingInfo[1]].style)
            $("#rbx-body").attr("rg-touched", true)
        }
    }
    let didBG = false
    on(".content", runBG)
    const showCon = await getSetting("Robux Convert"), abbreviate = await getSetting("Abbreviate Robux")
    let userId = await GetUserInfo()
	userId = userId.userId
    let userRobux = await cacheValue("currency", async () => {
        return new Promise(resolve => {
            get(`https://economy.roblox.com/v1/users/${userId}/currency`).then(resolve)
        })
    }, 1000 * 60)
    userRobux = userRobux?.robux
    if (showCon != "Off" || abbreviate) {
        const rates = await getRates()
        const custom = await getSetting("Robux Convert Custom")
        let rate = await getSetting("Conversion Rate")
        const convertColor = await getSetting("Conversion Color")
        switch (rate) {
            case "Normal":
                rate = 0.0125
                break;
            case "DevEx":
                rate = 0.0035
                break;
            case "Premium":
                rate = 0.01136
                break;
        }
        const showUSD = async (robux, append, padding = 0) => {
            let usdLabel = document.createElement("span")
            usdLabel.setAttribute('class', "text-secondary")
            usdLabel.setAttribute("style", `padding-left: ${padding}px;`)
            usdLabel.style.color = convertColor || ""
            const toUse = showCon == "Custom" && custom || showCon
            usdLabel.innerText = `(${((rate * robux) * (toUse == "USD" && 1 || rates[toUse])).toLocaleString(
                symbols[toUse].code,
                {
                    style: "currency",
                    currency: symbols[toUse].code,
                    maximumFractionDigits: symbols[toUse].decimal_digits
                }
            ).replace(symbols[toUse].code, symbols[toUse].symbol_native)})`
            if (append) {
                append.appendChild(usdLabel)
            }
            return usdLabel
        }
        const searchList = ".text-robux-tile, .rbx-text-navbar-right.text-header, .text-robux-lg, .text-robux, .list-item.real-game-pass, .amount.icon-robux-container"
        const addRobuxCount = async (element) => {
            const doAction = async () => {
                let robuxNum = element.innerText.replace(/,+/g, '')?.replace(/\.+/g, '')
                if ((typeof parseInt(robuxNum) == "number" && robuxNum > 0) || element.getAttribute('id') == 'nav-robux-amount'){// || (element.getAttribute('id') == 'nav-robux-amount' && !hide)) {

                    if (showCon != "Off") {
                        const parentTo = element.tagName == "TD" && element.getElementsByTagName("SPAN")[2]  || element.parentNode
                        if (parentTo.getElementsByClassName("text-secondary")[0]) return;
                        robuxNum = element.getAttribute('id') == 'nav-robux-amount' && userRobux || robuxNum
                        if (element.getAttribute('id') == 'nav-robux-amount' && hide) return;
                        let usdLabel = showUSD(robuxNum, parentTo, !(
                            element.className == "text-robux" || 
                            element.className == "text-robux-tile ng-binding ng-scope" ||
                            element.className == "text-robux ng-binding"
                        ) && 3)
                        if (element.getAttribute("id") == "nav-robux-balance") { // improve
                             document.getElementById('nav-robux-balance').style.paddingBottom = 0
                             document.getElementById('nav-robux-balance').parentNode.appendChild(usdLabel)
                        }
                    }
                    if (abbreviate && element.getAttribute('id') != 'nav-robux-amount' && !element.className.includes('amount icon-robux-container')) {
                        element.innerText = NumberFormatting.abbreviatedFormat(parseInt(robuxNum))
                        element.setAttribute("title", addCommas(robuxNum))
                    }
                }
            }
            if (!element.className.includes("robux")) {
                element = document.querySelector(searchList)
            }
            if (element.getAttribute('ng-bind') && element.getAttribute('ng-bind').includes("formatNumber")) {
                setTimeout(doAction, 500)
            } else {
                doAction()
            }
        }
        on(searchList, addRobuxCount)
        setTimeout(async () => {
            for (const item of document.querySelectorAll(searchList)) {
                addRobuxCount(item)
            }
        }, 1000)
    }
    setTimeout(async () => {
        const addNavButton = async (img, text, link) => {
            const btn = document.createElement("li")
            btn.innerHTML = `
                <a class="dynamic-overflow-container text-nav" href="${link}" id="nav-giftcards">
                    <div>
                        <span class="icon-nav-giftcards" 
                        style="background-image: url('${img}'); background-position: 2px 0; background-size:24px 24px;"
                        ></span>
                    </div>
                    <span class="font-header-2 dynamic-ellipsis-item">${text}</span>
                </a>
            `
            const holder = await first(".left-col-list")
            holder.insertBefore(btn, holder.children[9])
        }
        if (await getSetting("Navigation Buttons")) {
            addNavButton(chrome.runtime.getURL("/svg/redeem.svg"), "Redeem", "/redeem")
            addNavButton(chrome.runtime.getURL("/svg/transactions.svg"), "Transactions", "/transactions")
        }
        if (await getSetting("Accurate Sidebar Counts")) {
            const friendCount = await get("https://friends.roblox.com/v1/user/friend-requests/count")
            on("#nav-friends .notification", (e) => {
                e.textContent = NumberFormatting.abbreviatedFormat(friendCount.count)
            })
            if (window.location.href.includes("#!/friend-requests")) {
                first(".friends-subtitle", e => {
                    e.innerText = `Requests (${addCommas(friendCount.count)})`
                })
            }
        }

        // TODO: Finish this feature.
        // let newestNotifications = await get("https://notifications.roblox.com/v2/stream-notifications/get-recent?maxRows=10&startIndex=0")
        // console.log(newestNotifications)
        // setInterval(async () => { // polling
        //     const newNotifications = await get("https://notifications.roblox.com/v2/stream-notifications/get-recent?maxRows=10&startIndex=0")
        //     let i = 0
        //     let addNew = []
        //     for (const notification of newNotifications) {
        //         if (notification.id != newestNotifications[i]) {
        //             addNew.push(notification)
        //         }
        //         i++
        //     }
        //     for (const newNotif of addNew) {
        //         const meta = newNotif.metadataCollection
        //         const elm = document.createElement("li")
        //         elm.id = "notification-stream-" + newNotif.id
        //         elm.className = "border-bottom notification-stream-item unInteracted"
        //         elm.innerHTML = `<div class="notification-item">
        //         <div class="notification-item-front">
        //             <div class="notification-image-container">
        //                 <div class="avatar avatar-headshot-sm" title="${meta[0].SenderUserName}">
        //                     <a href="https://www.roblox.com/users/2385555237/profile">
        //                         <thumbnail-2d class="avatar-card-image" thumbnail-type="thumbnailTypes.avatarHeadshot">
        //                             <span class="thumbnail-2d-container" thumbnail-type="AvatarHeadshot">
        //                                 <img image-load="" alt="" title=""
        //                                     src="https://tr.rbxcdn.com/5ca401845790c796ff741aa8bacd0e40/150/150/AvatarHeadshot/Png">
        //                             </span>
        //                         </thumbnail-2d>
        //                     </a>
        //                 </div>
        //             </div>
        //             <div class="notification-item-content">
        //                 <div class="notification-data-container font-caption-body"> <span
        //                         class="small text notification-display-text" click-in-card=""><span
        //                             class="cursor-pointer text-name paired-name"><a class="element small text-emphasis"
        //                                 type="goToProfilePage"
        //                                 href="https://www.roblox.com/users/${meta[0].SenderUserId}/profile">${meta[0].SenderDisplayName}</a><span
        //                                 class="text-emphasis small connector">@</span><span
        //                                 class="small element">${meta[0].SenderUserName}</span></span> sent you a friend request.</span> <span
        //                         class="small text notification-display-text ng-hide" click-in-card=""><span
        //                             class="cursor-pointer text-name paired-name"><a class="element small text-emphasis"
        //                                 type="goToProfilePage"
        //                                 href="https://www.roblox.com/users/${meta[0].SenderUserId}/profile">cupkakke</a><span
        //                                 class="text-emphasis small connector">@</span><span
        //                                 class="small element">Vtrust3dKean</span></span> is now your friend!</span>
        //                     <div class="text-date-hint">${dateFormat(newNotif.eventDate, "mm dd, yyyy | hh:mm")}</div>
        //                 </div>
        //                 <div class="notification-action-container"> <button class="btn-control-xs font-caption-header"
        //                         id="ignore-fr-btn">Ignore</button> <button class="btn-primary-xs font-caption-header"
        //                         id="accept-fr-btn">Accept</button> <button
        //                         class="btn-primary-xs roblox-popover-close font-caption-header"
        //                         id="chat-btn">Chat</button> <a class="btn-secondary-xs font-caption-header"
        //                         id="view-all-btn" click-in-card="" type="viewAllFriendRequests"
        //                         href="https://www.roblox.com/users/friends#!/friend-requests">View All</a> </div>
        //             </div>
        //         </div>
        //         <div class="notification-item-back">
        //             <div class="notification-image-container">
        //                 <div class="avatar avatar-headshot-sm" ng-if="userIds.length >= 1" title="Vtrust3dKean"> <a
        //                         user_id="2385555237" click-in-card="" href="https://www.roblox.com/users/2385555237/profile">
        //                         <thumbnail-2d class="avatar-card-image" thumbnail-target-id="userIds[0]"
        //                             thumbnail-type="thumbnailTypes.avatarHeadshot"><span class="thumbnail-2d-container"
        //                                 thumbnail-type="AvatarHeadshot" thumbnail-target-id="2385555237">
        //                                 <img thumbnail-error="$ctrl.setThumbnailLoadFailed" image-load="" alt="" title=""
        //                                     src="https://tr.rbxcdn.com/5ca401845790c796ff741aa8bacd0e40/150/150/AvatarHeadshot/Png">
        //                             </span> </thumbnail-2d>
        //                     </a> </div>
        //             </div>
        //             <div class="notification-item-content">
        //                 <div class="notification-data-container font-caption-body"> <span
        //                         class="text notification-display-text ng-hide" click-in-card=""><span
        //                             class="cursor-pointer text-name paired-name"><a class="element small text-emphasis"
        //                                 type="goToProfilePage"
        //                                 href="https://www.roblox.com/users/2385555237/profile">cupkakke</a><span
        //                                 class="text-emphasis small connector">@</span><span
        //                                 class="small element">Vtrust3dKean</span></span> is now your friend!</span>
        //                     <div class="text-date-hint ng-binding" ng-bind="notification.eventDate | datetime: 'full'">Oct 25, 2021
        //                         | 12:05 PM</div>
        //                 </div>
        //                 <div class="notification-action-container"> <button class="btn-primary-xs font-caption-header ng-hide"
        //                         id="chat-btn"> <span>Chat</span> </button> </div>
        //             </div>
        //         </div>
        //     </div>
        //         `
        //     }
        // }, 1000)
    }, 0)
    const quickCopy = await getSetting("Quick Copy")
    if (!quickCopy) return;
    const patterns = [
        "*://*.roblox.com/groups/*",
        "*://*.roblox.com/badges/*",
        "*://*.roblox.com/games/*",
        "*://*.roblox.com/universes/*",
        "*://*.roblox.com/catalog/*",
        "*://*.roblox.com/users/*",
        "*://*.roblox.com/game-pass/*",
        "*://*.roblox.com/library/*",
        "*://discord.gg/*",
        "*://twitter.com/*",
    ]
    const id = "RoGold-Context"
    await browserSend("CreateMenu", {
        "id": id,
        "title": "Copy Id",
        "contexts": ["link"],
        "documentUrlPatterns": ["*://*.roblox.com/*"],
        "targetUrlPatterns": patterns
    })
    const assetTypeTitle = {
        "groups": "Group",
        "badges": "Badge",
        "games": "Game",
        "universes": "Universe",
        "catalog": "Item",
        "users": "User",
        "game-pass": "Pass",
        "library": "Asset",
    }
    const otherDomains = {
        "discord.gg": "Invite Id",
        "twitter.com": "Twitter Name"
    }
    let lastHref
    let lastTitle
    (await first("body")).addEventListener('mousemove', throttle((e) => {
        let target = (e && e.target) || (e && e.relatedTarget);
        let href = target.href
        if (!href) {
            href = target.querySelectorAll('[href]')[0]
            if (href) {
                href = href.href
            }
        }
        if (href == lastHref) return;
        lastHref = href
        if (href) {
            if (href.split("/")[2] != "roblox.com" && otherDomains[href.split("/")[2]]) {
                browserSend("EditMenu", {
                    "id": id,
                    "update": {
                        "title": `Copy ${otherDomains[href.split("/")[2]]}`,
                        "contexts": ["link"],
                        //"visible": true,
                        "documentUrlPatterns": ["*://*.roblox.com/*"],
                        "targetUrlPatterns": patterns
                    }
                })
                return
            }
            const assetTitle = assetTypeTitle[href.split("/")[3]]
            if (!assetTitle) return ; //if (!assetTitle) return hideContext();
            if (lastTitle != assetTitle) {
                lastTitle = assetTitle
                browserSend("EditMenu", {
                    "id": id,
                    "update": {
                        "title": `Copy ${assetTitle} Id`,
                        "contexts": ["link"],
                        //"visible": true,
                        "documentUrlPatterns": ["*://*.roblox.com/*"],
                        "targetUrlPatterns": patterns
                    }
                })
            }
        }
    }, 500))
    let lastToggle = new Date().getTime()
    document.onkeyup = async (e) => {
        if (e.ctrlKey && e.shiftKey && e.which == 49) {
            if (new Date().getTime() - lastToggle < 1000) return;
            lastToggle = new Date().getTime()
            const toggleTo = (document.body.getAttribute("streamer") === "true")
            document.body.setAttribute("streamer", toggleTo == undefined ? "true" : !toggleTo)
            const txt = document.querySelector("#nav-robux-icon .text-secondary")
            if (!toggleTo && txt) {
                txt.style.display = "none"
            } else if (toggleTo && txt) {
                txt.style.display = "initial"
            }
            await setSetting("Streamer Mode", !toggleTo)
        }
    }
    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.type == "copy") {
            const data = request.data
            const clipboard = await navigator.clipboard.writeText(data)
            if (clipboard) {
                console.log("Copied to clipboard:", data)
            }

        }
    })
})()

function assembleGet(key) {
    return new Promise(resolve => {
        syncGet(null, (data) => {
            if(data != undefined && data != "undefined" && data != {}){
                const keyArr = new Array();
                let i = 0
                Object.keys(data).forEach(arrKey => {
                    if (arrKey.includes(key)){
                        keyArr.push(`${key}_${i}`)
                        i++
                    }
                })
                syncGet(keyArr, (items) => {
                    const keys = Object.keys( items );
                    const length = keys.length;
                    let results = "";
                    if(length > 0){
                        const sepPos = keys[0].lastIndexOf("_");
                        const prefix = keys[0].substring(0, sepPos);
                        for(let x = 0; x < length; x ++){
                            results += items[`${prefix }_${x}`];
                        }
                        resolve(results);
                        return;
                    }
                    resolve(undefined);
                
                });
            } else {
                resolve(undefined);
            }
        });
    })
}

const runChangelog = async () => {
    const frameWrapper = document.createElement("div")
    frameWrapper.setAttribute("style", "z-index: 10000; left: 35%; border: 0px none; height: 40%; position: fixed; width: 35%; overflow: hidden; bottom: 35%;")
    const iframe = document.createElement('iframe');
    document.body.appendChild(frameWrapper);
    frameWrapper.appendChild(iframe);
    iframe.setAttribute("style", "height: 199%; border: 0px none; width: 100%; margin-bottom: 0px;")
    const doc = iframe.contentDocument;
    doc.open();
    doc.close();
    doc.getElementsByClassName("close")[0].addEventListener("click", () => {
        frameWrapper.remove()
    })
}
chrome.runtime.onMessage.addListener(async (message) => {
    if (message.greeting == "UpdateLog") {
        await runChangelog()
    }
})