const puppeteer = require("puppeteer");

async function scrapeRecipe(url) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url);

  const ingredients = await page.evaluate(s => {
    let li = document.querySelectorAll(s);
    let liArr = [...li];
    let ingredArr = [];
    liArr.forEach(elem => {
      const html = elem.children;
      if (html.length === 2) {
        ingredArr.push(`${html[0].innerText} ${html[1].innerText}`);
      }
    });
    return ingredArr;
  }, "#content > div.recipe > div > article > div.recipe-instructions > section.recipe-ingredients-wrap > ul > li");

  const steps = await page.evaluate(s => {
    const li = document.querySelectorAll(s);
    let liArr = [...li];
    const stepArr = liArr.map(elem => {
      return elem.innerText;
    });
    return stepArr;
  }, "#content > div.recipe > div > article > div.recipe-instructions > section.recipe-steps-wrap > ol > li");

  browser.close();
  //console.log(ingredients);
  //console.log(steps);
  return {
    ingredients,
    steps,
    valid: ingredients.length > 0 && steps.length > 0 ? true : false
  };
}

// scrapeRecipe(
//   "https://cooking.nytimes.com/recipes/1017936-chicken-tacos-with-chipotle?action=click&module=Global%20Search%20Recipe%20Card&pgType=search&rank=13"
// );

module.exports = { scrapeRecipe };
