// main.js
import { dictionary } from './dictionary.js';

const option = document.getElementById('lenguaje');
const tableWords = document.getElementById('tableWords');
const buttonTraslate = document.getElementById('translate');
const word = document.getElementById('word');
const error = document.getElementById('error');
const categorySelect = document.getElementById('categorySelect');

// Verificar si el diccionario ya está en localStorage
let storedDictionary = JSON.parse(localStorage.getItem('dictionary'));

if (!storedDictionary) {
  // Si no existe, lo guardamos en localStorage
  localStorage.setItem('dictionary', JSON.stringify(dictionary));
  storedDictionary = dictionary;
} else {
  // Si ya existe, usamos el diccionario almacenado
  dictionary.categories = storedDictionary.categories;
}

option.addEventListener('change', function () {
  let lenguajeSelect = this.options[option.selectedIndex];
  console.log(lenguajeSelect.value);
});

buttonTraslate.addEventListener('click', () => traslateWords(word.value, option));

const traslateWords = (word, lenguaje) => {
  const result = document.getElementById('result');
  result.textContent = '';
  error.textContent = '';
  let found = false;

  for (let clave in dictionary.categories) {
    for (let values in dictionary.categories[clave]) {
      dictionary.categories[clave][values].forEach((element) => {
        if (lenguaje.value == 'spanish') {
          if (word.toLowerCase() == element.spanish.toLowerCase()) {
            result.textContent = `La traducción de la palabra "${word.toLowerCase()}" es: ${element.english}`;
            found = true;
            return;
          }
        } else if (lenguaje.value == 'english') {
          if (word.toLowerCase() == element.english.toLowerCase()) {
            result.textContent = `La traducción de la palabra "${word.toLowerCase()}" es: ${element.spanish}`;
            found = true;
            return;
          }
        }
      });
    }
  }

  if (!found) {
    error.textContent = `No se encontró traducción para la palabra "${word}".`;
  }
};

const fillCategorySelect = () => {
  categorySelect.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'Todas las categorías';
  categorySelect.appendChild(allOption);

  for (const category in dictionary.categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ');
    categorySelect.appendChild(option);
  }
};

const listWords = (filterCategory = 'all') => {
  tableWords.innerHTML = '';
  for (const categoryKey in dictionary.categories) {
    if (filterCategory !== 'all' && filterCategory !== categoryKey) continue;

    const category = dictionary.categories[categoryKey];
    category.forEach((word) => {
      const row = document.createElement('tr');
      const englishCell = document.createElement('td');
      const spanishCell = document.createElement('td');
      const exampleCell = document.createElement('td');
      const categoryCell = document.createElement('td');

      englishCell.textContent = word.english;
      spanishCell.textContent = word.spanish;
      exampleCell.textContent = word.example || '-';
      categoryCell.textContent = categoryKey;

      row.appendChild(englishCell);
      row.appendChild(spanishCell);
      row.appendChild(exampleCell);
      row.appendChild(categoryCell);
      tableWords.appendChild(row);
    });
  }
};

categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  listWords(selectedCategory);
});

window.onload = () => {
  fillCategorySelect();
  listWords();
};
