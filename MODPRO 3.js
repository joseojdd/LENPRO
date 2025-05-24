document.addEventListener("DOMContentLoaded", () => {
    // MODPRO 1: Elementos del Dashboard y Proyectos
    const addProjectBtn = document.getElementById("addProject");
    const saveProjectBtn = document.getElementById("saveProject");
    const closeModal = document.getElementById("closeModal");
    const projectModal = document.getElementById("projectModal");
    const projectTableBody = document.getElementById("projectTableBody");
    const logoutBtn = document.getElementById("logout");
    const recoveryModal = document.getElementById("passwordRecoveryModal");
    const closeRecoveryModal = document.getElementById("closeRecoveryModal");
    const recoverPasswordBtn = document.getElementById("recoverPassword");
    const recoveryEmailInput = document.getElementById("recoveryEmail");
    const recoveryMessage = document.getElementById("recoveryMessage");

    const projectNameInput = document.getElementById("projectName");
    const projectDeadlineInput = document.getElementById("projectDeadline");
    const projectPriorityInput = document.getElementById("projectPriority");
    const projectResponsibleInput = document.getElementById("projectResponsible");
    const projectStatusInput = document.getElementById("projectStatus");
    const projectCommentsInput = document.getElementById("projectComments");

    let taskCounts = {
        Pendiente: 0,
        "En progreso": 0,
        Completada: 0
    };

    const chartCanvas = document.getElementById("progressChart");
    let progressChart = null;
    if (chartCanvas) {
        const ctx = chartCanvas.getContext("2d");
        progressChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Pendiente", "En progreso", "Completada"],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ["#ff6384", "#ffcd56", "#4bc0c0"]
                }]
            }
        });
    }

    function updateChart() {
        if (progressChart) {
            progressChart.data.datasets[0].data = [
                taskCounts.Pendiente,
                taskCounts["En progreso"],
                taskCounts.Completada
            ];
            progressChart.update();
        }
    }

    function saveProjectsToStorage(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    function loadProjectsFromStorage() {
        const data = localStorage.getItem('projects');
        return data ? JSON.parse(data) : [];
    }

    function renderProjects() {
        if (!projectTableBody) return;
        const currentUser = localStorage.getItem('currentUser');
        const projects = loadProjectsFromStorage();
        const userProjects = projects.filter(project => project.user === currentUser);
        projectTableBody.innerHTML = '';
        taskCounts = { Pendiente: 0, "En progreso": 0, Completada: 0 };
        userProjects.forEach((project, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.deadline}</td>
                <td data-priority="${project.priority}">${project.priority}</td>
                <td>${project.responsible || '-'}</td>
                <td>${project.status}</td>
                <td>${project.comments || '-'}</td>
                <td><img src="https://cdn-icons-png.flaticon.com/512/542/542724.png" class="delete-project" data-index="${index}" alt="Eliminar" title="Eliminar" style="width:24px; height:24px; cursor:pointer;"></td>
            `;
            projectTableBody.appendChild(row);
            if (taskCounts.hasOwnProperty(project.status)) {
                taskCounts[project.status]++;
            }
        });
        document.querySelectorAll('.delete-project').forEach((icon, idx) => {
            icon.addEventListener('click', function() {
                const projects = loadProjectsFromStorage();
                let userProjects = projects.filter(project => project.user === currentUser);
                const projectToDelete = userProjects[idx];
                const projectIndex = projects.findIndex(p => p === projectToDelete);
                if (projectIndex !== -1) {
                    projects.splice(projectIndex, 1);
                    saveProjectsToStorage(projects);
                    renderProjects();
                }
            });
        });
        updateChart();
    }

    if (projectTableBody) {
        renderProjects();
    }

    addProjectBtn?.addEventListener("click", () => {
        projectModal.style.display = "flex";
    });

    closeModal?.addEventListener("click", () => {
        projectModal.style.display = "none";
    });

    saveProjectBtn?.addEventListener("click", () => {
        const projectName = projectNameInput.value.trim();
        const projectDeadline = projectDeadlineInput.value;
        const projectPriority = projectPriorityInput.value;
        const projectResponsible = projectResponsibleInput.value.trim();
        const projectStatus = projectStatusInput.value;
        const projectComments = projectCommentsInput.value.trim();
        const currentUser = localStorage.getItem('currentUser');

        if (projectName && projectDeadline && projectStatus && currentUser) {
            const projects = loadProjectsFromStorage();
            projects.push({
                name: projectName,
                deadline: projectDeadline,
                priority: projectPriority,
                responsible: projectResponsible,
                status: projectStatus,
                comments: projectComments,
                user: currentUser
            });
            saveProjectsToStorage(projects);
            renderProjects();

            projectNameInput.value = "";
            projectDeadlineInput.value = "";
            projectPriorityInput.value = "Baja";
            projectResponsibleInput.value = "";
            projectStatusInput.value = "Pendiente";
            projectCommentsInput.value = "";
            projectModal.style.display = "none";
        }
    });

    let inactivityTimer;
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            alert("Sesión cerrada por inactividad.");
            location.reload();
        }, 600000);
    }
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();

    logoutBtn?.addEventListener("click", () => {
        alert("Cerrando sesión...");
        localStorage.setItem("lastPage", window.location.href);
        window.location.href = "MODPRO 4.html";
    });

    recoverPasswordBtn?.addEventListener("click", () => {
        const email = recoveryEmailInput.value;
        if (email.includes("@")) {
            recoveryMessage.style.display = "block";
            console.log("Enlace de recuperación enviado a:", email);
        } else {
            alert("Ingrese un correo válido.");
        }
    });

    closeRecoveryModal?.addEventListener("click", () => {
        recoveryModal.style.display = "none";
    });

    if (window.location.hash === "#recover") {
        recoveryModal.style.display = "flex";
    }

    // --- Modal y recuperación para MODPRO 4.html ---
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const recoverPasswordModal = document.getElementById("recoverPasswordModal");
    const closeRecoverPassword = document.getElementById("closeRecoverPassword");
    const sendPasswordRecovery = document.getElementById("sendPasswordRecovery");
    const passwordRecoveryEmail = document.getElementById("passwordRecoveryEmail");
    const passwordRecoveryMessage = document.getElementById("passwordRecoveryMessage");
    const recoverUserModal = document.getElementById("recoverUserModal");
    const closeRecoverUser = document.getElementById("closeRecoverUser");
    const sendUserRecovery = document.getElementById("sendUserRecovery");
    const userRecoveryEmail = document.getElementById("userRecoveryEmail");
    const userRecoveryMessage = document.getElementById("userRecoveryMessage");
    const recoverUserLink = document.getElementById("recoverUserLink"); 

    if (forgotPasswordLink && recoverPasswordModal) {
        forgotPasswordLink.addEventListener("click", () => {
            recoverPasswordModal.style.display = "flex";
        });
    }
    if (closeRecoverPassword && recoverPasswordModal) {
        closeRecoverPassword.addEventListener("click", () => {
            recoverPasswordModal.style.display = "none";
        });
    }
    if (sendPasswordRecovery && passwordRecoveryEmail && passwordRecoveryMessage) {
        sendPasswordRecovery.addEventListener("click", () => {
            const email = passwordRecoveryEmail.value;
            if (email.includes("@")) {
                passwordRecoveryMessage.style.display = "block";
                console.log("Se enviaría un enlace de recuperación a:", email);
            } else {
                alert("Por favor, ingrese un correo válido.");
            }
        });
    }
    if (recoverUserLink && recoverUserModal) {
        recoverUserLink.addEventListener("click", () => {
            recoverUserModal.style.display = "flex";
        });
    }
    if (closeRecoverUser && recoverUserModal) {
        closeRecoverUser.addEventListener("click", () => {
            recoverUserModal.style.display = "none";
        });
    }
    if (sendUserRecovery && userRecoveryEmail && userRecoveryMessage) {
        sendUserRecovery.addEventListener("click", () => {
            const email = userRecoveryEmail.value;
            if (email.includes("@")) {
                userRecoveryMessage.style.display = "block";
                console.log("Se enviaría el usuario a:", email);
            } else {
                alert("Por favor, ingrese un correo válido.");
            }
        });
    }
});
