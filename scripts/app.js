import { dictionary } from './dictionary.js';

const option = document.getElementById('lenguaje');
const tableWords = document.getElementById('tableWords');
const buttonTraslate = document.getElementById('translate');
const word = document.getElementById('word');
const error = document.getElementById('error');
const categorySelect = document.getElementById('categorySelect');
const sortSelect = document.getElementById('sortSelect'); 

let storedDictionary = JSON.parse(localStorage.getItem('dictionary'));

if (!storedDictionary) {

  localStorage.setItem('dictionary', JSON.stringify(dictionary));
  storedDictionary = dictionary;
} else {

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
    const category = dictionary.categories[clave];
    category.forEach((element) => {
      if (lenguaje.value === 'spanish') {
        if (word.toLowerCase() === element.spanish.toLowerCase()) {
          result.textContent = `La traducción de la palabra "${word}" es: ${element.english}`;
          found = true;
          return; 
        }
      } else if (lenguaje.value === 'english') {
        if (word.toLowerCase() === element.english.toLowerCase()) {
          result.textContent = `La traducción de la palabra "${word}" es: ${element.spanish}`;
          found = true;
          return;
        }
      }
    });

    if (found) break; 
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


const listWords = (filterCategory = 'all', sortOrder = 'asc') => {
  tableWords.innerHTML = '';

  const allWords = []; 

  for (const categoryKey in dictionary.categories) {
    if (filterCategory !== 'all' && filterCategory !== categoryKey) continue;

    const category = dictionary.categories[categoryKey];
    category.forEach((word) => {
      allWords.push({ ...word, category: categoryKey }); 
    });
  }

  allWords.sort((a, b) => {
    const wordA = a.english.toLowerCase();
    const wordB = b.english.toLowerCase();
    if (sortOrder === 'asc') return wordA.localeCompare(wordB);
    return wordB.localeCompare(wordA);
  });


  allWords.forEach((word) => {
    const row = document.createElement('tr');
    const englishCell = document.createElement('td');
    const spanishCell = document.createElement('td');
    const exampleCell = document.createElement('td');
    const categoryCell = document.createElement('td');

    englishCell.textContent = word.english;
    spanishCell.textContent = word.spanish;
    exampleCell.textContent = word.example || '-';
    categoryCell.textContent = word.category;

    row.appendChild(englishCell);
    row.appendChild(spanishCell);
    row.appendChild(exampleCell);
    row.appendChild(categoryCell);
    tableWords.appendChild(row);
  });
};


categorySelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  const selectedSortOrder = sortSelect.value;
  listWords(selectedCategory, selectedSortOrder);
});

sortSelect.addEventListener('change', () => {
  const selectedCategory = categorySelect.value;
  const selectedSortOrder = sortSelect.value;
  listWords(selectedCategory, selectedSortOrder);
});

window.onload = () => {
  fillCategorySelect();
  listWords();
};
