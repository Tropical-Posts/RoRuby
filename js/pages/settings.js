/*
    RoGold

    Coding and design by alexop1000 (AlexOp).
    Contact: https://rogold.me/invite

    Copyright (C) alexop1000 
    All rights reserved.
*/

pages.settings = (async () => {
    console.log("doing settings")
    const addLabel = (text, key, color) => {
        const betaText = document.createElement('span')
        betaText.setAttribute('class', "text-secondary")
        betaText.setAttribute("style", `padding-left: 3px; color: ${color};`)
        betaText.innerText = text;
        document.getElementById(key + "-name").appendChild(betaText)
    }
    let did = false
    const doSettings = async () => {
        if (did) {
            return
        }
        did = true
        let hasExperiments = await checkExperiments()
        let hasCreator = await get(`https://inventory.roblox.com/v1/users/${cachedUserId}/items/GamePass/24036164`) // no change plz lol just buy it helps out a lot
        if (hasCreator) { hasCreator = hasCreator?.data?.[0] }
        const createSideButton = (category, active) => {
            let sideButton = document.createElement('li')
            sideButton.className = 'menu-option ng-scope' + (active ? ' active' : '')
            sideButton.setAttribute('ui-sref', category.toLowerCase())
            sideButton.innerHTML = `<a class="menu-option-content" style="display: flex;padding: 9px 5px 9px 9px;"> <span class="font-caption-header ng-binding">${category}</span> </a>`
            return sideButton
        }
        const createDropdownButton = async (category) => {
            const dropdown = await first(".input-group-btn.dropdown .dropdown-menu")
            let button = document.createElement('li')
            button.innerHTML = `<a ui-sref="${category.toLowerCase()}">${category}</a>`
            dropdown.appendChild(button)
            return button
        }
        const rogoldBtn = createSideButton("RoGold")
        const vertical = await first("#vertical-menu");
        const toggle = async () => {
            qs(".menu-option.active", vertical).setAttribute('class', 'menu-option ng-scope')
            qs(".user-account-header").textContent = "RoGold Settings"
            rogoldBtn.setAttribute('class', 'menu-option ng-scope active')
            qs("#vertical-menu").innerHTML = ""

            vertical.style.marginBottom = "5px"
            const backButton = document.createElement("a")
            backButton.className = "text-link"
            backButton.textContent = "Back"
            backButton.style.fontSize = "small"
            backButton.href = "/my/account"

            qs(".left-navigation").appendChild(backButton)
            const infoButton = createSideButton("Info", true)
            vertical.appendChild(infoButton)
            const pageContent = qs(".tab-content.rbx-tab-content")
            const savedPages = {}
            const setupPage = (pageName) => {
                if (savedPages[pageName]) {
                    return savedPages[pageName]
                }
                const newPage = document.createElement('div')
                newPage.className = "ng-scope rogold-page hidden rogold-" + pageName
                newPage.innerHTML = `
                <div class="ng-scope">
                    <div class="section">
                        <div class="container-header">
                            <h3>${pageName}</h3>
                        </div>
                        <div class="section-content remove-panel settings-personal-container personal-settings-refactor-enabled">
                            <div class="col-sm-12" id="settings-holder">

                            </div>
                        </div>
                    </div>
                </div>
                `
                pageContent.appendChild(newPage)
                savedPages[pageName] = newPage
                return newPage
            }
            const loadInfoPage = async () => {
                const page = setupPage("Info")
                if (isMobile()) {
                    qs(".tab-dropdown .input-group-btn.dropdown button.dropdown-toggle span.rbx-selection-label").textContent = "Info"
                }
                page.classList.remove("hidden")
                qs(".settings-personal-container", page).innerHTML = `
                    <div class="section-content notifications-section">
                        <div class="security-2svsetting-label btn-toggle-label"> 
                            <div class="btn-toggle-label">RoGold Status</div> 
                            <div class="text-description" id="rogold-status" style="margin-top: 5px;">Loading server status...</div> 
                        </div>
                    </div>
                    <div class="section-content notifications-section">
                        <div class="security-2svsetting-label btn-toggle-label"> 
                            <div class="btn-toggle-label">Update Log</div> 
                            <div class="text-description" id="rogold-update" style="margin-top: 5px;">Loading server status...</div> 
                        </div>
                    </div>
                    <div class="section-content notifications-section">
                        <div class="security-2svsetting-label btn-toggle-label"> 
                            <div class="btn-toggle-label" style="margin-bottom: 5px;">Platforms</div>
                            <a href="https://apps.apple.com/us/app/rogold/id1618599725?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 13px; width: 250px; height: 83px;">
                                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1650499200&h=11b39a51ed6f411304a482235e38eed6" alt="Download on the App Store" style="border-radius: 13px; width: 250px; height: 83px;">
                            </a>
                            <br>
                            <a href="https://rogold.me/chrome" class="rogold-platform">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/2048px-Google_Chrome_icon_%28September_2014%29.svg.png" alt="Install on Chrome" style="border-radius: 13px;width: 40px;height: 40px;">
                            </a>
                            <a href="https://rogold.me/edge" class="rogold-platform">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Microsoft_Edge_logo_%282019%29.png" alt="Install on Edge" style="border-radius: 13px;width: 40px;height: 40px;">
                            </a>
                            <a href="https://rogold.me/firefox" class="rogold-platform">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/1200px-Firefox_logo%2C_2019.svg.png" alt="Install on Firefox" style="border-radius: 13px;width: 40px;height: 40px;">
                            </a>
                            <a href="https://rogold.me/invite" class="rogold-platform">
                                <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Install on Firefox" style="border-radius: 13px;width: 40px;height: 40px;">
                            </a>
                        </div>
                    </div>
                    <div class="section-content notifications-section">
                        <div class="security-2svsetting-label btn-toggle-label"> 
                            <div class="btn-toggle-label">About</div> 
                            <div class="text-description" id="rogold-about" style="margin-top: 5px;">
                                RoGold is made by the Roblox user <a href="/users/50654562/profile" target="_blank" class="text-link">alexop1000</a>.<br>
                                It was created to help developers but expanded out with a plethora of features when the demand came.<br>
                                Check out some of the creator's other projects:
                                <ul>
                                    <li>- <a class="text-link" href="https://www.roblox.com/games/6723408631/PIRATE-Idle-Tappers" target="_blank">Idle Tappers</a></li>
                                    <li>- <a class="text-link" href="https://www.roblox.com/games/3162363365/Summer-Camp-Story" target="_blank">Summer Camp [Story]</a></li>
                                    <li>- <a class="text-link" href="https://www.roblox.com/games/5967519266/SUMMER-Tapping-Inc" target="_blank">Tapping Inc</a></li>
                                </ul>
                            </div> 
                        </div>
                    </div>
                    `
                first("#rogold-status", async (el) => {
                    const status = await cacheValue("StatusPage", async () => {
                        return new Promise(res => {
                            getClient("https://rogold.live/api/info/status?extension=RoGold").then(res)
                        })
                    }, 1000 * 60 * 10)
                    console.log(status)
                    const el2 = qs("#rogold-update")
                    if (status) {
                        el.innerText = status.message
                        el2.innerText = status.updates
                    } else {
                        el.innerText = "Server is unreachable. Please try again later."
                        el2.innerText = "Server is unreachable. Please try again later."
                    }
                })
            }
            let currentPage = "Info"
            qs(".ng-scope", pageContent).remove()
            loadInfoPage()
            const switchInfoPage = async () => {
                if (currentPage != "Info") {
                    currentPage = "Info"
                    qs(".rogold-page:not(.hidden)").classList.add("hidden")
                    loadInfoPage()
                    qs(".menu-option.active", vertical).setAttribute('class', 'menu-option ng-scope')
                    infoButton.setAttribute('class', 'menu-option ng-scope active')
                }
            }
            infoButton.addEventListener('click', switchInfoPage)
            if (isMobile()) {
                (await first(".input-group-btn.dropdown .dropdown-menu")).innerHTML = ""
                const button = await createDropdownButton("Info")
                button.addEventListener('click', switchInfoPage)
            }
            const toggleButton = (key, bool) => {
                document.getElementById(key + "-toggle").className = `btn-toggle receiver-destination-type-toggle${bool && " on" || ""}`
            }
            const addToggler = (key, current, custom, setting) => {
                let lastClick = Date.now()
                document.getElementById(key + "-toggle").addEventListener('click', async () => {
                    if (!hasExperiments && setting.experimental) {
                        return;
                    }
                    if (Date.now() - lastClick > 500) {
                        if (!custom) {
                            toggleButton(key, !current)
                            current = !current
                            await setSetting(key, current)
                            lastClick = Date.now()
                        } else {
                            custom()
                            lastClick = Date.now()
                        }
                    }
                })
            }
            Object.keys(defaultSettings).forEach(async (key) => {
                let category = defaultSettings[key]
                const pageButton = createSideButton(key)
                vertical.appendChild(pageButton)
                let didOnce = false
                const switchToPage = async () => {
                    if (currentPage != key) {
                        currentPage = key
                        qs(".rogold-page:not(.hidden)").classList.add("hidden")
                        const page = setupPage(key)
                        page.classList.remove("hidden")
                        qs(".menu-option.active", vertical)?.setAttribute('class', 'menu-option ng-scope')
                        pageButton.setAttribute('class', 'menu-option ng-scope active')
                        if (isMobile()) {
                            qs(".tab-dropdown .input-group-btn.dropdown button.dropdown-toggle span.rbx-selection-label").textContent = key
                        }
                        if (didOnce) return;
                        didOnce = true
                        Object.keys(category).forEach(async (key) => {
                            let setting = category[key]
                            if (setting.type == "toggle") {
                                const settingElement = document.createElement('div')
                                settingElement.setAttribute('class', 'ng-scope')
                                settingElement.innerHTML = `
                                        <div class="section-content notifications-section">
                                            <span id="${key}-toggle" class="btn-toggle receiver-destination-type-toggle on"> 
                                                <span class="toggle-flip"></span> 
                                                <span id="toggle-on" class="toggle-on"></span> 
                                                <span id="toggle-off" class="toggle-off"></span>
                                            </span>
                                            <div class="security-2svsetting-label btn-toggle-label"> 
                                                <div class="btn-toggle-label" id="${key}-name">${key}</div> 
                                                <div class="rbx-divider"></div> 
                                                <div class="text-description">${setting.description}</div> 
                                            </div>
                                        </div>
                                    `
                                qs('#settings-holder', page).appendChild(settingElement)
                                if (setting.beta) {
                                    addLabel("(BETA)", key, "#D4AF37")
                                } else if (setting.experimental) {
                                    addLabel("(EXPERIMENTAL)", key, "#DC143C")
                                }
                                let current = await getSetting(key)
                                toggleButton(key, current)
                                addToggler(key, current, null, setting)
                                if (!hasExperiments && setting.experimental) {
                                    settingElement.setAttribute('style', `opacity: 0.6;filter: alpha(opacity = 60);`)
                                    document.getElementById(key + "-toggle").setAttribute('style', `opacity: 0;filter: alpha(opacity = 0);`)
                                    document.getElementById(key + "-toggle").innerHTML = ``
                                    document.getElementById(key + "-toggle").setAttribute('class', 'toggle')
                                }
                            } else if (setting.type == "dropdown" || setting.type == "color") {
                                const settingElement = document.createElement('div')
                                settingElement.setAttribute('class', 'form-group visible-container ng-scope')
                                const isColor = setting.type == "color"
                                if (isColor) {
                                    settingElement.innerHTML = `
                                            <div class="form-group visible-container"> 
                                                <label class="text-label account-settings-label" id="${key}-name">${key}</label> 
                                                <span class="tooltip-container" tooltip-placement="bottom-right" uib-tooltip="${setting.description}" style="float:right"> 
                                                    <span class="icon-moreinfo"></span> 
                                                </span> 
                                                <div class="rbx-select-group select-group" style="margin-top: 6px;"> 
                                                    <input type="color" class="input-field rbx-select select-option ng-pristine ng-valid ng-scope ng-not-empty ng-touched" id="${key}">
                        
                                                    </input>
                                                </div> 
                                            </div> 
                                        `
                                } else {
                                    settingElement.innerHTML = `
                                        <div class="form-group visible-container"> 
                                            <label class="text-label account-settings-label" id="${key}-name">${key}</label> 
                                            <span class="tooltip-container" tooltip-placement="bottom-right" uib-tooltip="${setting.description}" style="float:right"> 
                                                <span class="icon-moreinfo"></span> 
                                            </span> 
                                            <div class="rbx-select-group select-group" style="margin-top: 6px;"> 
                                                <span class="icon-arrow icon-down-16x16"></span> 
                                                <select class="input-field rbx-select select-option ng-pristine ng-valid ng-scope ng-not-empty ng-touched" id="${key}">
                    
                                                </select>
                                                <span class="icon-arrow icon-down-16x16"></span> 
                                            </div> 
                                        </div>
                                        `
                                }
                                qs('#settings-holder', page).appendChild(settingElement)
                                let popup = document.createElement('div')
                                popup.setAttribute('uib-tooltip-popup', '')
                                popup.setAttribute('uib-title', '')
                                popup.setAttribute('content', setting.description)
                                popup.setAttribute('origin-scope', "origScope")
                                popup.setAttribute('class', "tooltip ng-scope ng-isolate-scope bottom fade in bottom-right")
                                popup.setAttribute('tooltip-animation-class', "fade")
                                popup.setAttribute('uib-tooltip-classes', "")
                                popup.setAttribute('ng-class', "{ in: isOpen }")
                                popup.innerHTML = `
                                        <div class="tooltip-arrow" style="top: 0px; right: 0px;"></div>
                                        <div class="tooltip-inner ng-binding" ng-bind="content">${setting.description}</div>
                                    `
                                settingElement.querySelector(".tooltip-container").addEventListener('mouseenter', (info) => {
                                    popup.setAttribute('style', `top: ${info.layerY * 1.01}px; left: ${info.layerX / 1.3}px`)
                                    settingElement.querySelector("div").insertBefore(popup, settingElement.querySelector(".rbx-select-group"))
                                })
                                settingElement.querySelector(".tooltip-container").addEventListener('mouseout', () => {
                                    popup.remove()
                                })
                                const keyElement = document.getElementById(key)
                                let selected = await getSetting(key)
                                if (!isColor) {
                                    const customName = document.getElementById(key + " Custom-name")
                                    for (const option of setting.options) {
                                        const optionElement = document.createElement('option')
                                        optionElement.setAttribute('label', option)
                                        if (selected == option) {
                                            optionElement.setAttribute('selected', "selected")
                                            if (selected == "Custom" && customName) {
                                                customName.parentNode.parentNode.setAttribute('style', 'display:block;')
                                            }
                                        }
                                        optionElement.innerHTML = option
                                        keyElement.appendChild(optionElement)
                                    }
                                    keyElement.addEventListener('change', async () => {
                                        selected = keyElement.getElementsByTagName("option")[keyElement.selectedIndex].getAttribute('label')
                                        await setSetting(key, selected)
                                        if (customName) {
                                            customName.parentNode.parentNode.setAttribute('style', selected == "Custom" && 'display:block;' || 'display:none;')
                                        }
                                    })
                                } else {
                                    keyElement.value = selected
                                    keyElement.addEventListener('change', async () => {
                                        selected = keyElement.value
                                        await setSetting(key, selected)
                                    })
                                }
                                if (setting.beta) {
                                    addLabel("(BETA)", key, "#D4AF37")
                                } else if (setting.experimental) {
                                    addLabel("(EXPERIMENTAL)", key, "#FF0000")
                                }
                            } else if (setting.type == "input") {
                                const settingElement = document.createElement('div')
                                settingElement.setAttribute('class', 'form-group visible-container ng-scope')
                                settingElement.innerHTML = `
                                    <div class="form-group visible-container"> 
                                        <label class="text-label account-settings-label" id="${key}-name">${key}</label> 
                                        <input class="form-control input-field ng-pristine ng-valid ng-empty ng-touched" placeholder="${setting.description}" id="${key}-input" maxlength="3"></input> 
                                    </div>
                                `
                                qs('#settings-holder', page).appendChild(settingElement)
                                if (setting.need) {
                                    for (const need in setting.need) {
                                        if (getSetting(need) != setting.need[need]) {
                                            document.getElementById(`${key}-name`).parentNode.parentNode.setAttribute('style', 'display:none;')
                                            break
                                        }
                                    }
                                }
                                const apiValue = await getRates()
                                let selected = await getSetting(key)
                                const inputField = document.getElementById(`${key}-input`)
                                inputField.value = selected || ""
                                inputField.addEventListener('focusout', async () => {
                                    const inputValue = stripTags(inputField.value)
                                    if (currencies.indexOf(inputValue) != -1) {
                                        const rate = apiValue[inputValue]
                                        if (!rate) {
                                            inputField.value = `Could not find a conversion rate for ${inputValue}`
                                            return
                                        } else if (!symbols[inputValue]) {
                                            inputField.value = `No symbol found for currency ${inputValue}`
                                            return
                                        }
                                        await setSetting(key, inputValue)
                                    } else {
                                        if (inputField.value.length <= 3) {
                                            inputField.value = `${inputValue} is not detected as a currency.`
                                        }
                                    }
                                })
                            } else if (setting.type == "multi") {
                                const settingElement = document.createElement('div')
                                settingElement.setAttribute('class', 'ng-scope')
                                settingElement.innerHTML = `
                                        <div class="section-content notifications-section">
                                            <span id="${key}-toggle" class="btn-toggle receiver-destination-type-toggle on"> 
                                                <span class="toggle-flip"></span> 
                                                <span id="toggle-on" class="toggle-on"></span> 
                                                <span id="toggle-off" class="toggle-off"></span>
                                            </span>
                                            <div class="security-2svsetting-label btn-toggle-label" id="${key}-holder"> 
                                                <div class="btn-toggle-label" id="${key}-name">${key}</div> 
                                                <div class="rbx-divider"></div> 
                                                <div class="text-description">${setting.description}</div> 
                                            </div>
                                        </div>
                                    `
                                function setImageBG(image) {
                                    $(".content").css({ "background": "transparent" })
                                    $(".container-footer").addClass("transparent")
                                    $("#rbx-body").css({ "background-image": `url(${image})`, "background-repeat": "repeat" })
                                    $(".content").addClass("transparent")
                                }
                                qs('#settings-holder', page).appendChild(settingElement)
                                let currentSetting = await getSetting("Theme Creator")
                                if (!currentSetting[3]) {
                                    currentSetting[3] = { bc: "", hc: "", nc: "", tc: "", bi: "", "BG Repeat": "repeat", "BG IMG Blend Mode": "normal" }
                                }
                                let currentSelected = [currentSetting[1], currentSetting[2], currentSetting[3]]
                                for (const option of setting.options) {
                                    const section = document.createElement("div")
                                    const traverseList = async () => {
                                        return new Promise((resolve, reject) => {
                                            let addText = ""
                                            if (option.list) {
                                                let i = 0
                                                Object.entries(option.list).forEach(([name, listOption]) => {
                                                    i++
                                                    if (listOption.info) {
                                                        addText += `
                                                                <div style="
                                                                width: 40px; height: 40px; background-color: ${listOption.info["background-color"]}; border-radius: 8px; margin-right: 5px;
                                                                " id="${name}"></div>
                                                            `
                                                    } else if (listOption.colors) {
                                                        const image = chrome.runtime.getURL('/images/backgrounds/' + listOption.styling["background-image"])
                                                        addText += `
                                                                <div style="width: 40px; height: 40px; background-image: url('${image}'); border-radius: 8px; margin-right: 5px;" id="${name}"></div>
                                                            `
                                                    } else {
                                                        if (listOption.cf) {
                                                            addText += `
                                                                    <span class="text-secondary" style="margin-right: 5px; width: 250px;">
                                                                    ${name}<br>
                                                                    <input id="${name}" class="form-control input-field jscolor" data-jscolor="{}" selector="${listOption.sel}" property="${listOption.prop}">
                                                                    </span>
                                                                `
                                                        } else if (listOption.fu) {
                                                            // <div id="${name}" class="form-row">
                                                            //     <label for="file">${listOption.txt}</label>
                                                            //     <input id="file" type="file" name="file" tabindex="1" accept="image/png, image/jpeg">
                                                            //     <span id="file-error" class="error"></span>
                                                            // </div>
                                                            addText += `
                                                                    <span class="text-secondary">
                                                                    ${name}<br>
                                                                    <button id="${name}" class="btn-secondary-md">
                                                                        Select Image
                                                                    </button>
                                                                    </span>
                                                                `
                                                        } else {
                                                            addText += `
                                                                    <span class="text-secondary" style="margin-right: 5px;">
                                                                    ${name}<br>
                                                                    <div class="rbx-select-group select-group"> 
                                                                        <span class="icon-arrow icon-down-16x16"></span> 
                                                                        <select class="input-field rbx-select select-option ng-pristine ng-valid ng-scope ng-not-empty ng-touched" id="${name}">
                                            
                                                                        </select>
                                                                        <span class="icon-arrow icon-down-16x16"></span> 
                                                                    </div> 
                                                                    </span>
                                                            `
                                                        }
                                                    }
                                                    if (i == Object.keys(option.list).length) {
                                                        resolve(addText)
                                                    }
                                                })
                                            } else {
                                                //addText += `<span class="text-secondary">${option.text}</span>`
                                                resolve(addText)
                                            }
                                        })
                                    }
                                    const toAdd = await traverseList()
                                    document.getElementById(key + '-holder').appendChild(section)
                                    section.innerHTML = `
                                            <div class="btn-toggle-label" style="margin-bottom:5px;margin-top:5px;">${option.section}</div>
                                            <a style="display: flex; flex-wrap: wrap;">${toAdd}</a>
                                            ${option.text && `<span class="text-secondary">${option.text}</span>` || ""}
                                        `
                                    const getToRemove = async () => {
                                        return new Promise(resolve => {
                                            const toRemove = []
                                            syncGet(null, (gotten) => {
                                                let i = 1
                                                Object.keys(gotten).forEach(keyGot => {
                                                    if (keyGot.includes("_")) toRemove.push(keyGot);
                                                    if (keyGot.includes("11")) resolve(toRemove);
                                                    if (i == Object.keys(gotten).length) resolve(toRemove);
                                                    i++
                                                })
                                            })
                                        })
                                    }
                                    if (option.list) {
                                        Object.entries(option.list).forEach(([name, item]) => {
                                            const element = document.getElementById(name)
                                            if (!element) return;
                                            if (!item.sel) {
                                                const optionCategory = element.parentNode.parentNode.firstChild.nextSibling.textContent
                                                const preType = optionCategory == "Image Themes" && 2 || optionCategory == "Color Themes" && 1
                                                const boxShadow = "inset 0px 0px 4px 0px #1f87ff, 0px 0px 10px 2px #0b325e, 0px 0px 5px 7px rgb(0 0 0 / 0%)";
                                                if (currentSetting[preType] == name) element.style.boxShadow = boxShadow
                                                element.addEventListener('click', async () => {
                                                    if (!currentSetting[0]) return;
                                                    if (preType) {
                                                        const lastSetting = currentSetting[preType]
                                                        if (lastSetting == name) {
                                                            currentSetting[preType] = "none"
                                                        } else {
                                                            currentSetting[preType] = name
                                                        }
                                                        if (document.getElementById(currentSelected[preType - 1])) document.getElementById(currentSelected[preType - 1]).style.boxShadow = "";
                                                        currentSelected[preType - 1] = currentSetting[preType]
                                                        if (currentSetting[preType] != "none") element.style.boxShadow = boxShadow;
                                                        if (preType == 2) {
                                                            if (currentSetting[preType] == "none") {
                                                                $(".content").removeAttr("style")
                                                                $("#rbx-body").removeAttr("style")
                                                                $(".content").removeClass("transparent")
                                                            } else {
                                                                const image = chrome.runtime.getURL('/images/backgrounds/' + option.list[name].styling["background-image"])
                                                                setImageBG(image)
                                                                if (currentSelected[2].bi != "") {
                                                                    const remove = await getToRemove()
                                                                    if (remove.length > 0) {
                                                                        chrome.storage.sync.remove(remove)
                                                                    }
                                                                    currentSelected[2].bi = ""
                                                                    currentSetting[3].bi = ""
                                                                }
                                                            }
                                                        } else if (preType == 1) {
                                                            if (currentSetting[preType] == "none") {
                                                                $("#rbx-body").attr("rg-touched", false)
                                                                $("#rbx-body").removeClass(option.list[lastSetting].style)
                                                            } else {
                                                                if (option.list[lastSetting]) {
                                                                    $("#rbx-body").removeClass(option.list[lastSetting].style)
                                                                }
                                                                $("#rbx-body").addClass(option.list[name].style)
                                                                $("#rbx-body").attr("rg-touched", true)
                                                            }
                                                        }
                                                        await setSetting(key, currentSetting)
                                                    }

                                                })
                                            } else {
                                                if (!hasCreator) return;
                                                const selected = decapitalize(name)
                                                if (item.cf) {
                                                    let cPicker = new JSColor(element)
                                                    cPicker.onChange = async () => {
                                                        const col = cPicker.toHEXString() == "#FFFFFF" ? "" : cPicker.toRGBString()
                                                        if (element.getAttribute("property") == "color") {
                                                            document.body.setAttribute("tc", "true")
                                                            document.querySelector(":root").style.setProperty("--tc-color", col)
                                                        } else {
                                                            document.querySelector(element.getAttribute("selector")).style.backgroundColor = col
                                                        }
                                                        $("#rbx-body").attr("rg-touched", false)
                                                        for (let child of document.getElementById("Gold").parentElement.children) {
                                                            if (child.style.boxShadow) {
                                                                child.style.boxShadow = ""
                                                            }
                                                        }
                                                        currentSelected[2][selected] = col
                                                        currentSetting[3][selected] = col
                                                        await setSetting(key, currentSetting)
                                                    }
                                                    if (currentSelected[2][selected] != "") {
                                                        element.jscolor.fromString(currentSelected[2][selected])
                                                    }
                                                } else if (item.fu) {
                                                    const fileModal = new Modal("FileModal", "Choose File", "Choose a file from URL or system files.", "For GIF or high quality, use a file from URL.")
                                                    fileModal.removeButton("FileModal-confirm-btn")
                                                    fileModal.addButton(`<input placeholder="URL" class="form-control input-field" value="${currentSetting[3][selected]}" style="cursor: pointer;">`, "FileURL", async (button) => {
                                                        button.style.border = "none"
                                                        button.style.width = "130px"
                                                        const input = button.firstChild
                                                        input.addEventListener("blur", async () => {
                                                            const url = input.value
                                                            if (url.includes("https://") || url.includes("http://")) {
                                                                // Load image and set it using setImageBG
                                                                const image = new Image()
                                                                image.src = url
                                                                image.onload = async () => {
                                                                    setImageBG(url)
                                                                    currentSelected[2][selected] = url
                                                                    currentSetting[3][selected] = url
                                                                    await setSetting(key, currentSetting)
                                                                    const remove = await getToRemove()
                                                                    if (remove.length > 0) {
                                                                        chrome.storage.sync.remove(remove, async () => {
                                                                            console.log("removed")
                                                                            continueSet()
                                                                        })
                                                                    }
                                                                }
                                                            } else if (url == "") {
                                                                currentSelected[2][selected] = url
                                                                currentSetting[3][selected] = url
                                                                await setSetting(key, currentSetting)
                                                            }
                                                        })
                                                    }, false)
                                                    fileModal.addButton(`
                                                        <label for="file" style="background-color: transparent !important;border-color: #bdbebe !important;color: var(--text-color) !important;border-radius: 8px !important;
                                                        border: 1px solid #b8b8b8 !important;cursor: pointer !important;display: inline-block !important;height: auto !important;text-align: center !important;
                                                        white-space: nowrap !important;vertical-align: middle !important;padding: 9px !important;font-size: 16px !important;line-height: 100% !important;background-image: none !important;">Choose File</label>
                                                        <input id="file" type="file" name="file" tabindex="1" accept="image/png, image/jpeg" style="display: none !important;">
                                                        <span id="file-error" class="error"></span>`, "FileUpload", async (button) => {
                                                        button.style.border = "none"
                                                        const canvas = document.createElement("canvas")
                                                        const ctx = canvas.getContext("2d")
                                                        document.getElementById("file").addEventListener("change", async (evt) => {
                                                            const file = document.getElementById("file").files[0]
                                                            if (!file) {
                                                                document.getElementById("file-error").textContent = "Please choose a file."
                                                                return
                                                            }

                                                            const calculateSize = (img, maxWidth, maxHeight) => {
                                                                let width = img.width;
                                                                let height = img.height;
                                                                if (width > maxWidth) {
                                                                    height *= maxWidth / width;
                                                                    width = maxWidth;
                                                                }
                                                                if (height > maxHeight) {
                                                                    width *= maxHeight / height;
                                                                    height = maxHeight;
                                                                }
                                                                return [width, height];
                                                            }
                                                            let target = evt.target
                                                            let files = target.files
                                                            if (FileReader && files && files.length) {
                                                                const fr = new FileReader()
                                                                fr.onload = async () => {
                                                                    let blob = new Blob([fr.result])
                                                                    let blobURL = window.URL.createObjectURL(blob)
                                                                    const img = new Image()
                                                                    img.src = blobURL
                                                                    img.onload = async () => {
                                                                        const [width, height] = calculateSize(img, 1920, 1080)
                                                                        canvas.width = width
                                                                        canvas.height = height
                                                                        ctx.drawImage(img, 0, 0, width, height)
                                                                        let scaled = canvas.toDataURL("image/jpeg", 0.7)
                                                                        if (scaled.length > 95000) {
                                                                            ctx.clearRect(0, 0, canvas.width, canvas.height)
                                                                            const [newwidth, newheight] = calculateSize(img, 500, 500)
                                                                            canvas.width = newwidth
                                                                            canvas.height = newheight
                                                                            ctx.drawImage(img, 0, 0, newwidth, newheight)
                                                                            scaled = canvas.toDataURL("image/jpeg", 0.5)
                                                                        }
                                                                        if (scaled.length > 95000) {
                                                                            return
                                                                        }
                                                                        console.log(scaled.length)
                                                                        currentSelected[2].bi = files[0].name
                                                                        currentSetting[3].bi = files[0].name

                                                                        currentSelected[1] = "none"
                                                                        currentSetting[2] = "none"

                                                                        qs("#FileURL input").value = files[0].name

                                                                        for (let child of document.getElementById("Banana").parentElement.children) {
                                                                            if (child.style.boxShadow) {
                                                                                child.style.boxShadow = ""
                                                                            }
                                                                        }
                                                                        const remove = await getToRemove()
                                                                        const continueSet = async () => {
                                                                            scaled = await syncStore("scaled", scaled)
                                                                            chrome.storage.sync.set(scaled)
                                                                            await setSetting(key, currentSetting)
                                                                        }
                                                                        if (remove.length > 0) {
                                                                            chrome.storage.sync.remove(remove, async () => {
                                                                                continueSet()
                                                                            })
                                                                        } else continueSet();
                                                                        setImageBG(scaled)
                                                                    }
                                                                }
                                                                fr.readAsArrayBuffer(files[0])
                                                            }
                                                        })
                                                    }, false)
                                                    fileModal.addButton(`<button class="btn btn-danger">Reset</button>`, "ResetImage", async (button) => {
                                                        button.style.border = "none"
                                                        button.style.width = "130px"
                                                        const input = button.firstChild
                                                        input.addEventListener("click", async () => {
                                                            currentSelected[2].bi = ""
                                                            currentSetting[3].bi = ""

                                                            const remove = await getToRemove()
                                                            if (remove.length > 0) {
                                                                chrome.storage.sync.remove(remove, async () => {
                                                                    await setSetting(key, currentSetting)
                                                                })
                                                            }

                                                            qs("#FileURL input").value = ""

                                                            currentSelected[1] = "none"
                                                            currentSetting[2] = "none"
                                                            await setSetting(key, currentSetting)
                                                            setImageBG("")
                                                        })
                                                    }, false)
                                                    const elButton = document.getElementById(name)
                                                    elButton.addEventListener('click', async () => {
                                                        fileModal.show()

                                                    })

                                                } else {
                                                    // Dropdown selector for setting with structure: { sel: "#rbx-body", prop: "background-blend-mode", options: [...] }

                                                    for (const optionNew of item.options) {
                                                        const optionElement = document.createElement('option')
                                                        optionElement.setAttribute('label', optionNew.replace(/^\w/, c => c.toUpperCase()))
                                                        if (currentSelected[2][name] == optionNew) {
                                                            optionElement.setAttribute('selected', "selected")
                                                        }
                                                        optionElement.innerHTML = optionNew
                                                        document.getElementById(name).appendChild(optionElement)
                                                    }
                                                    document.getElementById(name).addEventListener('change', async () => {
                                                        let selectedInfo = document.getElementById(name).getElementsByTagName("option")[document.getElementById(name).selectedIndex].getAttribute('label')
                                                        if (selectedInfo == "Normal") {
                                                            document.querySelector(item.sel).style[item.prop] = ""
                                                        } else {
                                                            document.querySelector(item.sel).style[item.prop] = selectedInfo.toLowerCase()
                                                        }
                                                        currentSelected[2][name] = selectedInfo
                                                        currentSetting[3][name] = selectedInfo
                                                        await setSetting(key, currentSetting)
                                                    })
                                                }
                                            }
                                        })
                                    }
                                    toggleButton(key, currentSetting[0])
                                    addToggler(key, currentSetting[0], async () => {
                                        toggleButton(key, !currentSetting[0])
                                        currentSetting[0] = !currentSetting[0]
                                        await setSetting(key, currentSetting)
                                    }, setting)
                                }
                                if (setting.beta) {
                                    addLabel("(BETA)", key, "#D4AF37")
                                } else if (setting.experimental) {
                                    addLabel("(EXPERIMENTAL)", key, "#FF0000")
                                }
                            }
                        })
                    }
                }
                pageButton.addEventListener('click', switchToPage)
                if (isMobile()) {
                    const button = await createDropdownButton(key)
                    button.addEventListener('click', switchToPage)
                }
            })

            setTimeout(async () => {
                // for (const button of qsa('.menu-option')) {
                //     if (button.getAttribute('href') != "?conf=rogold") {
                //         button.addEventListener('click', () => {
                //             rogoldBtn.setAttribute('class', 'menu-option ng-scope')
                //         })
                //     }
                // }
                const getLabel = (txt, href, parentTo) => {
                    const label = document.createElement('a')
                    label.setAttribute('style', `
                        background-color: #4CAF50 !important;
                        color: rgba(255, 255, 255, 1) !important;
                        cursor: pointer !important;
                        display: inline-block !important;
                        height: auto !important;
                        text-align: center !important;
                        white-space: nowrap !important;
                        vertical-align: middle !important;
                        font-size: 16px !important;
                        line-height: 100% !important;
                        background-image: none !important;
                        border-radius: 8px !important;
                        border-width: 1px !important;
                        border-style: solid !important;
                        border-color: #4CAF50 !important;
                        border-image: initial !important;
                        padding: 9px !important;
                        `)
                    label.innerText = txt
                    label.setAttribute('href', href)
                    parentTo.appendChild(document.createElement('br'))
                    parentTo.appendChild(label)
                }
                if (!hasExperiments) {
                    first('.rogold-Experimental .section-content', exp => {
                        getLabel("Get Access!", 'https://www.roblox.com/game-pass/21576212/Experimental', exp);
                        exp.setAttribute('style', `display: flex;flex-direction: column;align-content: flex-start;`)
                    })
                }
                if (!hasCreator) {
                    const TCH = (await first('[id="Theme Creator-holder"] > div:nth-child(6)'))
                    TCH.style.opacity = 0.6
                    getLabel("Get Access To Custom Themes!", 'https://www.roblox.com/game-pass/24036164/Theme-Creator-Custom', await first('[id="Theme Creator-holder"]'))
                }
            }, 100)
        }
        first(".menu-option", async () => {
            vertical.appendChild(rogoldBtn)
            if (window.location.href.includes('?conf=rogold')) toggle();
            rogoldBtn.addEventListener('click', () => {
                if(history.pushState) {
                    history.pushState(null, null, '?conf=rogold');
                }
                else {
                    location.hash = '?conf=rogold';
                }
                toggle()
            })
        })
        if (isMobile()) {
            const dropdown = await first(".input-group-btn.dropdown .dropdown-menu")
            dropdown.innerHTML += `
            <li id="rogold-dropdown"> <a ui-sref="RoGold">RoGold</a> </li>
            `
            qs("#rogold-dropdown").addEventListener('click', () => {
                if(history.pushState) {
                    history.pushState(null, null, '?conf=rogold');
                }
                else {
                    location.hash = '?conf=rogold';
                }
                toggle()
            })
        }
    }

    jscolor.presets.default = {
        format: 'hex', previewPosition: 'right', previewSize: 29,
        backgroundColor: 'rgba(57,57,57,1)', borderColor: 'rgba(0,0,0,1)',
        borderRadius: 6, padding: 9, width: 136, height: 110,
        controlBorderColor: 'rgba(12,12,12,0.87)', sliderSize: 13,
        palette: [
            '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
            '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
            '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
            '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
        ],
        paletteCols: 10,
        hideOnPaletteClick: true,
    };

    function syncStore(key, objectToStore) {
        return new Promise(resolve => {
            if (!chrome.storage.sync.QUOTA_BYTES_PER_ITEM) {
                chrome.storage.sync.QUOTA_BYTES_PER_ITEM = 8192
            }
            var jsonstr = JSON.stringify(objectToStore);
            var i = 0;
            var storageObj = {};

            while (jsonstr.length > 0) {
                var index = key + "_" + i++;

                const maxLength = chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 2;
                var valueLength = jsonstr.length;
                if (valueLength > maxLength) {
                    valueLength = maxLength;
                }

                var segment = jsonstr.substring(0, valueLength);
                for (let j = 0; j < chrome.storage.sync.QUOTA_BYTES_PER_ITEM; j++) {
                    const jsonLength = JSON.stringify(segment).length;
                    if (jsonLength > maxLength) {
                        segment = jsonstr.substring(0, --valueLength);
                    } else {
                        break;
                    }
                }

                storageObj[index] = segment;
                jsonstr = jsonstr.substr(valueLength);
            }
            resolve(storageObj)
        })
    }
    await first(".menu-vertical")
    doSettings()
    setTimeout(doSettings, 5000);
})