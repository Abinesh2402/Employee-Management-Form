const form = document.getElementById("employeeForm");
const table = document.getElementById("employeeTable");

let employees = JSON.parse(
    localStorage.getItem("employees") || "[]"
);

let editingId = null;

// Save employees in browser storage
function saveData() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

// Display employees
function displayEmployees(searchText = "") {

    table.innerHTML = "";

    const filtered = employees.filter(emp =>
        [
            emp.name,
            emp.empid,
            emp.email,
            emp.department,
            emp.designation
        ].some(value =>
            value.toLowerCase().includes(searchText.toLowerCase())
        )
    );

    if (filtered.length === 0) {
        const row = table.insertRow();
        const cell = row.insertCell();

        cell.colSpan = 8;
        cell.textContent = "No employees found";
    }

    filtered.forEach(emp => {

        const row = table.insertRow();

        [
            emp.empid,
            emp.name,
            emp.email,
            emp.phone,
            emp.department,
            emp.designation,
            "₹" + Number(emp.salary).toLocaleString("en-IN")
        ].forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
        });

        const actionCell = row.insertCell();

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editEmployee(emp.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteEmployee(emp.id));

        actionCell.append(editButton, deleteButton);
    });

    updateStats();
}

// Add or update employee
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const employee = {
        name: document.getElementById("name").value.trim(),
        empid: document.getElementById("empid").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value,
        designation: document.getElementById("designation").value.trim(),
        salary: document.getElementById("salary").value
    };

    // Check duplicate employee ID
    const duplicate = employees.some(emp =>
        emp.empid.toLowerCase() === employee.empid.toLowerCase() &&
        emp.id !== editingId
    );

    if (duplicate) {
        alert("Employee ID already exists!");
        return;
    }

    if (editingId !== null) {

        const index = employees.findIndex(emp => emp.id === editingId);

        employees[index] = {
            ...employee,
            id: editingId
        };

        editingId = null;
        alert("Employee updated successfully!");

    } else {

        employee.id = Date.now().toString();
        employees.push(employee);

        alert("Employee added successfully!");
    }

    saveData();
    displayEmployees();
    form.reset();

    document.getElementById("submitBtn").textContent = "Add Employee";
    document.getElementById("cancelBtn").hidden = true;
});

// Edit employee
function editEmployee(id) {

    const emp = employees.find(emp => emp.id === id);

    if (!emp) return;

    document.getElementById("name").value = emp.name;
    document.getElementById("empid").value = emp.empid;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;
    document.getElementById("department").value = emp.department;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("salary").value = emp.salary;

    editingId = id;

    document.getElementById("submitBtn").textContent = "Update Employee";
    document.getElementById("cancelBtn").hidden = false;

    document.getElementById("name").focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cancel editing
function cancelEdit() {

    editingId = null;
    form.reset();

    document.getElementById("submitBtn").textContent = "Add Employee";
    document.getElementById("cancelBtn").hidden = true;
}

// Delete employee
function deleteEmployee(id) {

    if (confirm("Are you sure you want to delete this employee?")) {

        employees = employees.filter(emp => emp.id !== id);

        if (editingId === id) {
            cancelEdit();
        }

        saveData();
        displayEmployees();

        alert("Employee deleted successfully!");
    }
}

// Search employee
document.getElementById("search").addEventListener("input", function() {
    displayEmployees(this.value);
});

// Dashboard statistics
function updateStats() {

    document.getElementById("totalEmployees").textContent =
        employees.length;

    const total = employees.reduce(
        (sum, emp) => sum + Number(emp.salary),
        0
    );

    document.getElementById("totalSalary").textContent =
        "₹" + total.toLocaleString("en-IN");
}

// Initial display
displayEmployees();