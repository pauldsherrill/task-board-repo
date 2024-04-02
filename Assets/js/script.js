// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("task"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const taskInput = $('#task-title');
const dateInput = $('#datepicker');
const descriptionInput = $('#task-description');
const todo = $('#todo-cards');

// This function creates a unique task id for every task that is added
function generateTaskId() {
  nextId++;
  localStorage.setItem('nextId', JSON.stringify(nextId));
  return nextId;
}

// This function renders the task into a task card when a new task is added. It also makes the task draggable and droppable in the three different lanes. 
function renderTaskList() {
  if (!taskList) {
    return;
  }

  for (const task of taskList) {
    console.log(task);
    const taskCard = $('<div>');
    todo.append(taskCard);

    taskCard.data('task-id', task.nextId);

    const taskTitle =  $('<h2>');
    taskTitle.text(task.title);
    taskCard.append(taskTitle);

    const taskDescription =  $('<p>');
    taskDescription.text(task.description);
    taskCard.append(taskDescription);

    const taskDate =  $('<p>');
    const newDate = dayjs(task.date);
    taskDate.text(newDate.format('M/D/YYYY'));
    taskCard.append(taskDate);
    const today = dayjs();
    const difference = newDate.diff(today, 'days');
    console.log(difference);

    const deleteButton = $('<button>');
    deleteButton.text("Delete");
    taskCard.append(deleteButton);
    deleteButton.addClass("delete-button");

    taskCard.addClass("ui-widget-content task-card");
    taskCard.css("z-index", "9999");

    if (difference < 0) {
      taskCard.addClass("task-card-red");
    } else if (difference < 4) {
      taskCard.addClass("task-card-yellow");
    } else if (difference >= 4) {
      taskCard.addClass("task-card-white");
    }

    deleteButton.on('click', function (event) {
      event.preventDefault();
      handleDeleteTask(event);
    });
  }

  $(".task-card").draggable({
    revert: "invalid", 
  });

  $(".drop-area").droppable({
    accept: ".task-card", 
    tolerance: "intersect",
    drop: function (event, ui) {
      const droppedCard = ui.draggable;
      const targetLaneId = $(this).attr("id");
      droppedCard.appendTo($(this).find(".lane-cards"));
      updateTaskStatus(droppedCard, targetLaneId);
    }
  });

  function updateTaskStatus(taskCard, targetLaneId) {
    const taskId = taskCard.data("task-id");
    const taskList = JSON.parse(localStorage.getItem("task")) || [];
    const updatedTasks = taskList.map((task) => {
      if (task.id === taskId) {
        task.status = targetLaneId;
      }
      return task;
    });
    localStorage.setItem("task", JSON.stringify(updatedTasks));
  }

  $(".task-card").each(function () {
    const taskId = $(this).data("task-id");
    $(this).data("task-id", taskId);
  });
} 

// This function handles adding a new task ny logging it to local storage in an array
function handleAddTask(event){
  const task = {
    nextId: generateTaskId(),
    title: taskInput.val(),
    date: dateInput.val(),
    description: descriptionInput.val(),
  };

  const tasks = JSON.parse(localStorage.getItem('task'));

  if (tasks) {
    tasks.push(task);
    localStorage.setItem('task', JSON.stringify(tasks));
  } else {
    const tasksInitializer = [task];
    localStorage.setItem('task', JSON.stringify(tasksInitializer));
  }

  taskList = JSON.parse(localStorage.getItem('task'));

  renderTaskList();
}

// This function handles deleting a task by splicing that object from the array and removing it 
function handleDeleteTask(event){
  console.log(taskList);
  for (let i = 0; i < taskList.length; i++) {
    console.log($(event.target).parent());
    if ($(event.target).parent().data('task-id') == taskList[i].nextId) {
    const deleteTask = taskList.splice(i, 1);
    console.log(deleteTask);
    localStorage.setItem('task', JSON.stringify(taskList));
    $(event.target).parent().remove();
    }
}
}

$(document).ready(function () {
  const saveButton = $('#save');
  renderTaskList();
  saveButton.on('click', function (event) {
    event.preventDefault();
    handleAddTask();
    location.reload();
  });
});


