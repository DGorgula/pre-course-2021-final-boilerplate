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
    if (e.key === ":" && document.activeElement !== commandInput) {
        e.preventDefault();
        commandInput.value = ":";
        commandInput.focus();
    }
});

document.addEventListener('click', (e) => {
    console.log(e);
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
      navigator.innerText = "All";
      cleanPage();
    return;
  } else if (document.activeElement === input) {
    showOnly();
    if (e.key === "Enter") {
      addButton.click();
      return;
    } else if (e.key === "ArrowUp" && prioritySelector.selectedIndex < 4) {
      prioritySelector.selectedIndex++;
    } else if (e.key === "ArrowDown" && prioritySelector.selectedIndex > 0) {
      prioritySelector.selectedIndex--;
    } else {
      currentInputNavigator.innerText = " > " + input.value;
      // showOnly();
    }
} else if (document.activeElement === commandInput && e.key === "Enter") {
    const list = document.getElementById("View");
    const keysetDiv = document.getElementById("keyboard-mode-keyset");
    const tasksInView = document.querySelectorAll(".todo-container");
    const navigator = document.getElementById("navigator");
    const currentInputNavigator = document.getElementById("current-input");
    switch (commandInput.value) {
      case ":k":
        //show Keyboard-Mode keyset
        keysetDiv.hidden = false;
        return;
      case ":s":
          //sort the list
        sortList(list.children);
        return;
      case ":mi":
        //show all important tasks (as click on menu > important)
        navigator.innerText = "important";
        break;
        case ":mc":
            navigator.innerText = "completed";
        //show all checked/completed tasks (as click on menu > checked)
        break;
      case ":md":
        navigator.innerText = "deleted";
        //show all deleted tasks (as click on menu > deleted)
        break;
      case ":c":
        //check current. c[1-9] will check the containter
        break;
      case ":d":
          deleteAllButton.click();
          // deleteTasks(list.children, 'delete');
        //delete all tasks in View
        break;
        case ":r":
        // deleteTasks(list.children, 'restore');
        deleteAllButton.click();
        // navigator.innerText = 'All';
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
    if (navigator.innerText !== "" && navigator.innerText !== "All") {
        showByStatus = navigator.innerText;
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
    const lines = document.querySelectorAll('hr');
    lines.forEach((line) => {
        line.remove();
    })
    const listItems = Array.from(list.children);
    console.log(listItems);
    const orderedListItems = listItems.sort((firstItem, secondItem) => {
        const firstPriorityItem = firstItem.querySelector(".todo-priority")
        .innerText;
        const secondPriorityItem = secondItem.querySelector(".todo-priority")
        .innerText;
        return secondPriorityItem - firstPriorityItem;
    });
    for (const item of orderedListItems) {
          const line = document.createElement('hr');
        fragment.append(item);
      fragment.append(line);

}
  list.append(fragment);
}

function updateCounter() {
  document.getElementById("counter").innerText = list.querySelectorAll('.todo-container').length;
}

function createElementWithAttribute(element, attributeType, attributValue) {
  const newElement = document.createElement(element);
  newElement[attributeType] = attributValue;
  return newElement;
}

function recreateView(listToView = allTasks["my-todo"]) {
  for (const item of listToView) {
      const line = document.createElement("hr");
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
    const checkbox = createElementWithAttribute("input", "type", "checkbox");
    checkbox.className = "checkbox";
    checkbox.addEventListener("click", taskCompleter);
    taskPriority.innerText = item.priority;
    taskCreationTime.innerText = item.date;
    taskText.innerText = item.text;
    task.append(checkbox, taskText, taskCreationTime, taskPriority, trashSpan);
    if (item["data-status"] === "completed") {
        checkbox.checked = true;
    } else if (item["data-status"] === "deleted") {
        checkbox.hidden = true;
      trashSpan.value = "Restore";
    }
    list.append(task);
    list.append(line);
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
      console.log(elementOrObject);
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
  console.log("im here!", task.target);
  dataStatusChanger("element", task);
  console.log("sadf");
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
  if (list.children.length <= 0) {
      alert(`There's nothing to ${editedDeleteButtonText}..`);
    return;
}
  console.log(deleteButtonText);
  const action = editedDeleteButtonText;
  deleteTasks(list.children, action);
  if (deleteButtonText === "Delete All") {
      console.log(action);

    event.target.dataset.action = "Restore All";
} else {
    event.target.dataset.action = "Delete All";
}
  cleanPage();
}

function menuLinksHandler(menuLink) {
    if (menuLink.target.className === "navigation-link") {
        const navigator = document.getElementById("navigator");
        navigator.innerText = menuLink.target.innerText.toLowerCase();
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