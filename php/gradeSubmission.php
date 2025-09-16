<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $submissionId = $_POST['submission_id'] ?? null;
    $score = $_POST['score'] ?? null;
    $totalItems = $_POST['total'] ?? null;
    $grade = $_POST['grade'] ?? null;
    $feedback = $_POST['feedback'] ?? '';
    $remarks = $_POST['remarks'] ?? null;
    
    if (!$submissionId || $grade === null || !$remarks) {
        echo json_encode(['success' => false, 'message' => 'NANANA']);
        exit;
    }
    
    if ($grade < 0 || $grade > 100) {
        error_log("ERROR: Invalid grade value: $grade");
        echo json_encode(['success' => false, 'message' => 'Grade must be between 0 and 100']);
        exit;
    }
    
    $remarksLower = strtolower($remarks);
    if (!in_array($remarksLower, ['passed', 'failed'])) {
        error_log("ERROR: Invalid remarks: $remarks");
        echo json_encode(['success' => false, 'message' => 'Remarks must be either "passed" or "failed"']);
        exit;
    }
    
    $conn->autocommit(false);
    error_log("DEBUG: Database autocommit disabled");
    
    try {
        $getSubmissionSql = "SELECT s.student_id, s.activity_id, a.type, a.course_id 
                            FROM submissionstable s 
                            JOIN activitiestable a ON s.activity_id = a.id 
                            WHERE s.id = ?";
        error_log("DEBUG: Submission SQL: " . $getSubmissionSql);
        
        $stmt = $conn->prepare($getSubmissionSql);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param("i", $submissionId);
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        $submissionResult = $stmt->get_result();
        $submissionData = $submissionResult->fetch_assoc();
        
        error_log("DEBUG: Submission data: " . print_r($submissionData, true));
        
        if (!$submissionData) {
            throw new Exception('Submission not found');
        }
        
        $studentID = $submissionData['student_id'];
        $activityType = $submissionData['type'];
        $courseID = $submissionData['course_id'];
        
        error_log("DEBUG: studentID: $studentID, activityType: $activityType, courseID: $courseID");
        
        $checkGradeSql = "SELECT id, remarks FROM gradestable WHERE submission_id = ?";
        error_log("DEBUG: Check grade SQL: " . $checkGradeSql);
        
        $stmt = $conn->prepare($checkGradeSql);
        $stmt->bind_param("i", $submissionId);
        $stmt->execute();
        $gradeResult = $stmt->get_result();
        $existingGrade = $gradeResult->fetch_assoc();
        
        error_log("DEBUG: Existing grade: " . print_r($existingGrade, true));
        
        $previousRemarks = $existingGrade ? $existingGrade['remarks'] : null;
        $newRemarks = $remarksLower;
        
        error_log("DEBUG: Previous remarks: $previousRemarks, New remarks: $newRemarks");
        
        // Insert or update grade
        if ($existingGrade) {
            $updateGradeSql = "UPDATE gradestable SET score = ?, totalItems = ?, grade = ?, feedback = ?, remarks = ?, graded_at = NOW() WHERE id = ?";
            error_log("DEBUG: Update grade SQL: " . $updateGradeSql);
            
            $stmt = $conn->prepare($updateGradeSql);
            $stmt->bind_param("iidssi", $score, $totalItems, $grade, $feedback, $newRemarks, $existingGrade['id']);
            if (!$stmt->execute()) {
                throw new Exception('Update grade failed: ' . $stmt->error);
            }
            error_log("DEBUG: Grade updated successfully");
        } else {
            $insertGradeSql = "INSERT INTO gradestable (submission_id, studentID, score, totalItems, grade, feedback, remarks, graded_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
            error_log("DEBUG: Insert grade SQL: " . $insertGradeSql);
            
            $stmt = $conn->prepare($insertGradeSql);
            $stmt->bind_param("isiidss", $submissionId, $studentID, $score, $totalItems, $grade, $feedback, $newRemarks);
            if (!$stmt->execute()) {
                throw new Exception('Insert grade failed: ' . $stmt->error);
            }
            error_log("DEBUG: Grade inserted successfully");
        }
        
        // Handle progress tracking
        $previousRemarksLower = $previousRemarks ? strtolower($previousRemarks) : null;
        error_log("DEBUG: Progress tracking - Previous: $previousRemarksLower, New: $newRemarks");
        
        if ($previousRemarksLower === 'passed' && $newRemarks === 'failed') {
            error_log("DEBUG: Case 1 - Passed -> Failed: Decrementing progress");
            decrementStudentProgress($studentID, $courseID, $activityType, $conn);
        } elseif ($previousRemarksLower !== 'passed' && $newRemarks === 'passed') {
            error_log("DEBUG: Case 2 - Not Passed -> Passed: Updating progress");
            updateStudentProgressOnPassedGrade($studentID, $courseID, $activityType, $conn);
        } elseif ($previousRemarksLower === 'failed' && $newRemarks === 'failed') {
            error_log("DEBUG: Case 3 - Failed -> Failed: Recalculating progress");
            calculateProgressForStudent($studentID, $courseID, $conn);
        } elseif ($previousRemarksLower === 'passed' && $newRemarks === 'passed') {
            error_log("DEBUG: Case 4 - Passed -> Passed: Recalculating progress");
            calculateProgressForStudent($studentID, $courseID, $conn);
        } else {
            error_log("DEBUG: Case 5 - No progress change needed");
        }
        
        $conn->commit();
        error_log("DEBUG: Transaction committed successfully");
        
        echo json_encode(['success' => true, 'message' => 'Grade recorded successfully']);
        
    } catch (Exception $e) {
        error_log("ERROR: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
        $conn->rollback();
        error_log("DEBUG: Transaction rolled back");
        
        echo json_encode(['success' => false, 'message' => 'Error recording grade: ' . $e->getMessage()]);
    }
    
} else {
    error_log("ERROR: Invalid request method");
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->autocommit(true);
error_log("DEBUG: Script execution completed");
exit;

function decrementStudentProgress($studentUserID, $courseID, $activityType, $conn) {
    error_log("DEBUG: decrementStudentProgress called - student: $studentUserID, course: $courseID, type: $activityType");
    
    $getCourseIdSql = "SELECT courseID FROM coursestable WHERE courseID = ?";
    $stmt = $conn->prepare($getCourseIdSql);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $courseResult = $stmt->get_result();
    $courseData = $courseResult->fetch_assoc();
    
    if (!$courseData) {
        error_log("ERROR: Course not found: $courseID");
        throw new Exception('Course not found');
    }
    
    $courseInternalId = $courseData['courseID'];
    error_log("DEBUG: Course internal ID: $courseInternalId");
    
    $updateField = '';
    switch (strtolower($activityType)) {
        case 'activity':
            $updateField = 'submittedActivity = GREATEST(0, submittedActivity - 1)';
            break;
        case 'exam':
            $updateField = 'submittedExam = GREATEST(0, submittedExam - 1)';
            break;
        case 'project':
            $updateField = 'submittedProjects = GREATEST(0, submittedProjects - 1)';
            break;
        default:
            error_log("ERROR: Invalid activity type: $activityType");
            throw new Exception('Invalid activity type');
    }
    
    error_log("DEBUG: Update field: $updateField");
    
    $updateProgressSql = "UPDATE studentprogress SET {$updateField} WHERE studentID = ? AND course_id = ?";
    error_log("DEBUG: Update progress SQL: " . $updateProgressSql);
    
    $stmt = $conn->prepare($updateProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    
    if (!$stmt->execute()) {
        error_log("ERROR: Update progress failed: " . $stmt->error);
        throw new Exception('Update progress failed: ' . $stmt->error);
    }
    
    error_log("DEBUG: Progress decremented successfully");
    calculateProgressForStudent($studentUserID, $courseInternalId, $conn);
}

function calculateProgressForStudent($studentUserID, $courseInternalId, $conn) {
    error_log("DEBUG: calculateProgressForStudent called - student: $studentUserID, course: $courseInternalId");
    calculateProgress($studentUserID, $courseInternalId, $conn);
}

function updateStudentProgressOnPassedGrade($studentUserID, $courseID, $activityType, $conn) {
    $getCourseIdSql = "SELECT courseID, id FROM coursestable WHERE courseID = ?";
    $stmt = $conn->prepare($getCourseIdSql);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $courseResult = $stmt->get_result();
    $courseData = $courseResult->fetch_assoc();
    
    if (!$courseData) {
        throw new Exception('Course not found');
    }
    
    $courseInternalId = $courseData['courseID'];
    
    $checkProgressSql = "SELECT * FROM studentprogress WHERE studentID = ? AND course_id = ?";
    $stmt = $conn->prepare($checkProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    $stmt->execute();
    $progressResult = $stmt->get_result();
    $progressData = $progressResult->fetch_assoc();
    
    if ($progressData) {
        $updateField = '';
        switch (strtolower($activityType)) {
            case 'activity':
                $updateField = 'submittedActivity = submittedActivity + 1';
                break;
            case 'exam':
                $updateField = 'submittedExam = submittedExam + 1';
                break;
            case 'project':
                $updateField = 'submittedProjects = submittedProjects + 1';
                break;
            default:
                throw new Exception('Invalid activity type');
        }
        
        $updateProgressSql = "UPDATE studentprogress SET {$updateField} WHERE studentID = ? AND course_id = ?";
        $stmt = $conn->prepare($updateProgressSql);
        $stmt->bind_param("ss", $studentUserID, $courseInternalId);
        $stmt->execute();
        
        calculateProgress($studentUserID, $courseInternalId, $conn);
    }
}
function calculateProgress($studentUserID, $courseInternalId, $conn) {
    $getProgressSql = "SELECT submittedActivity, submittedExam, submittedProjects FROM studentprogress WHERE studentID = ? AND course_id = ?";
    $stmt = $conn->prepare($getProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    $stmt->execute();
    $progressResult = $stmt->get_result();
    $progressData = $progressResult->fetch_assoc();
    
    $getTotalsSql = "SELECT totalActivity, totalExam, totalProjects FROM trackingtable WHERE course_id = ?";
    $stmt = $conn->prepare($getTotalsSql);
    $stmt->bind_param("s", $courseInternalId);
    $stmt->execute();
    $totalsResult = $stmt->get_result();
    $totalsData = $totalsResult->fetch_assoc();
    
    if ($progressData && $totalsData) {
        $activityProgress = $totalsData['totalActivity'] > 0 ? $progressData['submittedActivity'] / $totalsData['totalActivity'] : 0;
        $examProgress = $totalsData['totalExam'] > 0 ? $progressData['submittedExam'] / $totalsData['totalExam'] : 0;
        $projectProgress = $totalsData['totalProjects'] > 0 ? $progressData['submittedProjects'] / $totalsData['totalProjects'] : 0;
        
        $overallProgress = ($activityProgress + $examProgress + $projectProgress) / 3 * 100;
        
        $updateProgressSql = "UPDATE studentprogress SET progress = ? WHERE studentID = ? AND course_id = ?";
        $stmt = $conn->prepare($updateProgressSql);
        $stmt->bind_param("dss", $overallProgress, $studentUserID, $courseInternalId);
        $stmt->execute();
    }
}


?>