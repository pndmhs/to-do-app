import Task from "./task";
import toDoList from "./logic";
import Project from "./projects";

const webInterface = (() => {

  const displayTaskField = (e) => {
    const addTaskInput = document.querySelector(".add-task-input");
    addTaskInput.style.display = "grid";
    e.currentTarget.style.display = "none";
  }

  const addTask = (projectName) => {
    const taskTitle = document.querySelector("#task-title");
    const taskDesc = document.querySelector("#task-description");
    const taskDueDate = document.querySelector("#task-due-date");
    const task = new Task(taskTitle.value);
    task.setDescription(taskDesc.value);
    task.setDueDate(taskDueDate.value);
    const project = toDoList.getProject(projectName);
    project.addTask(task);
  }

  const addProject = (projectName) => {
    const newProject = new Project(projectName);
    toDoList.addNewProject(newProject);
  }

  const hideTaskInput = () => {
    const addTaskInput = document.querySelector(".add-task-input");
    const addTaskInputBtn = document.querySelector(".add-task");
    addTaskInput.style.display = "none";
    addTaskInputBtn.style.display = "flex";
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

  const displayTask = () => {
    const taskListDiv = document.querySelector(".task-list");
    taskListDiv.textContent = "";
    let activeProject = toDoList.getActiveProject();
    let projectTasks = activeProject.getProjectTasks();
    projectTasks.forEach((task, index) => {
      const taskLabel = document.createElement("label");
      taskLabel.classList.add("task")
      taskLabel.setAttribute("for", `task-${index}`);

      const taskCheckbox = document.createElement("input");
      taskCheckbox.setAttribute("type", "checkbox");
      taskCheckbox.setAttribute("id", `task-${index}`);

      const taskTitle = document.createElement("p");
      taskTitle.textContent = task.getTaskTitle();
      
      taskLabel.appendChild(taskCheckbox);
      taskLabel.appendChild(taskTitle);
      taskListDiv.appendChild(taskLabel);
    })
  }

  const displayProjectPage = () => {
    const projectTitle = document.querySelector(".project-title");
    projectTitle.textContent = toDoList.getActiveProjectName();
  }

  const taskBtnListener = () => {
    const addTaskInputBtn = document.querySelector(".add-task");
    addTaskInputBtn.addEventListener("click", displayTaskField);

    const cancelAddTaskBtn = document.querySelector(".btn-cancel-task");
    cancelAddTaskBtn.addEventListener("click", hideTaskInput);

    const addTaskBtn = document.querySelector(".btn-add-task");
    addTaskBtn.addEventListener("click", () => {
      addTask(toDoList.getActiveProjectName());
      displayTask();
      hideTaskInput();
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