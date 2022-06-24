// content.js
chrome.runtime.onMessage.addListener(

    function xxxx(request, sender, sendResponse) {
        {
            if (typeof dic === 'undefined') dic = [];
            if (typeof datemax === 'undefined') datemax = '1401/01/01';
            if (request.message == 'clicked_browser_action') {
                setTimeout(function () {
                    xxxx({
                        message: 'again'
                    });
                }, 10000);
                return;
            }
            if (request.message == 'complete' || request.message == 'again') {
                if (window.location.hostname === "ebanking.bankmellat.ir" && document.URL !== "https://ebanking.bankmellat.ir/ebanking/#/dashboard/report/lasttransactionreport") {
                    setTimeout(function () {
                        var request = {
                            message: 'again'
                        };
                        xxxx(request);
                    }, 10000);
                    return;
                }
                var children;
                try {
                    children = $(".text-msg")
                } catch (e) {
                    console.log(e)
                    setTimeout(function () {
                        var request = {
                            message: 'again'
                        };
                        xxxx(request);
                    }, 10);
                    return;
                }
                switch (document.URL.split("?")[0]) {
                    case 'https://messages.google.com/web/conversations/8':
                        var lastTime = '00:00'
                        for (var i = children.length - 1; i >= 0; i--) {
                            re = children[i].innerText.replaceAll(",", "");
                            if (re.includes('رمز'))
                                lastTransDesc = re.split('\n')[0] + " " + re.split('\n')[1]
                            if (re.includes("واريز به حساب") || re.includes("برداشت از حساب")) {
                                date = re.match(/\d{4}\/\d{2}\/\d{2}/)[0]
                                if (date > datemax)
                                    datemax = date;
                                else if (date < datemax)
                                    continue;
                                regexMostanadNumber = /(مستند)(\D*)(\d+)/;
                                matches = re.match(regexMostanadNumber)
                                if (matches)
                                    mostanadNumber = matches[3]
                                else {
                                    mostanadNumber = 0;
                                }
                                if (dic[date + "--" + mostanadNumber + "--mellat"])
                                    continue;
                                var regexTransAccount = /(حساب)(\D*)(\d+)/
                                accountNo = re.match(regexTransAccount)[3];
                                var transType = "";
                                if (re.includes("واريز به حساب"))
                                    transType = "واريز به حساب";
                                if (re.includes("برداشت از حساب"))
                                    transType = "برداشت از حساب";
                                if (re.includes("خريد با کارت"))
                                    transType = "خريد با کارت";
                                if (re.includes("حواله پايا"))
                                    transType = "حواله پایا";
                                regexTransAmount = /(مبلغ)(\D*)(\d+)/;
                                transAmount = re.match(regexTransAmount)[3];
                                if (re.includes("برداشت از حساب"))
                                    transAmount = "-" + transAmount;
                                if (re.includes("چک")) {
                                    regexMostanadNumber = /(سري و سريال چک)(\D*)(\d+)/;
                                    lastTransDesc += re.match(/(سري و سريال چک)(\D*)(\d+)( )(\d+)/);
                                    mostanadNumber = re.match(/(سري و سريال چک)(\D*)(\d+)( )(\d+)/)[3]
                                }

                                prtime = re.match(/\d{2}\:\d{1,}/)[0]
                                console.log(date + "--" + mostanadNumber + "--mellat");
                                regexBalance = /(موجودي)(\D*)(\d+)/
                                matches = re.match(regexBalance)
                                if (matches)
                                    balance = matches[3];
                                dic[date + "--" + mostanadNumber + "--mellat"] = "sms=1&varizMellat=1" + ("&lastTransDesc=" + (lastTransDesc != 0 ? lastTransDesc : "")) + "&transDesc=" + transType + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;
                                lastTransDesc = "";
                            }
                        }
                        break;
                    case 'https://messages.google.com/web/conversations/7':
                        var lastTime = '00:00'
                        for (var i = children.length - 1; i >= 0; i--) {
                            re = children[i].innerText.replaceAll(",", "");
                            if (re.includes("رمز") && !re.includes("اشتباه"))
                                lastTransDesc = re.split('\n')[0] + " " + re.split('\n')[1]
                            if (re.includes("رمز") && re.includes("ورود"))
                                continue;
                            if (re.includes("ديباجي جنوبي"))
                                lastTransDesc += 'حقوق';
                            matches = re.match(/\d{2}\/\d{2}\/\d{2}/)
                            if (matches)
                                date = "14" + matches[0];
                            else
                                continue;
                            if (date > datemax)
                                datemax = date;
                            else if (date < datemax)
                                continue;
                            prtime = re.match(/\d{1,}\:\d{2}/)[0];
                            regexTransAcount = /(واريز به)(\D*)(\d+.{1,})/
                            matches = re.match(regexTransAcount);
                            if (matches) {
                                transType = "واريز به حساب"
                                accountNo = matches[3]
                            }
                            regexTransAcount = /(برداشت از)(\D*)(\d+.{1,})/
                            matches = re.match(regexTransAcount);
                            if (matches) {
                                transType = "برداشت از حساب";
                                accountNo = matches[3];
                            }
                            if (dic[date + "--" + accountNo + "--" + prtime + "--passargad"])
                                continue;
                            regexTransAmount = /(مبلغ)(\D*)(\d+)/;
                            transAmount = re.match(regexTransAmount)[3];
                            if (re.includes("برداشت از") && !re.includes("برداشت چک"))
                                transAmount = "-" + transAmount;
                            regexBalance = /(موجودي)(\D*)(\d+)/;
                            matches = re.match(regexBalance)
                            if (matches)
                                balance = matches[3];
                            dic[date + "--" + accountNo + "--" + prtime + "--passargad"] = "varizMellat=1&lastTransDesc=پاسارگاد " + (lastTransDesc != 0 ? lastTransDesc : "") + "&transDesc=" + transType + "&accountNo=" + accountNo + "&accountNo=" + accountNo + "&mostanad=" + accountNo + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;
                            lastTransDesc = "";
                        }
                        break;
                    case 'https://messages.google.com/web/conversations/2053':
                        return;
                        var lastTime = '00:00'
                        for (var i = children.length - 1; i >= 0; i--) {
                            re = children[i].innerText.replaceAll(",", "");
                            if (re.includes("رمز") && !re.includes("اشتباه"))
                                lastTransDesc = re.split('\n')[0] + " " + re.split('\n')[1]
                            if (re.includes("رمز"))
                                continue;
                            if (re.includes("مبلغ") || re.includes("مانده")) {
                                date = re.match(/\d{4}\/\d{1,}\/\d{1,}/)[0];
                                date = date.split("/")[0] + "/" + date.split("/")[1].padStart(2, "0") + "/" + date.split("/")[2].padStart(2, "0")
                                if (date > datemax)
                                    datemax = date;
                                else if (date < datemax)
                                    continue;
                                mostanadNumber = "";
                                var regexTransAccount = /(حساب)\:(((\D*)(\d+)\-(\d))+)/
                                accountNo = re.match(regexTransAccount)[2].replaceAll("‪", "");
                                regexTransAmount = /(مبلغ)(\D*)(\d+)(\D*)/;
                                transAmount = re.match(regexTransAmount)[3];
                                if (re.match(regexTransAmount)[4].includes("-"))
                                    transAmount = "-" + transAmount;
                                regexMostanadNumber = /(EMPTY)(\D*)(\d+)/;
                                matches = re.match(regexMostanadNumber);
                                if (matches)
                                    mostanadNumber = matches[3];
                                regexMostanadNumber = /(رهگيري)(\D*)(\d+)/;
                                matches = re.match(regexMostanadNumber);
                                if (matches)
                                    mostanadNumber = matches[3];
                                matches = re.match(regexMostanadNumber);
                                if (matches)
                                    mostanadNumber = matches[3];
                                regexMostanadNumber = /(رهـ)(\D*)(\d+)/
                                matches = re.match(regexMostanadNumber)
                                if (matches)
                                    mostanadNumber = matches[3];
                                prtime = "00:01";
                                try {
                                    prtime = re.match(/\d{2}\:\d{1,}/)[0]
                                } catch (e) {
                                    prtime = re.split('\n')[6].split('ساعت:')[1];
                                }
                                if (dic[date + "--" + mostanadNumber + "--" + transAmount + "--Meh"])
                                    continue;
                                regexBalance = '(مانده)(\D)(\d+)'
                                matches = re.match(regexBalance)
                                if (matches)
                                    balance = matches[3];
                                else balance = re.split('\n')[4].split('مانده:')[1];
                                dic[date + "--" + mostanadNumber + "--" + transAmount + "--Meh"] = "varizMellat=1&lastTransDesc= مهر " + (lastTransDesc != 0 ? lastTransDesc : "") + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;
                            }
                        }
                        break;
                    case 'https://messages.google.com/web/conversations/2064':
                        var lastTime = '00:00'
                        for (var i = children.length - 1; i >= 0; i--) {
                            re = children[i].innerText.replaceAll(",", "");

                            transTypeAndAmount = re.split("\n")[1]
                            transType = transTypeAndAmount.split(":")[0]
                            transAmount = 0;
                            if (transTypeAndAmount.split(":").length == 1) {
                                transType = 'واریز'
                                transAmount = transTypeAndAmount.split(":")[0]
                            } else
                                transAmount = transTypeAndAmount.split(":")[1]
                            transAmount = transAmount.substring(transAmount.length - 1) + transAmount.substring(0, transAmount.length - 1)
                            regexTransAccount = /(حساب)(\D*)(\d+)/;
                            accountNo = re.split("\n")[2].split(":")[1];
                            date = "1401" + re.split("\n")[4].split("-")[0];
                            if (date >= datemax)
                                datemax = date;
                            else
                                break;
                            prtime = re.split("\n")[4].split("-")[1];
                            if (dic[date + "--" + prtime + "--" + transAmount + "--Melli"])
                                continue;
                            balance = re.split("\n")[3].split(":")[1];
                            dic[date + "--" + prtime + "--" + transAmount + "--Melli"] = "varizMellat=1&lastTransDesc=ملی" + "&transDesc=" + transType + "&varizColumnsDesc=" + transType + "&accountNo=" + accountNo + "&mostanad=" + accountNo + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;
                        }
                        break;
                    case 'https://www.rb24.ir/pages/accountList':
                        accountNo = 294965877;
                        var table = $('.scrollerTable').tableToJSON({
                            extractor: function (cellIndex, $cell) {
                                // get text from the span inside table cells;
                                // if empty or non-existant, get the cell text
                                return $cell.find('div').text() || $cell.text();
                            }
                        });
                        for (var i in table) {
                            var columns = table[i];
                            date = columns["تاریخ"].replaceAll("‬", "").replaceAll("‭", "");
                            if (date >= datemax)
                                datemax = date;
                            else
                                break;
                            prtime = columns["زمان"].replaceAll("‬", "").replaceAll("‭", "")
                            transAmount = parseInt(replaceFromPer(columns["واریز"].replaceAll(",", "")));
                            transAmountBardasht = parseInt(replaceFromPer(columns["برداشت"].replaceAll(",", "")));
                            if (isNaN(transAmount))
                                transAmount = -1 * transAmountBardasht;
                            mostanadNumber = parseInt(columns["چک/فیش"].replaceAll("‬", "").replaceAll("‭", ""))
                            if (isNaN(mostanadNumber))
                                try {
                                    mostanadNumber = columns['توضیحات'].match(/(\d+)/)[0];
                                } catch (e) {
                                    mostanadNumber = columns['شماره سند']
                                }
                            if (isNaN(mostanadNumber))
                                mostanadNumber = 0
                            transType = columns['توضیحات'].split(" ")[0]
                            varizColumnsDesc = ""
                            if (columns['توضیحات'].split(" ")[1] == "شاپرک")
                                transType = "پذیرنده دکتر"
                            if (columns['توضیحات'].split(" ")[0] == "حواله")
                                transType = columns['توضیحات'].replaceAll(mostanadNumber, "")
                            else if (columns['توضیحات'].split(" ")[0] == "وصولی")
                                transType = "چک  " + mostanadNumber
                            desc = 'دکتر-' + columns['توضیحات'].replaceAll(mostanadNumber, "")
                            balance = columns["موجودی"].replaceAll(",", "").replaceAll("‬", "").replaceAll("‭", "")
                            if (dic[date + "--" + mostanadNumber + "--Doctor"])
                                continue;
                            dic[date + "--" + mostanadNumber + "--Doctor"] = "varizMellat=1&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&lastTransDesc=" + transType + "&transDesc=" + desc + "&varizColumnsDesc=" + transType + "&balance=" + balance;;
                        }
                        break;
                    case 'https://ib.sb24.ir/webbank/viewAcc/defaultBillList.action':
                    case 'https://ib.qmb.ir/webbank/viewAcc/defaultBillList.action':
                    case 'https://ib.qmb.ir/webbank/viewAcc/depositShow.action':
                        var lastTime = '00:00'

                        function replaceFromPer(str) {
                            return str.replaceAll('۰', "0").
                            replaceAll('۱', "1").
                            replaceAll('۲', "2").
                            replaceAll('۳', "3").
                            replaceAll('۴', "4").
                            replaceAll('۵', "5").
                            replaceAll('۶', "6").
                            replaceAll('۷', "7").
                            replaceAll('۸', "8").
                            replaceAll('۹', "9").
                            replaceAll('‪', '').
                            replaceAll('‬', '')
                        }
                        var table = $('.datagrid').tableToJSON({
                            extractor: function (cellIndex, $cell) {
                                // get text from the span inside table cells;
                                // if empty or non-existant, get the cell text
                                return $cell.find('div').text() || $cell.text();
                            }
                        });
                        accountNo = selectedDeposit.value.replaceAll("دریافت اطلاعات ...", "3015-25-8382308-1")

                        for (var i in table) {
                            var columns = table[i];
                            date = replaceFromPer(columns['تاریخ']);
                            if (date >= datemax)
                                datemax = date;
                            else
                                break;
                            extraText = replaceFromPer(columns['جزئیات']).replaceAll("  ", "").split("\n");
                            prtime = extraText.join().split("ساعت")[1].split(",")[1];
                            mostanadNumber = extraText.join().split("شماره سند")[1].split(",")[1];
                            var desc = replaceFromPer(columns['شرح']);
                            if (desc.search('شاپرک') > 0)
                                transType = 'پذيرنده 0'
                            else if (desc.search('کارمزد') > 0)
                                transType = 'کارمزد'
                            else if (desc.search('ساتنا') > 0)
                                transType = 'ساتنا'
                            else {
                                transType = !desc.match(/(\d+)/) ? "_" : (desc.match(/(\d+)/).length == 1) ? desc.match(/(\d+)/)[0] : desc.match(/(\d+)/)[1];
                                if (isNaN(transType))
                                    transType = desc.replaceAll("،", " ").split(" ")[0]
                            }
                            if (desc.search("،") > 0) {
                                if (desc.substring(desc.search("،", "")).search("IR") > 0)
                                    decs = desc.substring(desc.search("،", "")).split("IR")[0];
                                else desc = desc.substring(desc.search("،", ""));
                            }
                            transAmount = parseInt(replaceFromPer(columns['واریز'].replaceAll(",", "")));
                            transAmountBardasht = parseInt(replaceFromPer(columns['برداشت'].replaceAll(",", "")));
                            if (isNaN(parseInt(replaceFromPer(columns['واریز'].replaceAll(",", "")))))
                                transAmount = -1 * transAmountBardasht;
                            if (dic[date + "--" + mostanadNumber + "--Mehr"])
                                continue;
                            balance = parseInt(replaceFromPer(columns['موجودی'].replaceAll(",", "")));
                            dic[date + "--" + mostanadNumber + "--Mehr"] = "varizMellat=1&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&lastTransDesc=" + transType + "&transDesc=" + desc + "&varizColumnsDesc=" + transType + "&balance=" + balance;;
                        }
                        break;
                    case 'https://www.bpmellat.ir/portal/#/customersys/terminal_transaction':
                        var table = $('#mainTable').tableToJSON({
                            extractor: function (cellIndex, $cell) {
                                // get text from the span inside table cells;
                                // if empty or non-existant, get the cell text
                                return $cell.find('div').text() || $cell.text();
                            }
                        });
                        children = $(".table-scroll")[0].firstElementChild.firstElementChild.nextElementSibling.children;
                        for (var i in table) {
                            var columns = table[i];
                            terminalNo = columns['نام شعبه مشتری']
                            transCount = columns['شناسه پایانه']
                            transAmount = columns['تعداد تراکنش']
                            transDate = columns['مبلغ تراکنش']
                            if (transDate > datemax)
                                datemax = transDate;
                            else if (transDate < datemax)
                                continue;
                            if (dic[transDate + "--terminal--" + terminalNo + ""])
                                continue;
                            dic[transDate + "--terminal--" + terminalNo + ""] = "terminalNo=" + terminalNo + "&transCount=" + transCount + "&transAmount=" + transAmount + "&date=" + transDate;
                        }
                        break;
                    case 'https://ebanking.bankmellat.ir/ebanking/#/dashboard/report/lasttransactionreport':
                        var lastTime = '00:00'
                        var table = $('.report-table').tableToJSON({
                            extractor: function (cellIndex, $cell) {
                                // get text from the span inside table cells;
                                // if empty or non-existant, get the cell text
                                if (cellIndex == 10 && $cell.find('.fa-arrow-down').length == 1)
                                    return '-' + $cell.text();
                                return $cell.find('div').text() || $cell.text();
                            }
                        });
                        accountNo = intAccountNo.value;
                        for (var i in table) {
                            var columns = table[i];
                            date = columns['تاریخ'];
                            if (date > datemax)
                                datemax = date;
                            else if (date < datemax)
                                continue;
                            prtime = columns['زمان'];
                            mostanadNumber = columns['سریال'];
                            transType = columns['واریز کننده / ذینفع'];
                            desc = columns['شرح'];
                            transAmount = parseInt(columns['مبلغ'].replaceAll(",", ""));
                            if (dic[date + "--" + mostanadNumber + "--mellat"])
                                continue;
                            balance = parseInt(columns['مانده'].replaceAll(",", ""));
                            dic[date + "--" + mostanadNumber + "--mellat"] = "varizMellat=1&lastTransDesc=" + transType + "&transDesc=" + desc + "&varizColumnsDesc=" + transType + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;
                        }
                        break;
                    case 'https://my.bmi.ir/portalserver/home#/transaction':
                        // Parse HTML table element to JSON array of objects
                        function parseHTMLTableElem(tableEl) {
                            const columns = Array.apply(null, Array(9)).map(function (_, i) {
                                return i;
                            });

                            const rows = tableEl.querySelectorAll('li.list-group-item ')
                            return Array.from(rows).map(row => {
                                if (row.querySelectorAll('div > div >div >div').length < 18) {
                                    row.firstElementChild.click();
                                    return
                                }
                                const cells = Array.from(row.querySelectorAll("div.col-lg-6 , div.counterparty-name"))
                                return columns.reduce((obj, col, idx) => {
                                    obj[col] = (cells[idx]) ? cells[idx].textContent : ""
                                    return obj
                                }, {})
                            })
                        }
                        var lastTime = '00:00'
                        accountNo = $(".lp-acct-name")[0].innerText.split("\n")[1];
                        var table = parseHTMLTableElem(document.querySelector("#transactionList"))
                        if (!table[0]) 
                        {
                        setTimeout(function () {
                            xxxx({
                                message: 'again'
                            });
                        }, 100)
                        return ;
                    };                        
                        for (var i in table) {
                            var columns = table[i];
                            desc = columns[0].replaceAll("  ", "").replaceAll("\n", "").replaceAll("Name", "");
                            Object.values(columns).forEach(column => { if(column == "") return
                                if (column.match(/زمان تراکنش :/)) {
                                    dateStr = column.split(" زمان تراکنش :")[1].split(",")[0].split(" ");
                                    date = dateStr[29] + dateStr[28].replace("مهر", "07").replace("آبان", "08").replace("آذر", "09").replace("دی", "10").replace("بهمن", "11") + (parseInt(dateStr[27]) < 10 ? '0'+dateStr[27]:dateStr[27] ) ;
                                    if (date > datemax)
                                        datemax = date;
                                    prtime = column.split(" زمان تراکنش :")[1].replaceAll(" ", "").replaceAll("\n", "").split(",")[1];
                                } else if (column.match(/شماره پیگیری :/)) {
                                    //branch = columns[3].match(/\d+/)[0]
                                    mostanadNumber = column.match(/\d+/)[0];
                                } else if (column.match(/سایر توضیحات :/)) {
                                    match = column.match(/(\d+)\D(\d+)\D(\d+)/)
                                    if (match)
                                        if (match.length > 1)
                                            transType = match[match.length - 2];
                                        else transType = column
                                } else if (column.match(/مبلغ تراکنش :/)) {
                                    transAmount = 0;
                                    match = column.replaceAll("٬", "").match(/(\d+)(-*)/)
                                    if (match)
                                        if (match.length != 1)
                                            transAmount = match[2] + match[1];
                                        else transAmount = match[1]
                                } else if (column.match(/مانده حساب :/)) {
                                    balance = column.replaceAll("٬", "").match(/\d+/)[0];
                                }
                            });
                            if (dic[date + "--" + mostanadNumber + "--mellat"])
                                continue;
                            dic[date + "--" + mostanadNumber + "--mellat"] = "varizMellat=1&lastTransDesc=" + transType + "&transDesc=" + desc + "&varizColumnsDesc=" + transType + "&accountNo=" + accountNo + "&mostanad=" + mostanadNumber + "&date=" + date + "&time=" + prtime + "&transAmount=" + transAmount + "&balance=" + balance;

                        }
                        break;
                }
                nextUrl()
                setTimeout(function () {
                    xxxx({
                        message: 'again'
                    });
                }, 10);
            }
        }
    }

);

function nextUrl() {
    for (var i = 0; i < $(".list-item").length; i++) {
        if ($(".list-item")[i].children[2].classList[1] == 'unread' && (
                $(".list-item")[i].href === "https://messages.google.com/web/conversations/8" ||
                $(".list-item")[i].href === "https://messages.google.com/web/conversations/7" ||
                $(".list-item")[i].href === "https://messages.google.com/web/conversations/2053" ||
                $(".list-item")[i].href === "https://messages.google.com/web/conversations/2064")) {
            if (window.location.hostname === "messages.google.com") {
                xxxx();
                return;
            }
        }
    }
    updateWithURL(dic)
}

function updateWithURL(dic) {
    var balance = 0;
    var timeIndex = 0;
    for (var key in dic) {
        if (key.split("--")[0] == datemax) {
            timeIndex++;
            setTimeout(function (key) {
                if (dic[key] != 'done')
                    chrome.runtime.sendMessage({
                        "message": "open_new_tab",
                        "url": dic[key]
                    });
                dic[key] = 'done';
            }, 10000 * timeIndex, key);
        }
    }
}
var lastTransDesc;