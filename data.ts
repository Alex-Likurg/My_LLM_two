let texts: string[] = []; // Массив для хранения текстов

// Функция для открытия диалога выбора файлов
export function triggerFileInput() {
    const inputElement = document.getElementById('fileInput');
    if (inputElement) {
        inputElement.click();
    } else {
        console.error('Element with id "fileInput" not found');
    }
}

// Функция для обработки выбранных файлов
export async function handleFileSelect(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    // Проверка, что событие было вызвано на input элементе
    if (!inputElement || !inputElement.files || inputElement.files.length === 0) {
        console.error('No files selected or invalid input element');
        return;
    }

    const fileTexts: string[] = [];

    for (let i = 0; i < inputElement.files.length; i++) {
        const file = inputElement.files[i];
        const text = await file.text();
        fileTexts.push(text);
    }

    texts.push(...fileTexts); // Добавляем файлы в массив texts
    console.log("Тексты добавлены в массив:", texts);

    // Отправляем данные на сервер для сохранения в файл
    const jsonObject = { texts };

    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Texts have been saved to server:', data);
    })
    .catch(error => {
        console.error('Error saving file on server:', error);
    });
}


    
    // Преобразование массива текстов в JSON объект
    //const jsonObject = texts.reduce((acc, text, index) => {
       // acc[`text_${index + 1}`] = text; // Ключ: text_1, text_2 и т.д.
       // return acc;
    //}, {} as Record<string, string>); // Инициализация пустого объекта

    //const jsonString = JSON.stringify(jsonObject, null, 2); // Преобразуем в JSON-строку с отступами для лучшей читаемости
    //console.log("JSON объект текстов:", jsonString);




//let texts: string[] = []; // Массив для хранения текстов

// Функция для открытия диалога выбора файлов
//export function triggerFileInput() {
    //document.getElementById('fileInput')?.click();
//}

// Функция для обработки выбранных файлов
//export async function handleFileSelect(event: Event) {
    //const inputElement = event.target as HTMLInputElement;
    //const files = inputElement.files;
    //const fileTexts: string[] = [];

    //if (files) {
        //for (let i = 0; i < files.length; i++) {
            //const file = files[i];
            //const text = await file.text();
            //fileTexts.push(text);
       // }
   // }
    
   // texts.push(...fileTexts); // Добавляем файлы в массив texts
   // console.log("Тексты добавлены в массив:", texts);
//}

// Экспортируем массив texts для использования в других частях приложения
//export { texts };


