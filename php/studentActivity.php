<?php
$studentUserID = $_SESSION['userID'] ?? NULL;

if (!$studentUserID) {
  echo "<p>Please log in to view activities.</p>";
  return;
}

$getStudentIdSql = "SELECT userID, id FROM userstable WHERE userID = ?";
$stmt = $conn->prepare($getStudentIdSql);
$stmt->bind_param("s", $studentUserID);
$stmt->execute();
$studentResult = $stmt->get_result();
$studentData = $studentResult->fetch_assoc();

if (!$studentData) {
  echo "<p>Student not found.</p>";
  return;
}

$studentID = $studentData['userID'];

// Modified query to only show activities from courses the student is enrolled in
$sql = 'SELECT 
    a.id AS activity_id, 
    a.title AS title, 
    a.description AS actDesc,
    a.type AS activity_type,
    c.courseID AS courseID, 
    c.courseName AS courseName, 
    a.due_date, 
    a.file_path AS file_path,
    g.grade,
    g.score,
    g.totalItems,
    s.id AS submission_id,
    g.graded_at,
    g.feedback, 
    g.remarks
FROM activitiestable a
JOIN coursestable c ON a.course_id = c.courseID
JOIN enrolledtable e ON e.course_id = c.courseID AND e.user_id = ? AND e.status = "approved"
LEFT JOIN submissionstable s ON s.activity_id = a.id AND s.student_id = ?
LEFT JOIN gradestable g ON g.submission_id = s.id
ORDER BY a.due_date ASC';

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $studentID, $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  echo "<thead>
              <tr>
                <th>Activity</th>
                <th>Description</th>
                <th>Type</th>
                <th>Course</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
                <th>View File</th>
              </tr>
            </thead>
            <tbody>";
  while ($row = $result->fetch_assoc()) {
    if ($row['grade'] !== null) {
      $status = "Graded";
    } elseif ($row['submission_id'] !== null) {
      $status = "Submitted";
    } else {
      $status = "Pending";
    }

    echo "<tr>
                <td>" . htmlspecialchars($row['title']) . "</td>
                <td>". htmlspecialchars($row['actDesc']) ."</td>
                <td>" . htmlspecialchars($row['activity_type']) . "</td>
                <td>" . htmlspecialchars($row['courseName']) . "</td>
                <td>" . htmlspecialchars(date("d-m-Y", strtotime($row['due_date']))) . "</td>
                <td>{$status}</td>
                <td style='position: relative;'>";

    if ($status === "Pending") {
      echo '<form class="activity-form" enctype="multipart/form-data">
            <input type="hidden" name="activity_id" value="' . $row['activity_id'] . '">
            <input type="hidden" name="activity_type" value="' . htmlspecialchars($row['activity_type']) . '">
            <input type="hidden" name="course_id" value="' . htmlspecialchars($row['courseID']) . '">
            
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="file" name="submission_file" accept=".pdf,.doc,.docx,.txt" required 
                       style="display: none;" id="file-input-' . $row['activity_id'] . '">
                <label for="file-input-' . $row['activity_id'] . '" 
                       style="padding: 6px 12px; background: #f0f0f0; border: 1px solid #ddd; 
                              border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Choose File
                </label>
                <button type="button" id="submitActivity" 
                        style="padding: 6px 12px; background: #006aff; color: white; 
                               border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
                    Upload
                </button>
            </div>
          </form>';
    } elseif (strpos($status, "Graded") === 0) {
      $activityId = $row['activity_id'];
      $feedback = $row['feedback'];
      $score = $row['score'];
      $totalItems = $row['totalItems'];
      $grade = $row['grade'];
      echo "<button class='viewGradeBtn' data-grade='" . htmlspecialchars($row['grade']) . "' 
              data-feedback='" . htmlspecialchars($row['feedback']) . "'>
        View Grade
      </button>
      <div id='gradeContainer-$activityId'></div>";
      echo "<script>
                document.querySelectorAll('.viewGradeBtn').forEach(btn => {
                btn.addEventListener('click', e => {
                  e.stopPropagation();

                  const score = btn.dataset.score;
                  const total = btn.dataset.totalItems;
                  const grade = btn.dataset.grade;
                  const feedback = btn.dataset.feedback;
                  const container = btn.nextElementSibling;

                  container.innerHTML = '';

                  const overlay = document.createElement('div');
                  overlay.style.position = 'absolute';
                  overlay.style.background = '#fff';
                  overlay.style.top = '0';
                  overlay.style.left = '0';
                  overlay.style.padding = '10px';
                  overlay.style.border = '1px solid #ccc';
                  overlay.style.zIndex = '999';

                  overlay.innerHTML = `
                    <p>Score: $score/$totalItems</p>
                    <p>Percentage: $grade%</p>
                    <p>Feedback: $feedback</p>
                  `;

                  container.appendChild(overlay);

                  const closeOver = (event) => {
                    if (!overlay.contains(event.target) && event.target !== btn) {
                      overlay.remove();
                      document.removeEventListener('click', closeOver)
                    }
                  };
                  document.addEventListener('click', closeOver);
                });
              });
            </script>";
    } else {
      echo "-";
    }

    echo "</td>
                <td>";
    if (!empty($row["file_path"])) {
      echo "<a href='" . htmlspecialchars($row["file_path"]) . "' target='_blank'>Download</a>";
    } else {
      echo "-";
    }

    echo "</td>
            </tr>";
  }

  echo "</tbody>";
} else {
  echo "<thead>
              <tr>
                <th>Activity</th>
                <th>Description</th>
                <th>Type</th>
                <th>Course</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
                <th>View File</th>
              </tr>
            </thead>
            <tbody>
              <tr class='noData'>
                <td colspan='7'>
                  <p>No activities yet. Activities from your enrolled courses will appear here!</p>
                </td>
              </tr>
            </tbody>";
}
?>