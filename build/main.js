import { isValidNum, randomNumber } from './lib/helpers.js';
import { createCup, emptyElement, showScreen } from './lib/ui.js';

/** Lágmark bolla sem má velja. */
const MIN_NUM_OF_CUPS = 2;

/** Hámark bolla sem má velja. */
const MAX_NUM_OF_CUPS = 10;

/** Hversu lengi á að bíða þar til við birtum biðskjá eftir leik. */
const SHOW_WAITINGSCREEN_TIME = 1000;

/** Breyta sem heldur utan um stöðuna á leiknum okkar */
const state = {
  /** Fjöldi spilaðra leikja. */
  played: 0,

  /** Fjöldi unna leikja. */
  won: 0,

  /** Fjöldi stiga. */
  points: 0,

  /** Hvar boltinn er falinn, `null` ef ekki í leik. */
  currentCup: null,

  /** Fjöldi stiga sem eru í boði í núverandi leik. */
  currentPointsAvailable: 0,
};

// Afritum SVG sem er nákvæmlega eitt stykki af í DOM í byrjun
// getum notað það oft í leiknum með:
// element.appendChild(svg.cloneNode(true));
const svg = document.querySelector('svg').cloneNode(true);

// Setjum rétt gildi fyrir hámark í villuskilaboðum.
document.querySelector('#max_cups').innerText = MAX_NUM_OF_CUPS;

/**
 * Meðhöndlar það sem gerist þegar notandi velur bolla:
 * - Ef engin bolti er falinn, birtir biðskjá.
 * - Uppfærir fjölda leikja sem hafa verið spilaðir.
 * - Ef rétt gisk, sýnir boltann og gefur stig, annars sýnir tómt.
 * - Uppfærir fjölda stiga og leikja spilaða.
 * - Birtir biðjskjá eftir skilgreindann tíma þegar notandi er búinn að velja.
 *
 * @param {event} e Atburður sem átti sér stað þegar notandi ýtti á takka fyrir
 *                  ákveðinn bolla.
 * @returns 
 */
 function onCupClick(e) {
  state.played += 1;
  if (state.currentCup === Number.parseInt(e.target.dataset.num)) {
    // Þegar notandi velur rétta bolla.
    console.log('state.currentPointsAvailable :>> ', state.currentPointsAvailable);
    e.target.classList.add('cup__button--correct');
    // TODO
    // þegar notandi velur rett sýna rauðan bolta
    // skoða create cup og setja inn rauðan bolta;
    state.points += state.currentPointsAvailable;
    document.getElementById('points').innerText = state.points;
    document.getElementById('games').innerText = state.played;
    console.log('win :>> ', 'win');
  } else {
    e.target.classList.add('cup__button--wrong');
    // TODO 
    // þegar notandi velur rangt remove mynd af bolla

    console.log('lose :>> ', 'lose');
    document.getElementById('games').innerText = state.played;

  }
  showScreen('waiting');
  console.log(e.target.dataset.num);
}
//eyða console.log alls staðar
/**
 * Tæmir `parent` og býr til `num` bollum og setur þangað inn.
 * @param {number} num Fjöldi bolla
 * @param {element} parent Element sem á að setja bollana inn í.
 */
 function createCups(num, parent) {
  emptyElement(parent)

  for (let i = 1; i <= num; i++) {
    const cup = createCup(i, svg, onCupClick);
    parent.appendChild(cup);
  }
}

/**
 * Meðhöndlar það að notandi byrjar leikinn með því að skrá fjölda bolla og ýta
 * á takkann eða ýta á enter.
 * Sér um að:
 * - Athuga hvort fjöldi bolla sé réttur, ef ekki sýna villuskilaboð.
 * - Búa til bolla.
 * - Uppfæra fjölda stiga sem eru í boði og undir hvaða bolla boltinn sé.
 * - Sýna bollaskjáinn.
 *
 * @param {event} e Atburður sem átti sér stað þegar form var sent.
 */
 function onFormSubmit(e) {
  e.preventDefault();
  console.log(e)

  const input = e.target.querySelector('input')
  const value = input.value;

  const isValid = isValidNum(value, MIN_NUM_OF_CUPS, MAX_NUM_OF_CUPS);
  const formError = document.querySelector('.form__error');
  formError.classList.add('form__error--hidden');

  const valueAsNumber = Number.parseInt(value)
  state.currentPointsAvailable = valueAsNumber - 1;
  console.log('state.currentPointsAvailable :>> ', state.currentPointsAvailable);
  if (isValid) {
    showScreen('main');
    createCups(valueAsNumber, document.querySelector('.cups'))
    state.currentCup = Math.abs(randomNumber(1, valueAsNumber));
    console.log('state.currentCup :>> ', state.currentCup);
  } else {
    formError.classList.remove('form__error--hidden');
  }
}

// Tengir event handler við formið.
document.querySelector('form').addEventListener('submit', onFormSubmit);

