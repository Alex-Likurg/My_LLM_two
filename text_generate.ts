// Объявляем функцию глобально
function submitForm(event: Event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы (отправку и перезагрузку страницы)
    const inputElement = document.getElementById('input') as HTMLInputElement;
    const userInput = inputElement.value; // Получаем значение из поля ввода

    // Отправляем POST-запрос на сервер
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Устанавливаем заголовок типа контента
        },
        body: JSON.stringify({ input: userInput }) // Передаем запрос пользователя в теле запроса
    })
    .then(response => {
        // Проверяем, успешен ли ответ от сервера
        if (!response.ok) {
            throw new Error('Сервер вернул ошибку: ' + response.statusText); // Если нет, выбрасываем ошибку
        }
        return response.json(); // Парсим JSON-ответ от сервера
    })
    .then(jsonResponse => {
        // Обрабатываем JSON-ответ от сервера
        const messages = document.getElementById('messages'); // Находим элемент, где будут отображаться сообщения
        if (messages) {
            // Добавляем сообщения пользователя и модели в DOM
            messages.innerHTML += `<div><strong>Вы:</strong> ${userInput}</div>`;
            messages.innerHTML += `<div><strong>Модель:</strong> ${jsonResponse.response}</div>`;
        }
    })
    .catch(error => {
        // Обрабатываем ошибки, которые могут возникнуть при выполнении запроса
        console.error("Ошибка при обработке запроса:", error);
        alert("Произошла ошибка при обработке вашего запроса. Проверьте подключение к сети или попробуйте снова.");
    });
}

// Назначаем функцию в момент загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
    const formElement = document.getElementById('form'); // Находим форму
    if (formElement) {
        formElement.addEventListener('submit', submitForm); // Назначаем обработчик события отправки формы
    }
});






// Получаем элемент формы из документа
//const formElement = document.getElementById('form');
//if (formElement) {
    // Если элемент формы существует, добавляем обработчик события 'submit'
    //formElement.addEventListener('submit', async (event) => {
       // event.preventDefault(); // Предотвращаем стандартное поведение формы
       // const inputElement = document.getElementById('input') as HTMLInputElement; // Получаем элемент ввода
       // const userInput = inputElement.value; // Получаем значение ввода

        // Отправляем запрос на сервер для генерации ответа
      //  const response = await fetch('/chat', {
          //  method: 'POST',
          //  headers: {
              //  'Content-Type': 'application/json'
          //  },
          //  body: JSON.stringify({ input: userInput }) // Передаем пользовательский ввод в теле запроса
     //   }).then(res => res.json()); // Получаем ответ от сервера и преобразуем его в JSON

      //  const messages = document.getElementById('messages'); // Получаем элемент сообщений
      //  if (messages) {
            // Если элемент сообщений существует, добавляем запрос и ответ в его содержимое
          //  messages.innerHTML += `<div>${userInput}</div>`;
          //  messages.innerHTML += `<div>${response.response}</div>`;
      //  }
  //  });
//}

// Функция для генерации ответа на основе пользовательского ввода
//async function generateResponse(userInput: string): Promise<string> {
  //  const response = await fetch('/chat', {
   //     method: 'POST',
    //    headers: {
        //    'Content-Type': 'application/json'
       // },
      //  body: JSON.stringify({ input: userInput }) // Передаем пользовательский ввод в теле запроса
   // }).then(res => res.json()); // Получаем ответ от сервера и преобразуем его в JSON

  //  return response.response; // Возвращаем сгенерированный ответ
//}

//export { generateResponse }; // Экспортируем функцию generateResponse


