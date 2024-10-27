document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("taskList");
    const searchInput = document.getElementById("search");
    const newTaskInput = document.getElementById("newTask");
    const taskDateInput = document.getElementById("taskDate");
    const addTaskBtn = document.getElementById("addTaskBtn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    displayTasks(tasks);

    addTaskBtn.addEventListener("click", function () {
        const taskText = newTaskInput.value.trim();
        const taskDate = taskDateInput.value;

        if (!validateTask(taskText, taskDate)) {
            alert("Zadanie musi mieć od 3 do 255 znaków, a data (jeśli podana) powinna być w przyszłości.");
            return;
        }

        const task = { text: taskText, date: taskDate, id: Date.now() };
        tasks.push(task);
        saveTasks();
        displayTasks(tasks);
        newTaskInput.value = "";
        taskDateInput.value = "";
    });

    function validateTask(text, date) {
        if (text.length < 3 || text.length > 255) return false;

        if (date) {
            const selectedDate = new Date(date);
            const currentDate = new Date();

            // Set both dates to the start of the day for accurate comparison
            selectedDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            // Check if the selected date is in the future
            if (selectedDate <= currentDate) return false;
        }

        return true;
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function displayTasks(taskArray) {
        taskList.innerHTML = "";
        taskArray.forEach(task => {
            const li = document.createElement("li");
            const taskText = document.createElement("span");
            const deleteBtn = document.createElement("button");

            taskText.textContent = task.text;
            deleteBtn.textContent = "Usuń";
            deleteBtn.classList.add("delete-btn");

            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            li.dataset.id = task.id;

            if (task.date) {
                const dateSpan = document.createElement("span");
                dateSpan.textContent = ` (do: ${formatDate(task.date)})`;
                li.appendChild(dateSpan);
            }

            taskList.appendChild(li);

            deleteBtn.addEventListener("click", function (e) {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                displayTasks(tasks);
                e.stopPropagation();
            });

            taskText.addEventListener("click", function () {
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;
                li.replaceChild(editInput, taskText);

                editInput.addEventListener("blur", function () {
                    const updatedText = editInput.value.trim();
                    if (validateTask(updatedText, task.date)) {
                        task.text = updatedText;
                        saveTasks();
                        displayTasks(tasks);
                    } else {
                        alert("Zadanie musi mieć od 3 do 255 znaków.");
                        displayTasks(tasks);
                    }
                });

                editInput.focus();
            });
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        if (searchText.length < 2) {
            displayTasks(tasks);
            return;
        }

        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchText));
        highlightAndDisplayTasks(filteredTasks, searchText);
    });

    function highlightAndDisplayTasks(taskArray, searchText) {
        taskList.innerHTML = "";
        taskArray.forEach(task => {
            const li = document.createElement("li");
            const taskText = document.createElement("span");
            const deleteBtn = document.createElement("button");

            // Highlight search term
            const regex = new RegExp(`(${searchText})`, "gi");
            taskText.innerHTML = task.text.replace(regex, "<span class='highlight'>$1</span>");
            deleteBtn.textContent = "Usuń";
            deleteBtn.classList.add("delete-btn");

            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            li.dataset.id = task.id;

            if (task.date) {
                const dateSpan = document.createElement("span");
                dateSpan.textContent = ` (do: ${formatDate(task.date)})`;
                li.appendChild(dateSpan);
            }

            taskList.appendChild(li);

            deleteBtn.addEventListener("click", function (e) {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                displayTasks(tasks);
                e.stopPropagation();
            });

            taskText.addEventListener("click", function () {
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = task.text;
                li.replaceChild(editInput, taskText);

                editInput.addEventListener("blur", function () {
                    const updatedText = editInput.value.trim();
                    if (validateTask(updatedText, task.date)) {
                        task.text = updatedText;
                        saveTasks();
                        displayTasks(tasks);
                    } else {
                        alert("Zadanie musi mieć od 3 do 255 znaków.");
                        displayTasks(tasks);
                    }
                });

                editInput.focus();
            });
        });
    }
});
