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

// Función para guardar el diccionario en localStorage
const saveDictionaryToLocalStorage = () => {
  localStorage.setItem("dictionary", JSON.stringify(dictionary));
};

// Función para crear una nueva palabra
const createWord = (english, spanish, example, category) => {
  const newWord = { id: Date.now(), english, spanish, example };

  if (dictionary.categories[category]) {
    dictionary.categories[category].push(newWord);
    saveDictionaryToLocalStorage(); 
    listWords();  // Actualiza la lista de palabras
    createWordMessage.textContent = `Palabra "${english}" añadida a la categoría "${category}".`;
    createWordMessage.style.color = "green";
  } else {
    createWordMessage.textContent = `La categoría "${category}" no existe.`;
    createWordMessage.style.color = "red";
  }
};

// Evento para capturar el formulario de creación de palabras
createWordForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const englishWord = document.getElementById("english-word").value.trim();
  const spanishWord = document.getElementById("spanish-word").value.trim();
  const exampleWord = document.getElementById("example-word").value.trim();
  const selectedCategory = formCategorySelect.value;

  if (englishWord && spanishWord && selectedCategory) {
    createWord(englishWord, spanishWord, exampleWord, selectedCategory);
    createWordForm.reset();  // Limpia el formulario
  } else {
    createWordMessage.textContent = "Por favor, completa todos los campos.";
    createWordMessage.style.color = "red";
  }
});

// Función para llenar los selects de categorías
const fillCategorySelect = (selectElement) => {
  selectElement.innerHTML = "";
  for (const category in dictionary.categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace("_", " ");
    selectElement.appendChild(option);
  }
};

// Función para mostrar las palabras en la tabla
const listWords = (filterCategory = "all") => {
  tableWords.innerHTML = "";  // Limpiar la tabla

  if (filterCategory === "all") {
    // Si es "all", muestra todas las categorías
    for (const categoryKey in dictionary.categories) {
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
  } else {
    // Si se seleccionó una categoría específica, muestra solo esa categoría
    const category = dictionary.categories[filterCategory];
    category.forEach((word) => {
      const row = document.createElement("tr");
      const englishCell = document.createElement("td");
      const spanishCell = document.createElement("td");
      const exampleCell = document.createElement("td");
      const categoryCell = document.createElement("td");

      englishCell.textContent = word.english;
      spanishCell.textContent = word.spanish;
      exampleCell.textContent = word.example || "-";
      categoryCell.textContent = filterCategory;

      row.appendChild(englishCell);
      row.appendChild(spanishCell);
      row.appendChild(exampleCell);
      row.appendChild(categoryCell);
      tableWords.appendChild(row);
    });
  }
};

// Evento para filtrar las palabras por categoría
filterCategorySelect.addEventListener("change", () => {
  const selectedCategory = filterCategorySelect.value;
  listWords(selectedCategory);
});

// Al cargar la página, llenar los selects y mostrar las palabras
window.onload = () => {
  fillCategorySelect(filterCategorySelect);  // Llenar el select de filtrado
  fillCategorySelect(formCategorySelect);    // Llenar el select del formulario de creación
  listWords();  // Mostrar todas las palabras por defecto
};
