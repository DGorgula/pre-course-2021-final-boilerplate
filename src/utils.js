const API_KEY = '$2b$10$zZDdF7tEnFjVuWTOTyEIhuxHrQKMtNfrGQojBkNT5Hl1PBUn/LQ4K'; // Assign this variable to your JSONBIN.io API key if you choose to use it.
const DB_NAME = "my-todo";


// Gets data from persistent storage by the given key and returns it
async function getPersistent(key) {
  const request = {
    headers: {'X-Master-Key': key
}};
try {
  const response = await fetch(`https://api.jsonbin.io/v3/b/601d120506934b65f52ebb62/latest`, request);
  const data = (await response.json())['record'];
  return data;
} catch (error) {
  console.log('Network error, in GET request: '+error);
}

  
  }

// Saves the given data into persistent storage by the given key.
// Returns 'true' on success.
async function setPersistent(key, data) {
  const request = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' , 'X-Master-Key': key
},
body: JSON.stringify(data)};
  const response = await fetch("https://api.jsonbin.io/v3/b/601d120506934b65f52ebb62", request);
  
  return true;
}




//maybe should run this without a function in the main.
async function updateList(allTasks, list){
// try {
  const importedList = await getPersistent(API_KEY);
  allTasks['my-todo'] = importedList["my-todo"];
  //  jsonedList['my-todo'];
// } catch(e) {
  // alert('There was a problem getting data from the server,\n Please try to reload.\nThe specific error message is:\n' + e);
  // }
  recreateView(allTasks['my-todo']);
  // showOnly();
  updateCounter();
}



