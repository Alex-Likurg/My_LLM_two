import fs from 'fs'; // Импортируем модуль для работы с файловой системой.
import path from 'path'; // Импортируем модуль для работы с путями файловой системы.
import { spawn } from 'child_process'; // Импортируем модуль для запуска дочерних процессов.

const tempDir = path.join(require('os').tmpdir()); // Получаем путь к временной директории в ОС.

async function loadTextsFromFile(filePath: string): Promise<{ text: string }[]> {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const parsedData = JSON.parse(data);

        if (
            Array.isArray(parsedData.texts) &&
            parsedData.texts.every((item: unknown): item is { text: string } => {
                return typeof item === 'object' && item !== null && 'text' in item && typeof (item as { text: string }).text === 'string';
            })
        ) {
            return parsedData.texts;
        } else {
            throw new Error('Invalid format: "texts" must be an array of objects with a "text" key containing strings.');
        }
    } catch (error) {
        throw new Error(`Error reading or parsing file: ${(error as Error).message}`);
    }
}



async function tokenizeText(index: number, text: string): Promise<number[]> {
    const inputFile = path.join(tempDir, `input_${index}_${Date.now()}.txt`);
    const outputFile = path.join(tempDir, `output_${index}_${Date.now()}.json`);

    try {
        // Сохраняем текст во временный файл.
        fs.writeFileSync(inputFile, text, 'utf-8');
        console.log(`Temporary input file created: ${inputFile}`);
        console.log(`Expected output file: ${outputFile}`);

        // Запускаем Python-скрипт для токенизации текста, передавая ему пути к файлам.
        const pythonProcess = spawn('python', ['tokenize_data.py', inputFile, outputFile]);

        return new Promise((resolve, reject) => {
            // Устанавливаем таймер на 30 секунд для выполнения Python-скрипта.
            const timeout = setTimeout(() => {
                pythonProcess.kill('SIGTERM'); // Если время истекло, завершаем процесс.
                reject(new Error(`Python process timed out for text [${index}]`));
            }, 120000);

             //Обрабатываем завершение процесса.
            pythonProcess.on('close', (code) => {
                clearTimeout(timeout); // Очищаем таймер при завершении процесса.

                if (code !== 0) {
                    return reject(new Error(`Python process exited with code ${code}`));
                }
                if (!fs.existsSync(outputFile)) {
                    return reject(new Error(`Output file not found: ${outputFile}`));
                }
                try {
                    // Читаем и парсим результат токенизации.
                    const tokenizedData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
                    resolve(tokenizedData); // Возвращаем токенизированные данные.
                } catch (error) {
                    reject(new Error(`Error reading output file: ${(error as Error).message}`));
                } finally {
                    // Удаляем временные файлы.
                    fs.unlinkSync(inputFile);
                    fs.unlinkSync(outputFile);
                }
            });

            // Обрабатываем ошибки при запуске процесса.
            pythonProcess.on('error', (error) => {
                clearTimeout(timeout); // Очищаем таймер при ошибке.
                reject(new Error(`Failed to start Python process: ${error.message}`));
            });
        });
    } catch (error) {
        // Обрабатываем общие ошибки, связанные с обработкой текста.
        throw new Error(`Error processing text [${index}]: ${(error as Error).message}`);
    }
}

async function processTexts() {
    try {
        // Загружаем тексты из файла 'lord_of_the_rings_dataset.json'.
        const texts = await loadTextsFromFile('lord_of_the_rings_dataset_3.json');
        console.log(`Loaded ${texts.length} texts from file.`);

        const tokenizedData: number[][] = [];

        // Проходим по всем текстам и выполняем их токенизацию.
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i].text; // Берём строку из объекта.
            console.log(`Tokenizing text [${i}]: ${text.slice(0, 50)}...`);
            try {
                const tokenizedText = await tokenizeText(i, text);
                if (tokenizedText.length > 0) {
                    tokenizedData.push(tokenizedText); // Добавляем токенизированные данные в массив.
                }
            } catch (error) {
                console.error(`Error tokenizing text [${i}]: ${(error as Error).message}`);
            }
        }

        if (tokenizedData.length > 0) {
            // Сохраняем токенизированные данные в файл 'tokenized_data.json'.
            fs.writeFileSync('tokenized_data_3.json', JSON.stringify(tokenizedData, null, 2), 'utf8');
            console.log(`Tokenized texts saved to 'tokenized_data_3.json'.`);
        } else {
            console.log('No tokenized texts to save.');
        }
    } catch (error) {
        console.error(`Error processing texts: ${(error as Error).message}`);
    }
}


// Запускаем основной процесс обработки текстов и обрабатываем неожиданные ошибки.
processTexts().catch(error => {
    console.error(`Unexpected error: ${(error as Error).message}`);
});



//import fs from 'fs';
//import path from 'path';
//import { spawn } from 'child_process';

//const tempDir = path.join(require('os').tmpdir());

//async function loadTextsFromFile(filePath: string): Promise<string[][]> {
    //try {
       //const data = fs.readFileSync(filePath, 'utf-8');
       // const parsedData = JSON.parse(data);

        // Извлекаем столбцы из features
       // if (!Array.isArray(parsedData.features) || parsedData.features.length === 0) {
      //      throw new Error('Invalid format: missing or empty "features" array.');
      //  }

      //  const columns = parsedData.features.map((feature: any) => feature.name);
      //  console.log(`Detected columns: ${columns.join(', ')}`);

     //   if (!Array.isArray(parsedData.rows)) {
     //       throw new Error('Invalid format: "rows" should be an array.');
     //   }

        // Преобразуем данные rows на основе features
     //   return parsedData.texts.map((row: any) => {
     //       const rowData = row.row;
    //        if (!columns.every((col: string) => col in rowData)) {
    //            throw new Error(`Row is missing required columns: ${JSON.stringify(rowData)}`);
    //        }
     //       return columns.map((col: string | number) => rowData[col]); // Возвращаем значения в порядке столбцов
     //   });
   // } catch (error) {
      //  throw new Error(`Error reading or parsing file: ${(error as Error).message}`);
   // }
//}

//async function tokenizeText(index: number, text: string): Promise<number[]> {
   // const inputFile = path.join(tempDir, `input_${index}_${Date.now()}.txt`);
  //  const outputFile = path.join(tempDir, `output_${index}_${Date.now()}.json`);

  //  try {
     //   fs.writeFileSync(inputFile, text, 'utf-8');
     //   console.log(`Temporary input file created: ${inputFile}`);
     //   console.log(`Expected output file: ${outputFile}`);

      //  const pythonProcess = spawn('python', ['tokenize_data.py', inputFile, outputFile]);

     //   return new Promise((resolve, reject) => {
     //       const timeout = setTimeout(() => {
     //           pythonProcess.kill('SIGTERM');
      //          reject(new Error(`Python process timed out for text [${index}]`));
      //      }, 120000);

      //      pythonProcess.on('close', (code) => {
       //         clearTimeout(timeout);

       //         if (code !== 0) {
         //           return reject(new Error(`Python process exited with code ${code}`));
         //       }
         //       if (!fs.existsSync(outputFile)) {
          //          return reject(new Error(`Output file not found: ${outputFile}`));
         //       }
        //        try {
           //         const tokenizedData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
           //         resolve(tokenizedData);
           //     } catch (error) {
           //         reject(new Error(`Error reading output file: ${(error as Error).message}`));
           //     } finally {
           //         fs.unlinkSync(inputFile);
            //        fs.unlinkSync(outputFile);
          //      }
         //   });

         //   pythonProcess.on('error', (error) => {
          //      clearTimeout(timeout);
          //      reject(new Error(`Failed to start Python process: ${error.message}`));
          //  });
        //});
    //} catch (error) {
       // throw new Error(`Error processing text [${index}]: ${(error as Error).message}`);
    //}
//}

// async function processTexts() {
   // try {
     //   const texts = await loadTextsFromFile('texts.json');
    //    console.log(`Loaded ${texts.length} texts from file.`);

     //   const tokenizedData: number[][] = [];

    //    for (let i = 0; i < texts.length; i++) {
            // Обрабатываем только question и answer
    //        const [question, answer] = texts[i];
    //        const text = `${question}\n${answer}`;
    //       console.log(`Tokenizing text [${i}]: ${text.slice(0, 50)}...`);
    //        try {
     //           const tokenizedText = await tokenizeText(i, text);
     //           if (tokenizedText.length > 0) {
     //               tokenizedData.push(tokenizedText);
     //           }
     //       } catch (error) {
     //           console.error(`Error tokenizing text [${i}]: ${(error as Error).message}`);
    //        }
    //    }

    //   if (tokenizedData.length > 0) {
     //       fs.writeFileSync('tokenized_data.json', JSON.stringify(tokenizedData, null, 2), 'utf8');
     //       console.log(`Tokenized texts saved to 'tokenized_data.json'.`);
     //   } else {
    //        console.log('No tokenized texts to save.');
     //   }
    //} catch (error) {
     //   console.error(`Error processing texts: ${(error as Error).message}`);
    //}
//}

//processTexts().catch(error => {
   // console.error(`Unexpected error: ${(error as Error).message}`);
//});





