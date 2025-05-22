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

    // Configurar gráfico
    const ctx = document.getElementById("progressChart").getContext("2d");
    let progressChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Pendiente", "En progreso", "Completada"],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ["#ff6384", "#ffcd56", "#4bc0c0"]
            }]
        }
    });

    function updateChart() {
        progressChart.data.datasets[0].data = [
            taskCounts.Pendiente,
            taskCounts["En progreso"],
            taskCounts.Completada
        ];
        progressChart.update();
    }

    // Mostrar modal al hacer clic en "Nuevo Proyecto"
    addProjectBtn?.addEventListener("click", () => {
        projectModal.style.display = "flex";
    });

    // Cerrar modal
    closeModal?.addEventListener("click", () => {
        projectModal.style.display = "none";
    });

    // Guardar nuevo proyecto
    saveProjectBtn?.addEventListener("click", () => {
        const projectName = projectNameInput.value.trim();
        const projectDeadline = projectDeadlineInput.value;
        const projectPriority = projectPriorityInput.value;
        const projectResponsible = projectResponsibleInput.value.trim();
        const projectStatus = projectStatusInput.value;
        const projectComments = projectCommentsInput.value.trim();

        if (projectName && projectDeadline && projectStatus) {
            // Agregar proyecto a la tabla
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${projectName}</td>
                <td>${projectDeadline}</td>
                <td data-priority="${projectPriority}">${projectPriority}</td>
                <td>${projectResponsible || "-"}</td>
                <td>${projectStatus}</td>
                <td>${projectComments || "-"}</td>
            `;
            projectTableBody.appendChild(row);

            // Actualizar gráfico
            if (taskCounts.hasOwnProperty(projectStatus)) {
                taskCounts[projectStatus]++;
                updateChart();
            }

            // Limpiar inputs y cerrar modal
            projectNameInput.value = "";
            projectDeadlineInput.value = "";
            projectPriorityInput.value = "Baja";
            projectResponsibleInput.value = "";
            projectStatusInput.value = "Pendiente";
            projectCommentsInput.value = "";
            projectModal.style.display = "none";
        }
    });

    // Cierre de sesión automático por inactividad
    let inactivityTimer;
    function resetTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            alert("Sesión cerrada por inactividad.");
            location.reload();
        }, 600000); // 1 minutos
    }
    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);
    resetTimer();

    // Cerrar sesión manualmente
    logoutBtn?.addEventListener("click", () => {
        alert("Cerrando sesión...");
        localStorage.setItem("lastPage", window.location.href);
        window.location.href = "MODPRO 4.html";
    });

    // Mostrar mensaje al presionar "Enviar"
    recoverPasswordBtn?.addEventListener("click", () => {
        const email = recoveryEmailInput.value;
        if (email.includes("@")) {
            recoveryMessage.style.display = "block";
            console.log("Enlace de recuperación enviado a:", email);
        } else {
            alert("Ingrese un correo válido.");
        }
    });

    // Cerrar modal de recuperación de contraseña
    closeRecoveryModal?.addEventListener("click", () => {
        recoveryModal.style.display = "none";
    });

    // Si se accede a MODPRO 1.html#recover, mostrar el modal automáticamente
    if (window.location.hash === "#recover") {
        recoveryModal.style.display = "flex";
    }
});
