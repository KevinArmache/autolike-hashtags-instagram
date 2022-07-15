require("dotenv").config();

const puppeteer = require("puppeteer");
const devices = puppeteer.devices;
const iPad = devices["iPhone 13"];

// Configuration des options chrome

const chromeOptions = {
  headless: false,
  defaultViewport: null,
};

// Le lien qui nous permettra de rechercher un tag
const search = `https://www.instagram.com/explore/tags/`;

// Les tags que nous allons chercher
const tags = ["Naruto", "Sasuke"];

(async () => {
  // Les variables environementales
  const email = process.env.EMAIL;
  const pass = process.env.PASS;
  const url = "https://instagram.com/accounts/login";

  // Initialisation du navigateur
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.emulate(iPad);
  // Navigation vers la page de connexion
  await page.goto(url, { waitUntil: "networkidle2" });
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

  // Exécution sur la barre de recherche
  for (let i = 0; i < tags.length; i++) {
    // Recherche de notre tags
    let link = search + tags[i];
    await page.goto(link, { waitUntil: "networkidle2" });
    await page.waitForTimeout(10000);

    // Sélection des 3 premiers résultats récemment publiés

    for (let y = 1; y <= 3; y++) {
      // Sélection des 3 premiers résultats récemment publiés
      let photos = "article > div:nth-child(3) > div";
      let photo = photos + ` > div:nth-child(1) > div:nth-child(${y})`;
      await page.waitForTimeout(5000);

      // Click sur la premiere photo
      await page.click(photo);
      await page.waitForSelector("div[aria-hidden='true']");
      await page.waitForTimeout(5000);

      // Click sur le bouton "Like"
      await page.waitForSelector("section > span > button[type='button']");
      let heart = "section > span > button[type='button']";
      let redheart = "svg[aria-label='Je n’aime plus']";
      await page.waitForSelector("nav > div > header > div > div");
      let close = "nav > div > header > div > div";

      if ((await page.$(redheart)) !== null) {
        // Si la photo est déjà likée, on ferme la fenêtre
        await page.click(close);
        await page.waitForTimeout(10000);
      } else {
        // Sinon, on clique sur le bouton "Like"
        await page.click(heart);
        await page.waitForTimeout(10000);
        await page.click(close);
        await page.waitForTimeout(5000);
      }
    }
  }
  // await page.screenshot({ path: "example.png" });
  await browser.close();
})();

// BUG : LE SCRIPT NE LIKE PAS LA DEUXIEME PHOTO IL LIKE DIRECTEMENT LA TROISIEME
// DES PHOTOS RECEMEMENT PUBLIEES DU HASHTAGS
