import Task from "./task";
import toDoList from "./logic";
import Project from "./projects";

const webInterface = (() => {

  const displayTaskModal = () => {
    const taskInputModal = document.querySelector(".task-modal-container");
    taskInputModal.style.display = "flex";
  }

  const addTasktoProject = (projectName) => {
    const taskTitle = document.querySelector("#task-title");
    const taskDesc = document.querySelector("#task-description");
    const taskDueDate = document.querySelector("#task-due-date");
    const project = toDoList.getProject(projectName);
    const projectTasks = project.getAllTasks();

    if (projectTasks.some(task => task.title === taskTitle.value)) {
      alert("Task already exists!");
      return false;
    }
    const task = new Task(taskTitle.value);
    task.setDescription(taskDesc.value);
    task.setDueDate(taskDueDate.value);
    project.addTask(task);

    taskTitle.value = "";
    taskDesc.value = "";
    taskDueDate.value = "";

    return true;
  }

  const addProject = (projectName) => {
    const newProject = new Project(projectName);
    toDoList.addNewProject(newProject);
  }

  const hideTaskModal = () => {
    const taskInputModal = document.querySelector(".task-modal-container");
    taskInputModal.style.display = "none";
  }

  const displayCustomProjects = () => {
    let projectList = toDoList.getAllProjects();
    const customProjectList = document.querySelector(".custom-project-list");
    customProjectList.textContent = "";
    if (projectList.length > 3) {
      for (let i = 3; i < projectList.length; i++) {
        const customProject = document.createElement("div");
        customProject.className = "project custom-project";
        customProject.setAttribute("data-project", `${projectList[i].name}`);
        const customProjectName = document.createElement("p");
        customProjectName.textContent = projectList[i].name
        customProject.appendChild(customProjectName);
        customProject.addEventListener("click", (e) => {
          toDoList.setActiveProjectName(e.currentTarget.dataset.project);
          displayProjectPage();
          displayTask();
        })
        customProjectList.appendChild(customProject);
      }
    }
  }

  const displayTaskDetail = (task) => {
    const taskDetailModal = document.querySelector(".task-detail-modal");
    const taskDetailTitle = document.querySelector(".task-detail-title");
    const taskDetailDate = document.querySelector(".task-detail-date");
    const taskDetailDesc = document.querySelector(".task-detail-desc");
    const taskDetailClose = document.querySelector(".task-detail-close");

    taskDetailTitle.textContent = task.getTitle();
    taskDetailDate.textContent = task.getDueDate();
    taskDetailDesc.textContent = task.getDescription();

    taskDetailClose.addEventListener("click", () => taskDetailModal.style.display = "none");

    taskDetailModal.style.display = "flex";
  }

  const displayTask = () => {
    const taskListDiv = document.querySelector(".task-list");
    taskListDiv.textContent = "";
    let activeProject = toDoList.getActiveProject();
    let projectTasks = activeProject.getAllTasks();
    projectTasks.forEach((task, index) => {
      const taskDiv = document.createElement("div");
      taskDiv.classList.add("task")

      const taskTitle = document.createElement("p");
      taskTitle.textContent = task.getTitle();
      taskTitle.classList.add("task-title-btn")
      taskTitle.addEventListener("click", () => displayTaskDetail(task))

      const taskCheckbox = document.createElement("span");
      taskCheckbox.className = "material-icons task-checkbox";
      taskCheckbox.textContent = "check_box_outline_blank";
      taskCheckbox.addEventListener("click", (e) => {
        if (task.getIsCompleted() === false) {
          e.currentTarget.textContent = "check_box";
          task.setCompleteStatus(true);
          e.currentTarget.parentElement.style.opacity = "0.3";
          taskTitle.style.textDecoration = "line-through";
        } else {
          e.currentTarget.textContent = "check_box_outline_blank";
          task.setCompleteStatus(false);
          e.currentTarget.parentElement.style.opacity = "1";
          taskTitle.style.textDecoration = "none";
        }
      })

      const taskDueDate = document.createElement("span");
      taskDueDate.classList.add("task-due-date");
      taskDueDate.textContent = task.getDueDate();

      const taskDeleteBtn = document.createElement("span");
      taskDeleteBtn.className = "material-icons btn-delete-task";
      taskDeleteBtn.textContent = "delete_outline";
      taskDeleteBtn.addEventListener("click", (e) => {
        activeProject.removeTask(index);
        e.currentTarget.parentElement.remove();
      });
      
      taskDiv.appendChild(taskCheckbox);
      taskDiv.appendChild(taskTitle);      
      taskDiv.appendChild(taskDueDate);      
      taskDiv.appendChild(taskDeleteBtn);
      taskListDiv.appendChild(taskDiv);
    })
  }

  const displayProjectPage = () => {
    const projectTitle = document.querySelector(".project-title");
    projectTitle.textContent = toDoList.getActiveProjectName();
  }

  const taskBtnListener = () => {
    const addTaskInputBtn = document.querySelector(".add-task");
    addTaskInputBtn.addEventListener("click", displayTaskModal);

    const cancelAddTaskBtn = document.querySelector(".btn-cancel-task");
    cancelAddTaskBtn.addEventListener("click", hideTaskModal);

    const addTaskBtn = document.querySelector(".btn-add-task");
    addTaskBtn.addEventListener("click", () => {
      const activeProjectName = toDoList.getActiveProjectName();
      if (addTasktoProject(activeProjectName)) {
        displayTask();
        hideTaskModal();
      }
    })
  }
  
  const projectListener = () => {
    const projectNav = document.querySelectorAll(".project");
    projectNav.forEach(project => {
      project.addEventListener("click", (e) => {
        toDoList.setActiveProjectName(e.currentTarget.dataset.project);
        displayProjectPage();
        displayTask();
      });
    });

    const customProjectInput = document.querySelector(".custom-project-input");

    const addProjectBtn = document.querySelector(".add-project");
    addProjectBtn.addEventListener("click", () => {
      customProjectInput.style.display = "grid";
    });

    const addNewProjectBtn = document.querySelector(".btn-add-project");
    addNewProjectBtn.addEventListener("click", () => {
      const projectNameInput = document.querySelector("#custom-project-name");
      addProject(projectNameInput.value);
      displayCustomProjects();
      customProjectInput.style.display = "none";
    })

    const cancelAddProjectBtn = document.querySelector(".btn-cancel-add-project");
    cancelAddProjectBtn.addEventListener("click", () => {
      customProjectInput.style.display = "none";
    })
  }

  const loadPage = () => {
    taskBtnListener();
    displayCustomProjects();
    projectListener();
    displayProjectPage();
    displayTask();
  }

  return {
    loadPage
  };
})();

export default webInterface;