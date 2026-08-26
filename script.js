/* =========================================
   STUDENT RESULT ANALYZER
   ========================================= */


/* STUDENT DATA */

let students =
    JSON.parse(
        localStorage.getItem(
            "studentResults"
        )
    ) || [];


let editingStudentId = null;


/* ELEMENTS */

const studentForm =
    document.getElementById(
        "studentForm"
    );

const studentName =
    document.getElementById(
        "studentName"
    );

const studentMarks =
    document.getElementById(
        "studentMarks"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );

const tableBody =
    document.getElementById(
        "studentTableBody"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const sortSelect =
    document.getElementById(
        "sortSelect"
    );

const clearAllButton =
    document.getElementById(
        "clearAllButton"
    );

const editModal =
    document.getElementById(
        "editModal"
    );

const editName =
    document.getElementById(
        "editName"
    );

const editMarks =
    document.getElementById(
        "editMarks"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const saveEdit =
    document.getElementById(
        "saveEdit"
    );


/* =========================================
   GRADE CALCULATION
   ========================================= */

function getGrade(marks) {

    if (marks >= 90) {
        return "A";
    }

    if (marks >= 80) {
        return "B";
    }

    if (marks >= 70) {
        return "C";
    }

    if (marks >= 60) {
        return "D";
    }

    if (marks >= 40) {
        return "E";
    }

    return "F";
}


/* =========================================
   PASS / FAIL
   ========================================= */

function isPassed(marks) {

    return marks >= 40;

}


/* =========================================
   SAVE DATA
   ========================================= */

function saveData() {

    localStorage.setItem(
        "studentResults",
        JSON.stringify(students)
    );

}


/* =========================================
   ADD STUDENT
   ========================================= */

studentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            studentName.value.trim();

        const marks =
            Number(
                studentMarks.value
            );


        if (name === "") {

            showMessage(
                "Please enter a student name.",
                "error"
            );

            return;

        }


        if (
            Number.isNaN(marks) ||
            marks < 0 ||
            marks > 100
        ) {

            showMessage(
                "Marks must be between 0 and 100.",
                "error"
            );

            return;

        }


        const student = {

            id:
                Date.now(),

            name:
                name,

            marks:
                marks,

            grade:
                getGrade(marks)

        };


        students.push(student);


        saveData();

        studentForm.reset();

        showMessage(
            `${name} was added successfully.`,
            "success"
        );

        render();

    }
);


/* =========================================
   MESSAGE
   ========================================= */

function showMessage(
    message,
    type
) {

    formMessage.textContent =
        message;

    if (type === "success") {

        formMessage.style.color =
            "#198754";

    } else {

        formMessage.style.color =
            "#dc3545";

    }


    setTimeout(
        function() {

            formMessage.textContent =
                "";

        },
        3000
    );

}


/* =========================================
   RENDER TABLE
   ========================================= */

function render() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    let filteredStudents =
        students.filter(
            function(student) {

                return student.name
                    .toLowerCase()
                    .includes(searchTerm);

            }
        );


    filteredStudents =
        sortStudents(
            filteredStudents
        );


    tableBody.innerHTML = "";


    if (
        filteredStudents.length === 0
    ) {

        emptyState.style.display =
            "block";

    } else {

        emptyState.style.display =
            "none";

    }


    filteredStudents.forEach(
        function(student, index) {

            const row =
                document.createElement(
                    "tr"
                );


            const grade =
                getGrade(
                    student.marks
                );

            const passed =
                isPassed(
                    student.marks
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(student.name)}
                    </strong>
                </td>

                <td>
                    ${student.marks}
                </td>

                <td>
                    <span class="grade grade-${grade}">
                        ${grade}
                    </span>
                </td>

                <td>

                    <span class="status-badge ${
                        passed
                            ? "pass"
                            : "fail"
                    }">

                        ${
                            passed
                                ? "PASS"
                                : "FAIL"
                        }

                    </span>

                </td>

                <td>

                    <button
                        class="action-button edit-button"
                        onclick="openEditModal(${student.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="action-button delete-button"
                        onclick="deleteStudent(${student.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    updateStatistics();

    updateGradeDistribution();

}


/* =========================================
   SORT STUDENTS
   ========================================= */

function sortStudents(
    studentList
) {

    const sorted =
        [...studentList];


    switch (
        sortSelect.value
    ) {

        case "nameAsc":

            sorted.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name
                    )
            );

            break;


        case "nameDesc":

            sorted.sort(
                (a, b) =>
                    b.name.localeCompare(
                        a.name
                    )
            );

            break;


        case "marksHigh":

            sorted.sort(
                (a, b) =>
                    b.marks - a.marks
            );

            break;


        case "marksLow":

            sorted.sort(
                (a, b) =>
                    a.marks - b.marks
            );

            break;


        case "grade":

            sorted.sort(
                (a, b) =>
                    a.marks - b.marks
            );

            sorted.reverse();

            break;

    }


    return sorted;

}


/* =========================================
   UPDATE STATISTICS
   ========================================= */

function updateStatistics() {

    const total =
        students.length;


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    if (total === 0) {

        resetStatistics();

        return;

    }


    const marks =
        students.map(
            student =>
                Number(student.marks)
        );


    const totalMarks =
        marks.reduce(
            (sum, mark) =>
                sum + mark,
            0
        );


    const average =
        totalMarks / total;


    const highest =
        Math.max(...marks);


    const lowest =
        Math.min(...marks);


    const passed =
        students.filter(
            student =>
                isPassed(
                    student.marks
                )
        ).length;


    const failed =
        total - passed;


    const passPercentage =
        (passed / total) * 100;


    const highestStudents =
        students.filter(
            student =>
                student.marks === highest
        );


    const lowestStudents =
        students.filter(
            student =>
                student.marks === lowest
        );


    document.getElementById(
        "classAverage"
    ).textContent =
        average.toFixed(2);


    document.getElementById(
        "highestScore"
    ).textContent =
        highest;


    document.getElementById(
        "lowestScore"
    ).textContent =
        lowest;


    document.getElementById(
        "passedStudents"
    ).textContent =
        passed;


    document.getElementById(
        "failedStudents"
    ).textContent =
        failed;


    document.getElementById(
        "passPercentage"
    ).textContent =
        passPercentage.toFixed(1) + "%";


    document.getElementById(
        "topStudent"
    ).textContent =
        highestStudents[0].name;


    document.getElementById(
        "highestStudentName"
    ).textContent =
        highestStudents
            .map(student => student.name)
            .join(", ");


    document.getElementById(
        "lowestStudentName"
    ).textContent =
        lowestStudents
            .map(student => student.name)
            .join(", ");


    document.getElementById(
        "summaryAverage"
    ).textContent =
        average.toFixed(2);


    document.getElementById(
        "summaryPassPercentage"
    ).textContent =
        passPercentage.toFixed(1) + "%";

}


/* =========================================
   RESET STATISTICS
   ========================================= */

function resetStatistics() {

    document.getElementById(
        "classAverage"
    ).textContent =
        "0.00";


    document.getElementById(
        "highestScore"
    ).textContent =
        "0";


    document.getElementById(
        "lowestScore"
    ).textContent =
        "0";


    document.getElementById(
        "passedStudents"
    ).textContent =
        "0";


    document.getElementById(
        "failedStudents"
    ).textContent =
        "0";


    document.getElementById(
        "passPercentage"
    ).textContent =
        "0%";


    document.getElementById(
        "topStudent"
    ).textContent =
        "-";


    document.getElementById(
        "highestStudentName"
    ).textContent =
        "-";


    document.getElementById(
        "lowestStudentName"
    ).textContent =
        "-";


    document.getElementById(
        "summaryAverage"
    ).textContent =
        "0.00";


    document.getElementById(
        "summaryPassPercentage"
    ).textContent =
        "0%";

}


/* =========================================
   GRADE DISTRIBUTION
   ========================================= */

function updateGradeDistribution() {

    const grades = {

        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0

    };


    students.forEach(
        function(student) {

            const grade =
                getGrade(
                    student.marks
                );

            grades[grade]++;

        }
    );


    const total =
        students.length;


    Object.keys(grades)
        .forEach(
            function(grade) {

                const count =
                    grades[grade];


                const percentage =
                    total === 0
                        ? 0
                        : (
                            count / total
                        ) * 100;


                const bar =
                    document.getElementById(
                        `grade${grade}Bar`
                    );


                const countElement =
                    document.getElementById(
                        `grade${grade}Count`
                    );


                if (bar) {

                    bar.style.width =
                        percentage + "%";

                }


                if (countElement) {

                    countElement.textContent =
                        count;

                }

            }
        );

}


/* =========================================
   DELETE STUDENT
   ========================================= */

function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {
        return;
    }


    const confirmed =
        confirm(
            `Delete ${student.name}'s result?`
        );


    if (!confirmed) {
        return;
    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    saveData();

    render();

}


/* =========================================
   EDIT STUDENT
   ========================================= */

function openEditModal(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {
        return;
    }


    editingStudentId =
        id;


    editName.value =
        student.name;


    editMarks.value =
        student.marks;


    editModal.classList.add(
        "active"
    );

}


window.openEditModal =
    openEditModal;


/* =========================================
   SAVE EDIT
   ========================================= */

saveEdit.addEventListener(
    "click",
    function() {

        const name =
            editName.value.trim();

        const marks =
            Number(
                editMarks.value
            );


        if (
            name === "" ||
            Number.isNaN(marks) ||
            marks < 0 ||
            marks > 100
        ) {

            alert(
                "Please enter a valid name and marks between 0 and 100."
            );

            return;

        }


        const student =
            students.find(
                student =>
                    student.id ===
                    editingStudentId
            );


        if (student) {

            student.name =
                name;

            student.marks =
                marks;

            student.grade =
                getGrade(marks);

        }


        saveData();

        closeEditModal();

        render();

    }
);


/* =========================================
   CLOSE MODAL
   ========================================= */

function closeEditModal() {

    editModal.classList.remove(
        "active"
    );

    editingStudentId =
        null;

}


closeModal.addEventListener(
    "click",
    closeEditModal
);


editModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target ===
            editModal
        ) {

            closeEditModal();

        }

    }
);


/* =========================================
   SEARCH
   ========================================= */

searchInput.addEventListener(
    "input",
    render
);


/* =========================================
   SORT
   ========================================= */

sortSelect.addEventListener(
    "change",
    render
);


/* =========================================
   CLEAR ALL
   ========================================= */

clearAllButton.addEventListener(
    "click",
    function() {

        if (
            students.length === 0
        ) {

            alert(
                "There are no student records to clear."
            );

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all student records?"
            );


        if (!confirmed) {
            return;
        }


        students = [];

        saveData();

        render();

    }
);


/* =========================================
   CSV EXPORT
   ========================================= */

document.getElementById(
    "csvButton"
).addEventListener(
    "click",
    downloadCSV
);


function downloadCSV() {

    if (
        students.length === 0
    ) {

        alert(
            "Add students before exporting."
        );

        return;

    }


    let csv =
        "Name,Marks,Grade,Status\n";


    students.forEach(
        function(student) {

            csv +=
                `"${student.name}",` +
                `${student.marks},` +
                `${getGrade(student.marks)},` +
                `${isPassed(student.marks)
                    ? "PASS"
                    : "FAIL"}\n`;

        }
    );


    downloadFile(
        csv,
        "student-results.csv",
        "text/csv"
    );

}


/* =========================================
   TXT REPORT
   ========================================= */

document.getElementById(
    "txtButton"
).addEventListener(
    "click",
    downloadTXT
);


function downloadTXT() {

    if (
        students.length === 0
    ) {

        alert(
            "Add students before exporting."
        );

        return;

    }


    const stats =
        calculateStatistics();


    let report =
        "STUDENT RESULT ANALYZER\n";

    report +=
        "=========================\n\n";


    report +=
        "STUDENT RESULTS\n";

    report +=
        "-------------------------\n";


    students.forEach(
        function(student, index) {

            report +=
                `${index + 1}. ` +
                `${student.name} | ` +
                `Marks: ${student.marks} | ` +
                `Grade: ${getGrade(student.marks)} | ` +
                `Status: ${
                    isPassed(student.marks)
                        ? "PASS"
                        : "FAIL"
                }\n`;

        }
    );


    report +=
        "\nCLASS SUMMARY\n";

    report +=
        "-------------------------\n";


    report +=
        `Class Average: ${
            stats.average.toFixed(2)
        }\n`;

    report +=
        `Highest Score: ${
            stats.highest
        }\n`;

    report +=
        `Highest Student: ${
            stats.highestStudents
                .map(s => s.name)
                .join(", ")
        }\n`;

    report +=
        `Lowest Score: ${
            stats.lowest
        }\n`;

    report +=
        `Lowest Student: ${
            stats.lowestStudents
                .map(s => s.name)
                .join(", ")
        }\n`;

    report +=
        `Passed: ${
            stats.passed
        }\n`;

    report +=
        `Failed: ${
            stats.failed
        }\n`;

    report +=
        `Pass Percentage: ${
            stats.passPercentage.toFixed(1)
        }%\n`;


    downloadFile(
        report,
        "student-results.txt",
        "text/plain"
    );

}


/* =========================================
   PRINT / PDF
   ========================================= */

document.getElementById(
    "printButton"
).addEventListener(
    "click",
    function() {

        if (
            students.length === 0
        ) {

            alert(
                "Add students before printing the report."
            );

            return;

        }


        window.print();

    }
);


/* =========================================
   CALCULATE STATISTICS
   ========================================= */

function calculateStatistics() {

    const marks =
        students.map(
            student =>
                Number(student.marks)
        );


    const totalMarks =
        marks.reduce(
            (sum, mark) =>
                sum + mark,
            0
        );


    const average =
        totalMarks /
        students.length;


    const highest =
        Math.max(...marks);


    const lowest =
        Math.min(...marks);


    const highestStudents =
        students.filter(
            student =>
                student.marks === highest
        );


    const lowestStudents =
        students.filter(
            student =>
                student.marks === lowest
        );


    const passed =
        students.filter(
            student =>
                isPassed(
                    student.marks
                )
        ).length;


    const failed =
        students.length -
        passed;


    const passPercentage =
        (
            passed /
            students.length
        ) * 100;


    return {

        average,

        highest,

        lowest,

        highestStudents,

        lowestStudents,

        passed,

        failed,

        passPercentage

    };

}


/* =========================================
   DOWNLOAD HELPER
   ========================================= */

function downloadFile(
    content,
    filename,
    type
) {

    const blob =
        new Blob(
            [content],
            {
                type: type
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================
   SECURITY / HTML ESCAPING
   ========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   INITIAL LOAD
   ========================================= */

render();