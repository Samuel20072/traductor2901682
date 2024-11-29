
let storedDictionary = JSON.parse(localStorage.getItem('dictionary'));
const dictionary = storedDictionary || {
  categories: {
    general: [],
    animals: [],
    fruits: [],
    colors: [],
    physical_descriptions: [],
    skills: [],
    verbs: [],
  },
};


const tableWords = document.getElementById('tableWords');
const createWordForm = document.getElementById('create-word-form');
const createWordMessage = document.getElementById('create-word-message');
const filterCategorySelect = document.getElementById('categorySelect');
const formCategorySelect = document.getElementById('category-select');


const saveDictionaryToLocalStorage = () => {
  localStorage.setItem("dictionary", JSON.stringify(dictionary));
};


const createWord = (english, spanish, example, category) => {
  const newWord = { id: Date.now(), english, spanish, example };

 
  if (dictionary.categories[category]) {
    dictionary.categories[category].push(newWord);
    saveDictionaryToLocalStorage(); 
    listWords();
    createWordMessage.textContent = `Palabra "${english}" añadida a la categoría "${category}".`;
    createWordMessage.style.color = "green";
  } else {
    createWordMessage.textContent = `La categoría "${category}" no existe.`;
    createWordMessage.style.color = "red";
  }
};


createWordForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const englishWord = document.getElementById("english-word").value.trim();
  const spanishWord = document.getElementById("spanish-word").value.trim();
  const exampleWord = document.getElementById("example-word").value.trim();
  const selectedCategory = categorySelect.value;

  if (englishWord && spanishWord && selectedCategory) {
    createWord(englishWord, spanishWord, exampleWord, selectedCategory);
    createWordForm.reset(); 
  } else {
    createWordMessage.textContent = "Por favor, completa todos los campos.";
    createWordMessage.style.color = "red";
  }
});

const fillCategorySelect = (selectElement) => {
  selectElement.innerHTML = "";
  for (const category in dictionary.categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    selectElement.appendChild(option);
  }
};

const listWords = (filterCategory = "all") => {
tableWords.innerHTML = ""; 
for (const categoryKey in dictionary.categories) {
    if (filterCategory !== "all" && filterCategory !== categoryKey) continue;

    const category = dictionary.categories[categoryKey];
    category.forEach((word) => {
    const row = document.createElement("tr");
    const englishCell = document.createElement("td");
    const spanishCell = document.createElement("td");
    const exampleCell = document.createElement("td");
    const categoryCell = document.createElement("td");

    englishCell.textContent = word.english;
    spanishCell.textContent = word.spanish;
    exampleCell.textContent = word.example || "-";
    categoryCell.textContent = categoryKey;

    row.appendChild(englishCell);
    row.appendChild(spanishCell);
    row.appendChild(exampleCell);
    row.appendChild(categoryCell);
    tableWords.appendChild(row);
    });
}
};

categorySelect.addEventListener("change", () => {
const selectedCategory = categorySelect.value;
listWords(selectedCategory);
});


window.onload = () => {
  fillCategorySelect(filterCategorySelect); // Llenar select de filtrado
  fillCategorySelect(formCategorySelect); // Llenar select del formulario
listWords();
};
