//      Welcome to Whatodo Code!
//    through the code there are lots of focus on the input, it's part of a feature I made.

// Get Request to pull the data from JsonBin
const input = document.getElementById("text-input");
input.focus();
const allTasks = { "my-todo": [] };
const list = document.getElementById("View");
updateList(allTasks, list);

//      first declerations
const commandInput = document.getElementById("command-input");
const addButton = document.getElementById("add-button");
const sortButton = document.getElementById("sort-button");
const menu = document.getElementById("menu");
const prioritySelectorArrows = document.getElementById("selector-svg");
const deleteAllButton = document.getElementById("delete-all-button");
document.addEventListener("keydown", (e) => {
  console.log(e.key);
    if (e.key === ":" && document.activeElement !== commandInput) {
        e.preventDefault();
        commandInput.value = ":";
        commandInput.focus();
      }
      else if (e.key === "Tab") {
        const task = document.querySelector('.todo-container');
        task.classList.add('current');
        commandInput.focus();
        e.preventDefault();
      }
      else if (e.key === " " && document.activeElement === commandInput) {
      e.preventDefault();
      }
});

document.addEventListener('click', (e) => {
  console.log(e);
    if (e.target.className === 'todo-container') {
      e.target.classList.add('in-choice');
    }
})

addButton.addEventListener("click", addTask);
deleteAllButton.addEventListener("click", deleteOrRestoreAll);
sortButton.addEventListener("click", sortList);
menu.addEventListener("click", menuLinksHandler);
prioritySelectorArrows.addEventListener('click', changePriority);

document.addEventListener("keyup", (e) => {
    const prioritySelector = document.getElementById("priority-selector");
  const navigator = document.getElementById("navigator");
  const currentInputNavigator = document.getElementById("current-input");
  if (e.key === "Escape") {
      navigator.innerText = "To Do";
      cleanPage();
    return;
  } else if (document.activeElement === input) {
    showOnly();
    if (e.key === "Enter") {
        addButton.click();
        return;
    } 
    else if (e.key === "Tab"){
      console.log("captured!");
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    else if (e.key === "ArrowUp" && prioritySelector.selectedIndex < 4) {
        prioritySelector.selectedIndex++;
    } else if (e.key === "ArrowDown" && prioritySelector.selectedIndex > 0) {
        prioritySelector.selectedIndex--;
    }
    else {
        currentInputNavigator.innerText = " | " + input.value;
        // showOnly();
    }
}
else if (document.activeElement === commandInput && e.key === "ArrowDown") {
  const currentTask = document.querySelector('.current');
  const nextTask = currentTask.nextSibling;
  currentTask.classList.remove('current');
  nextTask.classList.add('current');
}
else if (document.activeElement === commandInput && e.key === "ArrowUp") {
  const currentTask = document.querySelector('.current');
  const previousTask = currentTask.previousSibling;
  currentTask.classList.remove('current');
  previousTask.classList.add('current');
}
else if(document.activeElement === commandInput && e.key === " ") {
  console.log(document.querySelector('.current'));

    const currentTask = document.querySelector('.current');
    currentTask.classList.add('in-choice');
  e.preventDefault();
}
else if (document.activeElement === commandInput && e.key === "Enter") {
    const list = document.getElementById("View");
    const keysetDiv = document.getElementById("keyboard-mode-keyset");
    const tasksInView = document.querySelectorAll(".todo-container");
    const navigator = document.getElementById("navigator");
    const currentInputNavigator = document.getElementById("current-input");
    const deleteAllButton = document.getElementById('delete-all-button');
    switch (commandInput.value) {
      case ":k":
        //show Keyboard-Mode keyset
        keysetDiv.hidden = false;
        commandInput.value = '';
        input.focus();
        return;
        case ":s":
            sortList(list.children);
            commandInput.value = '';
            input.focus();
            //sort the list
        return;
      case ":mi":
          navigator.innerText = "Important";
        //show all important tasks (as click on menu > important)
        break;
        case ":mt":
            navigator.innerText = "To Do";
        //show all to do tasks (as click on menu > to do)
        break;
        case ":mc":
            navigator.innerText = "Completed";
        //show all checked/completed tasks (as click on menu > checked)
        break;
      case ":md":
        navigator.innerText = "Deleted";
        //show all deleted tasks (as click on menu > deleted)
        break;
      case ":c":
        //check current. c[1-9] will check the containter
        break;
      case ":d":
          deleteAllButton.click();
        //delete all tasks in View
        break;
        case ":r":
        deleteAllButton.click();
        //restore all tasks in View
        break;
    }
    cleanPage();
    return;
  }
});



// all functions

function showOnly(showByStatus = "relevant") {
    const navigator = document.getElementById("navigator");
    const deleteAllButton = document.getElementById("delete-all-button");
    deleteAllToRestoreAllAndReversed(deleteAllButton, 'delete');
    if (navigator.innerText !== "" && navigator.innerText !== "To Do") {
        showByStatus = navigator.innerText.toLowerCase();
    }
    const stringToFilter = input.value;
    if (showByStatus === "important") {
        const filtered = allTasks["my-todo"].filter((item) => {
            return item.priority > 2 && item.text.includes(stringToFilter);
        });
        list.replaceChildren();
        recreateView(filtered);
        return;
    } else if (showByStatus) {
        if (showByStatus === 'deleted') {
            deleteAllToRestoreAllAndReversed(deleteAllButton, 'restore');
            
        }
        const filtered = allTasks["my-todo"].filter((item) => {
          return (
          item["data-status"] === showByStatus &&
        item.text.includes(stringToFilter)
        );
    });
    list.replaceChildren();
    recreateView(filtered);
    return;
}
}

function sortList() {
    const fragment = document.createDocumentFragment();
    const listItems = Array.from(list.children);
    const orderedListItems = listItems.sort((firstItem, secondItem) => {
        const firstPriorityItem = firstItem.querySelector(".todo-priority")
        .innerText;
        const secondPriorityItem = secondItem.querySelector(".todo-priority")
        .innerText;
        return secondPriorityItem - firstPriorityItem;
    });
    for (const item of orderedListItems) {
        fragment.append(item);

}
  list.append(fragment);
}

function updateCounter() {
    const relevantTasks = allTasks["my-todo"].filter((task) => {
        return task['data-status'] === 'relevant';
    });
    const completedTasks = allTasks["my-todo"].filter((task) => {
        return task['data-status'] === 'completed';
    });
    const deletedTasks = allTasks["my-todo"].filter((task) => {
        return task['data-status'] === 'deleted';
    });
    const importantTasks = allTasks["my-todo"].filter((task) => {
        return task.priority > 2;
    });
  document.getElementById("todo-counter").innerText = relevantTasks.length;
  document.getElementById("important-counter").innerText = importantTasks.length;
  document.getElementById("completed-counter").innerText = completedTasks.length;
  document.getElementById("deleted-counter").innerText = deletedTasks.length;
  document.getElementById("counter").innerText = list.querySelectorAll('.todo-container').length;
}

function createElementWithAttribute(element, attributeType, attributValue) {
  const newElement = document.createElement(element);
  newElement[attributeType] = attributValue;
  return newElement;
}

function recreateView(listToView = allTasks["my-todo"]) {
  for (const item of listToView) {
    const task = createElementWithAttribute(
        "div",
      "className",
      "todo-container"
      );
    const taskPriority = createElementWithAttribute(
        "div",
        "className",
        "todo-priority"
      );
      const taskCreationTime = createElementWithAttribute(
          "div",
          "className",
      "todo-created-at"
      );
    const taskText = createElementWithAttribute(
        "div",
      "className",
      "todo-text"
    );
    task.dataset["status"] = item["data-status"];
    const trashSpan = createElementWithAttribute(
        "span",
      "className",
      "delete-button"
    );
    trashSpan.value = "delete";
    trashSpan.addEventListener("click", deleteTasks);
    trashSpan.style.display = 'none';
    const checkbox = createElementWithAttribute("input", "type", "checkbox");
    checkbox.className = "checkbox";
    checkbox.addEventListener("click", taskCompleter);
    taskPriority.innerText = item.priority;
    taskPriority.style.display = 'none';
    taskCreationTime.innerText = item.date;
    taskCreationTime.style.display = 'none';
    taskText.innerText = item.text;
    task.append(checkbox, taskText, taskCreationTime, taskPriority, trashSpan);
    if (item["data-status"] === "completed") {
        checkbox.checked = true;
    } else if (item["data-status"] === "deleted") {
        checkbox.hidden = true;
      trashSpan.value = "Restore";
    }
    list.append(task);
}
}

async function deleteTasks(tasksToDelete, action) {
    if (action) {
        if (tasksToDelete.length === undefined) {
            // differ between single and multiple
      tasksToDelete = tasksToDelete.target.parentElement;
      deleteOrRestoreTask(tasksToDelete, action);
    } else {
        for (const task of tasksToDelete) {
          deleteOrRestoreTask(task, action);
        }
    }
  } else {
      if (tasksToDelete.length === undefined) {
      // differ between single and multiple
      tasksToDelete = tasksToDelete.target.parentElement;
      if (tasksToDelete.dataset.status !== "deleted") {
          deleteOrRestoreTask(tasksToDelete, "delete");
      } else {
          deleteOrRestoreTask(tasksToDelete, "restore");
      }
    }
  }
  try {
    await setPersistent(API_KEY, allTasks);
} catch (e) {
    alert(
        "There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n" +
        e
        );
    }
  showOnly();
}
//      consider to unite taskCompleter and deleteTasks functions
function dataStatusChanger(elementOrObjectType, elementOrObject) {
  if (elementOrObjectType === "element") {
    if (elementOrObject.parentElement.dataset.status === "completed") {
        elementOrObject.parentElement.dataset.status = "relevant";
        return;
    }
    elementOrObject.parentElement.dataset.status = "completed";
    return;
}
  if (elementOrObject["data-status"] === "completed") {
      elementOrObject["data-status"] = "relevant";
    return;
} else if (elementOrObject["data-status"] === "relevant") {
    elementOrObject["data-status"] = "completed";
}
}
function taskCompleter(task) {
    if (task.target) {
      task = task.target;
    }
  dataStatusChanger("element", task);
  const currentTaskObj = allTasks["my-todo"].filter((item) => {
      if (
          item.date ===
          task.parentElement.querySelector(".todo-created-at").innerText
          ) {
        dataStatusChanger("object", item);
        return true;
    }
});
  cleanPage();
  try {
    setPersistent(API_KEY, allTasks);
} catch (e) {
    alert(
        "There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n" +
        e
        );
    }
}
function cleanPage() {
  const keysetDiv = document.getElementById("keyboard-mode-keyset");
  const currentInputNavigator = document.getElementById("current-input");
  currentInputNavigator.innerText = "";
  keysetDiv.hidden = true;
  commandInput.value = "";
  input.value = "";
  input.focus();
  showOnly();
}

// async to avoid breaking network flow.
async function addMultipleTasks(multipleValue) {
    const seperatedValues = multipleValue.split(",");
    for (const value of seperatedValues) {
      await addTask(value.trim());
    }
}

function menuHandler(params) {
    console.log(" i am not defined!");
}

function deleteOrRestoreTask(task, action) {
   console.log(task);
    if (task.length === 0) {
        return;
    }
    if (action === "delete") {
    toStatus = "deleted";
    checkboxHiddenToState = true;
    toButtonContent = "Restore";
} else if (action === "restore") {
    toStatus = "relevant";
    checkboxHiddenToState = false;
    toButtonContent = "delete";
}

task.dataset.status = toStatus;
task.querySelector(".checkbox").hidden = checkboxHiddenToState;
  task.querySelector(".delete-button").innerText = toButtonContent;
  relevantTasks = allTasks["my-todo"].filter((item) => {
      if (item.date === task.querySelector(".todo-created-at").innerText) {
        item["data-status"] = toStatus;
    }
    return;
});
  task.hidden = true;
}

function deleteOrRestoreAll(event) {
  let deleteButtonText = event.target.dataset.action;
  const editedDeleteButtonText = deleteButtonText
    .toLowerCase()
    .slice(0, 7)
    .trim();
    const itemsToDeleteOrRestore = list.querySelectorAll('.todo-container')
  if (itemsToDeleteOrRestore.length <= 0) {
      alert(`There's nothing to ${editedDeleteButtonText}..`);
    return;
}
  console.log(deleteButtonText);
  const action = editedDeleteButtonText;
  deleteTasks(itemsToDeleteOrRestore, action);
  deleteAllToRestoreAllAndReversed(event.target);
  cleanPage();
}
function deleteAllToRestoreAllAndReversed(deleteAllButton, action) {
    if (action) {
        deleteAllButton.dataset.action = action;
        return;
    }
    if (deleteAllButton.dataset.action === "delete") {
        //   console.log(action);
        
        deleteAllButton.dataset.action = "restore";
    } else {
        deleteAllButton.dataset.action = "delete";
    }
}
function menuLinksHandler(menuLink) {
    const navigator = document.getElementById("navigator");
    if (menuLink.target.className === "counter-text"){
        navigator.innerText = menuLink.target.innerText;
        cleanPage();
    }
    else if(menuLink.target.className === "navigation-link" && menuLink.target.id !== "total-tasks") {
        navigator.innerText = menuLink.target.querySelector('.counter-text').innerText;
        cleanPage();
        
    }
}

  function containerButtonsCallback(e) {
      if (e.target.className === "checkbox") {
        const checkbox = e.target;
        taskCompleter(checkbox);
  } else if (e.target.className === "delete-button") {
      deleteTasks(e.target.parentElement);
  }
}
function addTask(valueToAdd) {
    const newTaskpriority = document.getElementById("priority-selector").value;
  let newTaskString;
  if (typeof valueToAdd === "string") {
      newTaskString = valueToAdd;
  } else {
      newTaskString = input.value;
    }
    
  if (!newTaskString.trim()) {
    alert("try to enter tasks you wish to remember");
    return;
  } else if (newTaskString.includes(",")) {
      addMultipleTasks(newTaskString);
    return;
}
  //          create new task
  const newTaskStatus = "relevant";
  let temporaryDate = new Date();
  temporaryDate = temporaryDate.setHours(temporaryDate.getHours() + 2);
  const newTaskTime = new Date(temporaryDate)
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
  allTasks["my-todo"].push({
      text: newTaskString,
    priority: newTaskpriority,
    date: newTaskTime,
    "data-status": newTaskStatus,
});
  recreateView(allTasks["my-todo"][-1]);
  
  //      reset page
  updateCounter();
  cleanPage();
  showOnly();
  try {
      return setPersistent(API_KEY, allTasks);
  } catch (e) {
      alert(
      "There was a problem sending data to the server,\n Please try to reload and repeat your last actions.\nThe specific error message is:\n" +
      e
    );
}
}


// need to unite priority change by keyboard and priority change by mouse to the same function.
function changePriority(event) {
    const prioritySelector = document.getElementById('priority-selector');
    const priorityTop = prioritySelectorArrows.getBoundingClientRect().top;
    const priorityHeight = prioritySelectorArrows.getBoundingClientRect().height;
    if (event.y < priorityTop + (priorityHeight/2) && prioritySelector.selectedIndex < 4) {
        prioritySelector.selectedIndex++;
        return;    
    }
    else if (event.y > priorityTop + (priorityHeight/2) && prioritySelector.selectedIndex > 0) {
        prioritySelector.selectedIndex--;
    }
    
}
