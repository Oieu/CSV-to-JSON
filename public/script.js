
function capitalize(text) {
  text = String(text || "").trim();

  return text.charAt(0).toUpperCase() +
         text.slice(1).toLowerCase();
}

function convertProgram(course) {
  const programs = {
    BSIT: "Bachelor of Science in Information Technology",
    BSCS: "Bachelor of Science in Computer Science",
    BSIS: "Bachelor of Science in Information Systems",
    BSCPE: "Bachelor of Science in Computer Engineering"
  };

  const code = String(course || "").trim().toUpperCase();
  return programs[code] || course;
}

function convertCSV() {
  const fileInput = document.getElementById("csvFile");
  const output = document.getElementById("output");
  const message = document.getElementById("message");

  if (!fileInput.files.length) {
    alert("Please select a CSV file.");
    return;
  }

  Papa.parse(fileInput.files[0], {
    header: true,
    skipEmptyLines: true,

    complete: function(results) {
      const required = [
        "student_id", "first_name", "last_name",
        "course", "year_level", "email", "tuition_balance"
      ];

      if (results.errors.length ||
          !required.every(field => results.meta.fields.includes(field))) {
        message.textContent = "Invalid CSV file.";
        output.textContent = "";
        return;
      }

      const converted = results.data.map(row => ({
        studentId: parseInt(row.student_id, 10),
        firstName: capitalize(row.first_name),
        lastName: capitalize(row.last_name),
        program: convertProgram(row.course),
        yearLevel: parseInt(row.year_level, 10),
        emailAddress: String(row.email).trim().toLowerCase(),
        outstandingBalance: Number(
          Number(
            String(row.tuition_balance).replace(/[,₱]/g, "")
          ).toFixed(2)
        )
      }));

      output.textContent = JSON.stringify(converted, null, 2);
      message.textContent = "Conversion successful!";
    },

    error: function() {
      message.textContent = "Failed to read CSV.";
      output.textContent = "";
    }
  });
}
