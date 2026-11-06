/* ==========================================================================
   main.js: the one external JavaScript file for every page of the LvL UP website.
   Linked at the end of the <head> of each page with the defer attribute, so it runs after the page has loaded
   (script integration: IIE, 2026).
   Code that goes beyond the module manual carries an in-text citation that matches the Referencing block
   at the bottom of this file.
   ========================================================================== */


/* ---------- 1. TURN ON THE SCROLL ANIMATIONS ----------
   Adding the class "js" to the page tells the style sheet that JavaScript works, so the .reveal
   animations are only used when they can actually run (Mozilla, n.d.c). */
document.documentElement.classList.add("js");


/* ---------- 2. CURRENT YEAR IN THE FOOTER ----------
   Same idea as the date script in the module manual: new Date() and getFullYear() (IIE, 2026). */
function showYear() {
    var yearSpot = document.getElementById("year");
    if (yearSpot != null) {
        var theDate = new Date();
        yearSpot.innerHTML = theDate.getFullYear();
    }
}


/* ---------- 3. SCROLL REVEAL ----------
   Cards, sections and table rows fade in as they scroll into view.
   IntersectionObserver tells us when an element enters the screen (Mozilla, n.d.a). */
function setUpReveal() {
    var things = document.querySelectorAll("main > section, main > figure, article, main > p.cta, main > form fieldset");  /* (Mozilla, n.d.d) */
    var i;
    for (i = 0; i < things.length; i++) {
        things[i].classList.add("reveal");
    }

    if (!("IntersectionObserver" in window)) {
        /* very old browser: just show everything */
        for (i = 0; i < things.length; i++) {
            things[i].classList.add("visible");
        }
        return;
    }

    var watcher = new IntersectionObserver(function (entries) {
        var n;
        for (n = 0; n < entries.length; n++) {
            if (entries[n].isIntersecting) {
                entries[n].target.classList.add("visible");
                watcher.unobserve(entries[n].target);   /* animate only once */
            }
        }
    }, { threshold: 0.12 });

    for (i = 0; i < things.length; i++) {
        watcher.observe(things[i]);
    }
}


/* ---------- 4. DROP-DOWN MENUS ----------
   The menus are HTML <details> elements. Clicking anywhere else on the page closes them. (Mozilla, n.d.b) */
function setUpMenus() {
    document.addEventListener("click", function (event) {
        var menus = document.querySelectorAll("nav details");   /* (Mozilla, n.d.d) */
        var i;
        for (i = 0; i < menus.length; i++) {
            if (!menus[i].contains(event.target)) {
                menus[i].removeAttribute("open");
            }
        }
    });
}


/* ---------- 4b. CLOSE THE MENUS WITH THE ESCAPE KEY ----------
   Keyboard users can press Escape to close an open drop-down or the phone menu, and the focus goes back to the Menu button.
   The keydown event tells us which key was pressed (Mozilla, n.d.h). */
function setUpEscapeKey() {
    document.addEventListener("keydown", function (event) {
        if (event.key != "Escape") { return; }

        var dropdowns = document.querySelectorAll("nav details");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            dropdowns[i].removeAttribute("open");
        }

        var menu = document.getElementById("menu");
        var button = document.getElementById("menuButton");
        if (menu != null && button != null && menu.classList.contains("open")) {
            toggleMenu();
            button.focus();
        }
    });
}


/* ---------- 5. SHARED HELPERS FOR THE FORMS ----------
   Checking that a field is not empty, and the required and pattern rules used in the HTML forms, follow the
   W3Schools form validation page (W3Schools, n.d.; contributed by ST10538810).
   The messages appear straight away, next to the field that has the problem, and say in plain words how to fix it.
   This follows two of Nielsen's usability heuristics: "Visibility of system status" and
   "Help users recognize, diagnose, and recover from errors" (Nielsen, 2024; contributed by ST10538810). */

/* Puts a message under a form field, and colours the field red (invalid) or green (valid).
   The error <span> is created the first time it is needed (Mozilla, n.d.e). */
function setFieldState(field, message) {
    var errorBox = document.getElementById(field.id + "Error");
    if (errorBox == null) {
        errorBox = document.createElement("span");
        errorBox.id = field.id + "Error";
        errorBox.className = "field-error";
        field.parentNode.appendChild(errorBox);
    }

    field.classList.add("touched");
    if (message == "") {
        field.classList.remove("invalid");
        field.classList.add("valid");
        errorBox.innerHTML = "";
    } else {
        field.classList.remove("valid");
        field.classList.add("invalid");
        errorBox.innerHTML = message;
    }
}

/* Shows or hides the red message box at the top of a form */
function showFormMessage(boxId, message) {
    var box = document.getElementById(boxId);
    if (box == null) { return; }
    if (message == "") {
        box.className = "form-message";
        box.innerHTML = "";
    } else {
        box.className = "form-message show";
        box.innerHTML = message;
    }
}

/* Writes a number of cents as rand, with a comma for thousands, e.g. 245813 becomes R2,458.13 */
function formatRand(cents) {
    var rands = Math.floor(cents / 100);
    var rest = cents % 100;
    var restText = rest < 10 ? "0" + rest : "" + rest;
    var randsText = ("" + rands).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "R" + randsText + "." + restText;
}

/* Today's date as text in the form 2026-11-05, to stop a booking in the past */
function todayText() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
}


/* ---------- 6. CALCULATE FEES PAGE ---------- */

/* The checkboxes on the page: each one's fee is read from the table cell next to it. */
function getTickedItems() {
    var boxes = document.getElementsByName("items");
    var ticked = [];
    var i;
    for (i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            var row = boxes[i].parentNode.parentNode;            /* the table row <tr> */
            var name = row.cells[1].innerText;
            var feeText = row.cells[3].innerText;                /* e.g. R1,500 */
            var fee = parseInt(feeText.replace(/[^0-9]/g, ""), 10) * 100;   /* work in cents to avoid rounding errors */
            ticked.push({ name: name, fee: fee });
        }
    }
    return ticked;
}

/* The quote updates the moment a box is ticked, so visitors always see what their choices cost
   (Nielsen, 2024: visibility of system status; contributed by ST10538810).
   Works out the quote: subtotal, discount (2 = 5%, 3 = 10%, 4+ = 15%), then 15% VAT on the discounted amount.
   The rules come from the brief and the existing worked example on the page. */
function calculateTotal() {
    var output = document.getElementById("quoteOutput");
    if (output == null) { return; }

    /* highlight the ticked table rows */
    var boxes = document.getElementsByName("items");
    var b;
    for (b = 0; b < boxes.length; b++) {
        var tableRow = boxes[b].parentNode.parentNode;
        if (boxes[b].checked) {
            tableRow.classList.add("selected");
        } else {
            tableRow.classList.remove("selected");
        }
    }

    var items = getTickedItems();
    if (items.length == 0) {
        output.innerHTML = "<p>Tick at least one package or experience above to see your quote.</p>";
        return;
    }

    var subtotal = 0;
    var lines = "";
    var i;
    for (i = 0; i < items.length; i++) {
        subtotal += items[i].fee;
        lines += '<div class="quote-line"><span>' + items[i].name + "</span><span>" + formatRand(items[i].fee) + "</span></div>";
    }

    var discountPercent = 0;
    if (items.length == 2) {
        discountPercent = 5;
    } else if (items.length == 3) {
        discountPercent = 10;
    } else if (items.length >= 4) {
        discountPercent = 15;
    }

    var discount = Math.round(subtotal * discountPercent / 100);
    var afterDiscount = subtotal - discount;
    var vat = Math.round(afterDiscount * 15 / 100);
    var total = afterDiscount + vat;

    lines += '<div class="quote-line"><span>Subtotal (' + items.length + " booking" + (items.length == 1 ? "" : "s") + ")</span><span>" + formatRand(subtotal) + "</span></div>";
    lines += '<div class="quote-line"><span>Discount (' + discountPercent + "%)</span><span>-" + formatRand(discount) + "</span></div>";
    lines += '<div class="quote-line"><span>Subtotal after discount</span><span>' + formatRand(afterDiscount) + "</span></div>";
    lines += '<div class="quote-line"><span>VAT (15%)</span><span>' + formatRand(vat) + "</span></div>";
    lines += '<div class="quote-total"><span>TOTAL</span><span>' + formatRand(total) + "</span></div>";
    lines += "<p><small>Quotation only, not a formal invoice. A consultant will contact you to confirm your booking and total.</small></p>";

    output.innerHTML = lines;
}

/* Checks the whole booking form. Runs when the form is submitted (onsubmit="return validateBookingForm()").
   Returning false stops the form from being sent. Error handling = a clear message under every wrong field. */
function validateBookingForm() {
    var allGood = true;
    var firstBad = null;

    function check(field, message) {
        setFieldState(field, message);
        if (message != "") {
            allGood = false;
            if (firstBad == null) { firstBad = field; }
        }
    }

    var fullName = document.getElementById("fullName");
    var nameValue = fullName.value.trim();
    if (nameValue == "") {
        check(fullName, "Please enter your full name.");
    } else if (nameValue.length < 2 || !/^[A-Za-z ]+$/.test(nameValue)) {
        check(fullName, "Use letters and spaces only (at least 2 letters).");
    } else {
        check(fullName, "");
    }

    var phone = document.getElementById("phone");
    if (phone.value.trim() == "") {
        check(phone, "Please enter your phone number.");
    } else if (!/^0[0-9]{9}$/.test(phone.value.trim())) {
        check(phone, "Enter a 10-digit number starting with 0, e.g. 0821234567.");
    } else {
        check(phone, "");
    }

    var email = document.getElementById("email");
    var emailValue = email.value.trim();
    if (emailValue == "") {
        check(email, "Please enter your email address.");
    } else if (!(emailValue.includes("@") && emailValue.includes("."))) {   /* same check as the module manual's validateForm */
        check(email, "That does not look like an email address. Example: name@email.com");
    } else {
        check(email, "");
    }

    var eventType = document.getElementById("eventType");
    check(eventType, eventType.value == "" ? "Please choose the type of event." : "");

    var eventDate = document.getElementById("eventDate");
    if (eventDate.value == "") {
        check(eventDate, "Please pick the event date.");
    } else if (eventDate.value < todayText()) {
        check(eventDate, "The event date cannot be in the past.");
    } else {
        check(eventDate, "");
    }

    var address = document.getElementById("address");
    check(address, address.value.trim().length < 5 ? "Please enter the event address (at least 5 characters)." : "");

    var itemsMessage = "";
    if (getTickedItems().length == 0) {
        itemsMessage = "Please tick at least one package or experience.";
        allGood = false;
    }
    var quoteOutput = document.getElementById("quoteOutput");
    if (itemsMessage != "" && quoteOutput != null) {
        quoteOutput.innerHTML = '<p class="field-error">' + itemsMessage + "</p>";
    }

    if (!allGood) {
        showFormMessage("bookingMessage", "Please fix the highlighted fields and try again.");
        var target = firstBad != null ? firstBad : document.getElementById("quoteOutput");
        if (target != null) { target.scrollIntoView({ behavior: "smooth", block: "center" }); }
        return false;
    }

    showFormMessage("bookingMessage", "");
    return true;
}

/* A "BOOK NOW" button on a package page opens this page with ?item=ultimate-gamer-pass in the address,
   so that item is already ticked. URLSearchParams reads the address (Mozilla, n.d.f). */
function tickItemFromAddress() {
    var wanted = new URLSearchParams(window.location.search).get("item");
    if (wanted == null) { return; }
    var boxes = document.getElementsByName("items");
    var i;
    for (i = 0; i < boxes.length; i++) {
        if (boxes[i].value == wanted) {
            boxes[i].checked = true;
        }
    }
}

/* Validate a field as soon as the user leaves it, so mistakes show straight away */
function setUpLiveValidation(formId) {
    var form = document.getElementById(formId);
    if (form == null) { return; }
    form.noValidate = true;   /* we show our own messages. Without JavaScript the HTML "required" checks still work. */

    var fields = form.querySelectorAll("input[type=text], input[type=email], input[type=tel], input[type=date], select, textarea");  /* (Mozilla, n.d.d) */
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].addEventListener("blur", function () {   /* (Mozilla, n.d.b) */
            if (formId == "bookingForm") {
                validateOneBookingField(this);
            } else {
                validateOneContactField(this);
            }
        });
    }
}

function validateOneBookingField(field) {
    var v = field.value.trim();
    var message = "";
    if (field.id == "fullName") {
        message = v == "" ? "Please enter your full name." : (!/^[A-Za-z ]{2,}$/.test(v) ? "Use letters and spaces only (at least 2 letters)." : "");
    } else if (field.id == "phone") {
        message = v == "" ? "Please enter your phone number." : (!/^0[0-9]{9}$/.test(v) ? "Enter a 10-digit number starting with 0." : "");
    } else if (field.id == "email") {
        message = v == "" ? "Please enter your email address." : (!(v.includes("@") && v.includes(".")) ? "That does not look like an email address." : "");
    } else if (field.id == "eventType") {
        message = v == "" ? "Please choose the type of event." : "";
    } else if (field.id == "eventDate") {
        message = v == "" ? "Please pick the event date." : (v < todayText() ? "The event date cannot be in the past." : "");
    } else if (field.id == "address") {
        message = v.length < 5 ? "Please enter the event address (at least 5 characters)." : "";
    }
    setFieldState(field, message);
}


/* ---------- 7. CONTACT PAGE ---------- */
function validateContactForm() {
    var allGood = true;

    var name = document.getElementById("contactName");
    var nameValue = name.value.trim();
    if (nameValue == "" || !/^[A-Za-z ]+$/.test(nameValue)) {
        setFieldState(name, nameValue == "" ? "Please enter your name." : "Use letters and spaces only.");
        allGood = false;
    } else {
        setFieldState(name, "");
    }

    var detail = document.getElementById("contactDetail");
    var detailValue = detail.value.trim();
    var looksLikeEmail = detailValue.includes("@") && detailValue.includes(".");
    var looksLikePhone = /^0[0-9]{9}$/.test(detailValue);
    if (!(looksLikeEmail || looksLikePhone)) {
        setFieldState(detail, "Enter a valid email address or a 10-digit phone number starting with 0.");
        allGood = false;
    } else {
        setFieldState(detail, "");
    }

    var methods = document.getElementsByName("contactMethod");
    var picked = false;
    var i;
    for (i = 0; i < methods.length; i++) {
        if (methods[i].checked) { picked = true; }
    }
    if (!picked) { allGood = false; }

    if (!allGood) {
        showFormMessage("contactMessageBox", picked ? "Please fix the highlighted fields and try again." : "Please choose how you would like us to contact you, and fix any highlighted fields.");
        return false;
    }

    showFormMessage("contactMessageBox", "");
    return true;
}

function validateOneContactField(field) {
    var v = field.value.trim();
    var message = "";
    if (field.id == "contactName") {
        message = v == "" ? "Please enter your name." : (!/^[A-Za-z ]+$/.test(v) ? "Use letters and spaces only." : "");
    } else if (field.id == "contactDetail") {
        var okEmail = v.includes("@") && v.includes(".");
        var okPhone = /^0[0-9]{9}$/.test(v);
        message = (okEmail || okPhone) ? "" : "Enter a valid email address or a 10-digit phone number starting with 0.";
    } else {
        return;
    }
    setFieldState(field, message);
}


/* ---------- 8. PHONE MENU ----------
   On phones and tablets the menu is hidden behind a "Menu" button. toggleMenu() adds or removes the class "open",
   and updates aria-expanded so screen readers know whether the menu is open (Mozilla, n.d.c; Mozilla, n.d.g). */
function toggleMenu() {
    var menu = document.getElementById("menu");
    var button = document.getElementById("menuButton");
    if (menu == null || button == null) { return; }

    var isOpen = menu.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    button.innerHTML = isOpen ? "Close" : "Menu";
}


/* ---------- 9. START EVERYTHING WHEN THE PAGE HAS LOADED ---------- */
showYear();
setUpReveal();
setUpMenus();
setUpEscapeKey();
setUpLiveValidation("bookingForm");
setUpLiveValidation("contactForm");
tickItemFromAddress();
calculateTotal();


/* ==========================================================================
   Referencing (Harvard Anglia style)

   The Independent Institute of Education (IIE) (2026) Web Development (Introduction) WEDE5020 Module Manual, Learning Unit 6: Building Functionality into Websites. Johannesburg: IIE.
   Mozilla (n.d.a) Intersection Observer API - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API (Accessed: 5 November 2026).
   Mozilla (n.d.b) EventTarget: addEventListener() method - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener (Accessed: 5 November 2026).
   Mozilla (n.d.c) Element: classList property - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList (Accessed: 5 November 2026).
   Mozilla (n.d.d) Document: querySelectorAll() method - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll (Accessed: 5 November 2026).
   Mozilla (n.d.e) Document: createElement() method - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement (Accessed: 5 November 2026).
   Mozilla (n.d.f) URLSearchParams - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams (Accessed: 5 November 2026).
   Mozilla (n.d.g) Element: setAttribute() method - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute (Accessed: 6 November 2026).
   Mozilla (n.d.h) Element: keydown event - MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event (Accessed: 6 November 2026).
   Nielsen, J. (2024) 10 usability heuristics for user interface design. Nielsen Norman Group. Available at: https://www.nngroup.com/articles/ten-usability-heuristics/ (Accessed: 4 November 2026). Source contributed by ST10538810.
   W3Schools (n.d.) JavaScript form validation. Available at: https://www.w3schools.com/js/js_validation.asp (Accessed: 4 November 2026). Source contributed by ST10538810.
   ========================================================================== */
