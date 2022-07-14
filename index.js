require("dotenv").config();

const puppeteer = require("puppeteer");
const devices = puppeteer.devices;
const iPad = devices["iPad"];

// Configuration des options chrome

const chromeOptions = {
  headless: false,
  defaultViewport: null,
};

// Le lien qui nous permettra de rechercher un tag
const search = `https://www.instagram.com/explore/tags/`;

// Les tags que nous allons chercher
const tags = ["Damso", "Sasuke", "Kirito"];

(async () => {
  // Les variables environementales
  const email = process.env.EMAIL;
  const pass = process.env.PASS;
  const url = process.env.URL;

  // Initialisation du navigateur
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.emulate(iPad);
  // Navigation vers la page de connexion
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  // Remplissage du formulaire de connexion
  await page.click('input[type="text"]');
  await page.type('input[type="text"]', email, { delay: 50 });
  await page.click('input[type="password"]');
  await page.type('input[type="password"]', pass, { delay: 50 });

  // Connexion vers la page d'acceuil
  await page.waitForTimeout(5000);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(10000);

  // Execution sur la barre de recherche
  for (let i = 0; i < tags.length; i++) {
    // Recherche de notre tags
    const link = search + tags[i];
    await page.goto(link, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(15000);

    for (let y = 1; y <= 3; y++) {
      // Selection des 3 premiers résultat recemment publié
      let photos = "article > div:nth-child(3)";
      let photo = photos + ` > div > div:nth-child(1) > div:nth-child(${y})`;

      // Click sur la premiere photo
      await page.click(photo);
      await page.waitForTimeout(15000);

      // Click sur le bouton "Like"
      let heart = "section > span > button";
      await page.click(heart);
      await page.waitForTimeout(5000);
      //  Fermer la fenetre de la photo
      let close = "div > div > div:nth-child(2) > div[role='button']";
      await page.click(close);
      await page.waitForTimeout(5000);
    }
  }
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();
