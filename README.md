# LvL UP: Gaming & Esports Arena (website)

Website for **Task 3** of our XHAW5112 POE (Group 7). LvL UP is a **fictional, make-believe business** created to show our web design and coding skills. The reviews on the home page are sample reviews written for this project.

## Links

| What | Link |
|---|---|
| Published website | _to be added_ |
| Figma wireframes | _to be added_ |
| Mobile app repository | _to be added_ |
| Video presentation (YouTube, unlisted) | _to be added_ |
| PowerPoint presentation | _to be added to this repository_ |

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| About Us | `about.html` |
| Gaming Packages (summary) | `gaming-packages.html` |
| Ultimate Gamer Pass | `ultimate-gamer-pass.html` |
| VIP Gaming Experience | `vip-gaming-experience.html` |
| Esports Training Package | `esports-training-package.html` |
| Birthday Party Package | `birthday-party-package.html` |
| Individual Experiences (summary) | `individual-experiences.html` |
| Virtual Reality Experience | `virtual-reality-experience.html` |
| Racing Simulator Challenge | `racing-simulator-challenge.html` |
| Escape Room Challenge | `escape-room-challenge.html` |
| Calculate Total Fees | `calculate-fees.html` |
| Request Received | `request-received.html` |
| Contact (with map) | `contact.html` |

## What the website does

- **Drop-down menus** for Gaming Packages and Experiences, and a Menu button on phones and tablets.
- **Calculate Total Fees:** the visitor ticks packages and experiences, and the quote updates live. Discounts are 5% for 2 bookings, 10% for 3 and 15% for 4 or more, then 15% VAT is added. The result is a quote, not an invoice.
- **Error handling:** every form field is checked, and a clear message appears next to any field that is wrong.
- **Tables:** the booking list, the discount structure, the worked example and the About Us quick facts.
- **Contact:** phone, email, social media, the address and an embedded map.
- **Responsive design:** laptop, tablet and phone layouts.

## Project structure

```
index.html, about.html, ...   the 14 pages
css/styles.css                the one style sheet (design system and responsive layout)
javascript/main.js            the fee calculator, form validation and menu
images/                       logo files and images/photos/ (licensed photographs)
```

## Run it on your computer

Open `index.html` in a browser, or start a small local server from this folder:

```
python -m http.server 5500
```

then go to http://localhost:5500

## Credits and references

- Photographs are from [Pexels](https://www.pexels.com) and are credited, in Harvard Anglia style, in the code comments of each page and in the "References" block at the bottom of each file.
- Every technique that goes beyond our module manual has an in-text citation in the code and a full reference at the bottom of the file.
- Fonts: Orbitron, Rajdhani and Poppins from Google Fonts.
