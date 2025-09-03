-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2025 at 02:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elms_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitiestable`
--

CREATE TABLE `activitiestable` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `due_date` datetime DEFAULT NULL,
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activitiestable`
--

INSERT INTO `activitiestable` (`id`, `course_id`, `created_by`, `title`, `description`, `file_path`, `created_at`, `due_date`, `type`) VALUES
(16, 'AGRINCII', '2025T-00001', 'dagadg', 'adfgdsg', '../uploads/activities/Activity_dagadg_AGRINCII.txt', '2025-08-31 16:56:42', '2025-08-31 00:00:00', 'Activity'),
(17, 'AGRINCII', '2025T-00001', 'dasfdasfadsgfad', 'asdgafdgadfgadgfadfds', NULL, '2025-08-31 21:57:40', '2025-08-31 00:00:00', 'Exam');

-- --------------------------------------------------------

--
-- Table structure for table `announcementtable`
--

CREATE TABLE `announcementtable` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `type` enum('notice','announcement') DEFAULT NULL,
  `message` text DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcementtable`
--

INSERT INTO `announcementtable` (`id`, `course_id`, `created_by`, `type`, `message`, `expires_at`, `created_at`) VALUES
(36, 3, NULL, 'announcement', 'WAS DONT', NULL, '2025-09-02 12:17:01');

-- --------------------------------------------------------

--
-- Table structure for table `assignedcourses`
--

CREATE TABLE `assignedcourses` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `trainer_id` varchar(30) NOT NULL,
  `trainerName` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignedcourses`
--

INSERT INTO `assignedcourses` (`id`, `course_id`, `trainer_id`, `trainerName`) VALUES
(1, 'AGRINCII', '2025T-00001', 'Harley David Son');

-- --------------------------------------------------------

--
-- Table structure for table `basiccompetency`
--

CREATE TABLE `basiccompetency` (
  `id` int(11) NOT NULL,
  `courseID` int(30) NOT NULL,
  `basicPoints` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `basiccompetency`
--

INSERT INTO `basiccompetency` (`id`, `courseID`, `basicPoints`) VALUES
(1, 3, 'Receive and respond to workplace communication'),
(2, 3, 'Work with others'),
(3, 3, 'Demonstrate work values'),
(4, 4, 'Participate in workplace communication'),
(5, 4, 'Work in team environment'),
(6, 5, 'Receive and respond to workplace communication'),
(7, 5, 'Work with others'),
(8, 5, 'Demonstrate work values'),
(9, 6, 'Receive and respond to workplace communication'),
(10, 6, 'Work with others'),
(11, 7, 'Participate in workplace communication'),
(12, 7, 'Work in team environment'),
(13, 8, 'Participate in workplace communication'),
(14, 8, 'Work in team environment'),
(15, 9, 'Observe road safety'),
(16, 9, 'Work in team environment'),
(17, 10, 'Participate in workplace communication'),
(18, 10, 'Work with others');

-- --------------------------------------------------------

--
-- Table structure for table `commoncompetency`
--

CREATE TABLE `commoncompetency` (
  `id` int(11) NOT NULL,
  `courseID` int(30) NOT NULL,
  `commonPoints` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commoncompetency`
--

INSERT INTO `commoncompetency` (`id`, `courseID`, `commonPoints`) VALUES
(1, 3, 'Apply safety measures\r\n'),
(2, 3, 'Use farm tools and equipment'),
(3, 4, 'Use automotive hand tools'),
(4, 4, 'Perform mensuration and calculations'),
(5, 5, 'Use of tools, equipment and facilities'),
(6, 5, 'Perform mensuration and calculations'),
(7, 6, 'Use sewing tools and equipment'),
(8, 6, 'Draft and cut patterns'),
(9, 7, 'Use hairdressing tools'),
(10, 7, 'Practice personal hygiene'),
(11, 8, 'Demonstrate cultural sensitivity'),
(12, 8, 'Practice correct pronunciation'),
(13, 9, 'Check and inspect vehicles'),
(14, 9, 'Perform basic troubleshooting'),
(15, 10, 'Use of tools and equipment'),
(16, 10, 'Practice proper cutting techniques');

-- --------------------------------------------------------

--
-- Table structure for table `corecompetency`
--

CREATE TABLE `corecompetency` (
  `id` int(11) NOT NULL,
  `courseID` int(30) NOT NULL,
  `corePoints` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `corecompetency`
--

INSERT INTO `corecompetency` (`id`, `courseID`, `corePoints`) VALUES
(1, 3, 'Prepare land for agricultural crop production'),
(2, 3, 'Care and manage crops'),
(3, 4, 'Perform under-chassis preventive maintenance'),
(4, 4, 'Service battery and ignition system'),
(5, 5, 'Prepare bakery products'),
(6, 5, 'Prepare pastry products'),
(7, 6, 'Sew casual dresses'),
(8, 6, 'Sew skirts and blouses'),
(9, 7, 'Perform hair cutting'),
(10, 7, 'Perform hair coloring'),
(11, 7, 'Perform hair styling'),
(12, 8, 'Speak basic Nihongo'),
(13, 8, 'Understand Japanese customs and etiquette'),
(14, 9, 'Operate light vehicles'),
(15, 9, 'Perform defensive driving techniques'),
(16, 10, 'Construct men’s trousers'),
(17, 10, 'Construct polo shirts and barong'),
(18, 11, 'core 1'),
(19, 11, 'core 2'),
(20, 11, 'core 3');

-- --------------------------------------------------------

--
-- Table structure for table `coursestable`
--

CREATE TABLE `coursestable` (
  `id` int(11) NOT NULL,
  `courseID` varchar(20) DEFAULT NULL,
  `courseName` varchar(100) DEFAULT NULL,
  `courseSchedule` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `filePath` text NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coursestable`
--

INSERT INTO `coursestable` (`id`, `courseID`, `courseName`, `courseSchedule`, `description`, `filePath`, `status`) VALUES
(3, 'AGRINCII', 'Agricultural Crops Production NC II', 'M-F 1:00 - 3:00', 'Learn crop production, farm tools usage, and sustainable agriculture techniques.', 'uploads/images/agriculture.jpg', 'Offered'),
(4, 'ASNCI', 'Automotive Servicing NC I', 'T-Th 9:00 - 11:00', 'Get started with basic automotive maintenance and repair services.', 'uploads/images/automotive.jpg', 'Offered'),
(5, 'BAPPNCII', 'Bread and Pastry Production NC II', 'M-W 9:00 - 11:00', 'Master the fundamentals of baking and pastry preparation.', 'uploads/images/breadmaking.jpg', 'Offered'),
(6, 'DRSNCII', 'Dressmaking NC II', 'F-Sat 10:00 - 12:00', 'Learn how to design, measure, cut, and sew dresses professionally.', 'uploads/images/dressmaking.webp', 'Offered'),
(7, 'HDSNCII', 'Hairdressing NC II', 'Th-F 9:00 -12:00', 'Gain skills in hair cutting, coloring, styling, and salon operations.', 'uploads/images/hairdressing.webp', 'Offered'),
(8, 'JLC', 'Japanese Language and Culture', 'W 1:00-4:00', 'Study basic Nihongo and understand essential aspects of Japanese culture.', 'uploads/images/japanese.jpg', 'Offered'),
(9, 'DRINCII', 'Driving NC II', 'Sat 8:00 - 12:00', 'Develop safe driving skills and gain vehicle operation knowledge.', 'uploads/images/driving.webp', 'Not Offered'),
(10, 'TNCII', 'Tailoring NC II', 'T 9:00 - 12:00', 'Train in precision tailoring, pattern making, and garment construction.', 'uploads/images/tailoring.webp', 'Offered');

-- --------------------------------------------------------

--
-- Table structure for table `coursetracker`
--

CREATE TABLE `coursetracker` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coursetracker`
--

INSERT INTO `coursetracker` (`id`, `course_id`, `status`) VALUES
(1, 'AGRINCII', 'enabled');

-- --------------------------------------------------------

--
-- Table structure for table `enrolledtable`
--

CREATE TABLE `enrolledtable` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `user_id` varchar(30) NOT NULL,
  `enrollment_id` int(11) NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrolledtable`
--

INSERT INTO `enrolledtable` (`id`, `course_id`, `user_id`, `enrollment_id`, `status`) VALUES
(7, 'AGRINCII', '2025S-000001', 33, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `enrollmenttable`
--

CREATE TABLE `enrollmenttable` (
  `id` int(11) NOT NULL,
  `user_id` varchar(30) DEFAULT NULL,
  `course_id` varchar(30) DEFAULT NULL,
  `teacher_id` varchar(30) DEFAULT NULL,
  `status` enum('pending','approved','denied') DEFAULT NULL,
  `enrolled_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollmenttable`
--

INSERT INTO `enrollmenttable` (`id`, `user_id`, `course_id`, `teacher_id`, `status`, `enrolled_at`) VALUES
(33, '2025S-000001', 'AGRINCII', NULL, 'approved', '2025-08-31 17:55:19');

-- --------------------------------------------------------

--
-- Table structure for table `finalgradestable`
--

CREATE TABLE `finalgradestable` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `total_grade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gradestable`
--

CREATE TABLE `gradestable` (
  `id` int(11) NOT NULL,
  `submission_id` int(11) DEFAULT NULL,
  `studentID` varchar(30) NOT NULL,
  `grade` decimal(5,2) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `graded_at` datetime DEFAULT current_timestamp(),
  `remarks` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gradestable`
--

INSERT INTO `gradestable` (`id`, `submission_id`, `studentID`, `grade`, `feedback`, `graded_at`, `remarks`) VALUES
(5, 1, '2025S-000001', 87.00, 'fhfghfjhgjfhg', '2025-09-01 00:34:39', 'passed');

-- --------------------------------------------------------

--
-- Table structure for table `modulestable`
--

CREATE TABLE `modulestable` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) DEFAULT NULL,
  `trainerID` varchar(30) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `modulestable`
--

INSERT INTO `modulestable` (`id`, `course_id`, `trainerID`, `title`, `description`, `file_path`, `created_at`) VALUES
(13, 'AGRINCII', '2025T-00001', 'EDIT', 'FADASEM', '../uploads/modules/Module_dasfdfdasfa_AGRINCII.txt', '2025-08-31 17:44:37');

-- --------------------------------------------------------

--
-- Table structure for table `studentprogress`
--

CREATE TABLE `studentprogress` (
  `id` int(11) NOT NULL,
  `studentID` varchar(30) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `courseName` text NOT NULL,
  `trackingID` int(11) NOT NULL,
  `submittedActivity` int(11) NOT NULL,
  `submittedExam` int(11) NOT NULL,
  `submittedProjects` int(11) NOT NULL,
  `progress` decimal(5,2) NOT NULL DEFAULT 0.00,
  `last_updated` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `studentprogress`
--

INSERT INTO `studentprogress` (`id`, `studentID`, `course_id`, `courseName`, `trackingID`, `submittedActivity`, `submittedExam`, `submittedProjects`, `progress`, `last_updated`) VALUES
(26, '2025S-000001', 'AGRINCII', 'Agricultural Crops Production NC II', 1, 1, 0, 0, 0.72, '2025-09-01 00:34:51'),
(27, '2025S-00003', 'AGRINCII', 'Agricultural Crops Production NC II', 1, 0, 0, 0, 0.00, '2025-09-02 12:01:08');

--
-- Triggers `studentprogress`
--
DELIMITER $$
CREATE TRIGGER `update_student_status` AFTER INSERT ON `studentprogress` FOR EACH ROW BEGIN
    DECLARE course_count INT;
    
    SELECT COUNT(*) INTO course_count 
    FROM studentprogress 
    WHERE studentID = NEW.studentID;
    
    IF course_count > 0 THEN
        UPDATE traineestable 
        SET status = 'Ongoing' 
        WHERE studentID = NEW.studentID;
    ELSE
        UPDATE traineestable 
        SET status = 'Idle' 
        WHERE studentID = NEW.studentID;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `update_student_status_delete` AFTER DELETE ON `studentprogress` FOR EACH ROW BEGIN
    DECLARE course_count INT;
    
    SELECT COUNT(*) INTO course_count 
    FROM studentprogress 
    WHERE studentID = OLD.studentID;
    
    IF course_count > 0 THEN
        UPDATE traineestable 
        SET status = 'Ongoing' 
        WHERE studentID = OLD.studentID;
    ELSE
        UPDATE traineestable 
        SET status = 'Idle' 
        WHERE studentID = OLD.studentID;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `submissionstable`
--

CREATE TABLE `submissionstable` (
  `id` int(11) NOT NULL,
  `activity_id` int(11) DEFAULT NULL,
  `student_id` varchar(30) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  `type` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submissionstable`
--

INSERT INTO `submissionstable` (`id`, `activity_id`, `student_id`, `file_path`, `submitted_at`, `type`) VALUES
(1, 16, '2025S-000001', 'uploads/submissions/2025S-000001_16_1756652858.txt', '2025-08-31 23:07:38', '');

-- --------------------------------------------------------

--
-- Table structure for table `timetracker`
--

CREATE TABLE `timetracker` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trackingtable`
--

CREATE TABLE `trackingtable` (
  `id` int(11) NOT NULL,
  `course_id` varchar(30) DEFAULT NULL,
  `totalActivity` int(11) NOT NULL,
  `totalExam` int(11) NOT NULL,
  `totalProjects` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trackingtable`
--

INSERT INTO `trackingtable` (`id`, `course_id`, `totalActivity`, `totalExam`, `totalProjects`) VALUES
(1, 'AGRINCII', 92, 6, 2),
(2, 'TNCII', 78, 4, 3),
(3, 'JLC', 91, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `traineestable`
--

CREATE TABLE `traineestable` (
  `id` int(11) NOT NULL,
  `studentID` varchar(30) NOT NULL,
  `studentName` text NOT NULL,
  `status` text NOT NULL,
  `enrolledDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `traineestable`
--

INSERT INTO `traineestable` (`id`, `studentID`, `studentName`, `status`, `enrolledDate`) VALUES
(11, '2025S-00003', 'Ruby Xander Cube', 'Ongoing', '2025-09-02');

-- --------------------------------------------------------

--
-- Table structure for table `trainercourses`
--

CREATE TABLE `trainercourses` (
  `id` int(11) NOT NULL,
  `trainerID` varchar(50) NOT NULL,
  `courseID` varchar(50) NOT NULL,
  `courseName` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainercourses`
--

INSERT INTO `trainercourses` (`id`, `trainerID`, `courseID`, `courseName`) VALUES
(4, '2025T-00001', 'AGRINCII', 'Agricultural Crops Production NC II'),
(5, '2025T-00001', 'AGRINCII', 'Agricultural Crops Production NC II');

-- --------------------------------------------------------

--
-- Table structure for table `trainerstable`
--

CREATE TABLE `trainerstable` (
  `id` int(11) NOT NULL,
  `trainerID` varchar(30) NOT NULL,
  `trainerName` text NOT NULL,
  `status` text NOT NULL,
  `assignedDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainerstable`
--

INSERT INTO `trainerstable` (`id`, `trainerID`, `trainerName`, `status`, `assignedDate`) VALUES
(29, '2025T-00001', 'Harley David Son', 'active', '2025-08-25');

-- --------------------------------------------------------

--
-- Stand-in structure for view `trainers_view`
-- (See below for the actual view)
--
CREATE TABLE `trainers_view` (
`trainerID` int(11)
,`trainerName` varchar(163)
);

-- --------------------------------------------------------

--
-- Table structure for table `userstable`
--

CREATE TABLE `userstable` (
  `id` int(11) NOT NULL,
  `userID` varchar(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `suffix` varchar(10) DEFAULT NULL,
  `gender` enum('M','F','Other') NOT NULL,
  `age` int(11) NOT NULL,
  `birthDate` date NOT NULL,
  `bio` text NOT NULL,
  `role` enum('guest','admin','trainer','trainee') NOT NULL,
  `mobileNumber` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `education` text NOT NULL,
  `profileImage` text NOT NULL,
  `dateCreated` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userstable`
--

INSERT INTO `userstable` (`id`, `userID`, `firstName`, `middleName`, `lastName`, `suffix`, `gender`, `age`, `birthDate`, `bio`, `role`, `mobileNumber`, `email`, `password`, `education`, `profileImage`, `dateCreated`) VALUES
(21, '2025S-000001', 'Erick', 'Cats', 'Gaceta', '', 'M', 22, '2025-08-28', 'Student of Benguet Technical School', 'guest', '+639201555544', 'gacetaerick124@gmail.com', '$2y$10$vpy.68.Y/QDm6WLf2btzzuIA2I9tHHQy3Zixc5eQPkzAuZICs.GRq', 'College', 'uploads/profiles/user_21_1755881782.png', '2025-08-23'),
(31, '2025A-000006', 'Anne', 'Sacramento', 'Thesia', '', 'F', 45, '1980-06-18', 'Graduate of Doctor of Philosophy (PhD) in Administration and Supervision', 'admin', '+639201551234', 'annesthesia@bts.gov.ph', '$2y$10$FF7v5rny92ODpf4jahUAxe0f5.u8P6UfmcoqNNlI3BCyBN5AWeA36', 'Graduate', 'uploads/profiles/user_31_1756211718.jpg', '2025-08-23'),
(32, '2025S-00002', 'Dre', 'Santos', 'Maker', 'JR', 'M', 26, '1999-03-23', 'Student of Benguet Technical School', 'guest', '+639692012345', 'dre.ss.maker@gmail.com', '$2y$10$YiBnAu5mAwNi9n55zjT94eshUvQfxetlZUhzuQSUMoq/xSKp4A3p2', 'SHS', '', '2025-08-23'),
(57, '2025T-00001', 'Harley', 'David', 'Son', '', 'M', 0, '2025-08-26', '', 'trainer', '+639201555544', 'harley.son@bts.gov.ph', '$2y$10$/rtkNK9mJSIwt/alWtq4euZeCcoxAAD6QeQpHdOx4eg1zZL0owXoq', 'Bachelor\'s Degree', '', '2025-08-25'),
(59, '2025S-00003', 'Ruby', 'Xander', 'Cube', '', 'F', 23, '2002-02-05', 'Senior High School', 'trainee', '+639019283786', 'ruby.cube@bts.gov.ph', '$2y$10$YnXr4wqrQlvLHgVnr/Gmh.XlDDR.lZ23hRCcQ53hdx.GVCNVdhFN6', 'SHS', '', '2025-09-02');

-- --------------------------------------------------------

--
-- Structure for view `trainers_view`
--
DROP TABLE IF EXISTS `trainers_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `trainers_view`  AS SELECT `userstable`.`id` AS `trainerID`, concat(`userstable`.`firstName`,' ',ifnull(`userstable`.`middleName`,''),' ',`userstable`.`lastName`,' ',ifnull(`userstable`.`suffix`,'')) AS `trainerName` FROM `userstable` WHERE `userstable`.`role` = 'trainer' ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitiestable`
--
ALTER TABLE `activitiestable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `announcementtable`
--
ALTER TABLE `announcementtable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `announcementtable_ibfk_1` (`course_id`),
  ADD KEY `announcementtable_ibfk_2` (`created_by`);

--
-- Indexes for table `assignedcourses`
--
ALTER TABLE `assignedcourses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Indexes for table `basiccompetency`
--
ALTER TABLE `basiccompetency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseID` (`courseID`);

--
-- Indexes for table `commoncompetency`
--
ALTER TABLE `commoncompetency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseID` (`courseID`);

--
-- Indexes for table `corecompetency`
--
ALTER TABLE `corecompetency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_fetcher_core` (`courseID`);

--
-- Indexes for table `coursestable`
--
ALTER TABLE `coursestable`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `courseID` (`courseID`);

--
-- Indexes for table `coursetracker`
--
ALTER TABLE `coursetracker`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `enrolledtable`
--
ALTER TABLE `enrolledtable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_id` (`enrollment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `enrollmenttable`
--
ALTER TABLE `enrollmenttable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `finalgradestable`
--
ALTER TABLE `finalgradestable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `gradestable`
--
ALTER TABLE `gradestable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `submission_id` (`submission_id`),
  ADD KEY `studentID` (`studentID`);

--
-- Indexes for table `modulestable`
--
ALTER TABLE `modulestable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `trainerID` (`trainerID`);

--
-- Indexes for table `studentprogress`
--
ALTER TABLE `studentprogress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trackingID` (`trackingID`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `studentprogress_ibfk_5` (`studentID`);

--
-- Indexes for table `submissionstable`
--
ALTER TABLE `submissionstable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `activity_id` (`activity_id`);

--
-- Indexes for table `timetracker`
--
ALTER TABLE `timetracker`
  ADD PRIMARY KEY (`id`),
  ADD KEY `timetracker_ibfk_1` (`user_id`);

--
-- Indexes for table `trackingtable`
--
ALTER TABLE `trackingtable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `traineestable`
--
ALTER TABLE `traineestable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentID` (`studentID`);

--
-- Indexes for table `trainercourses`
--
ALTER TABLE `trainercourses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainerID` (`trainerID`),
  ADD KEY `courseID` (`courseID`);

--
-- Indexes for table `trainerstable`
--
ALTER TABLE `trainerstable`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trainerBind` (`trainerID`);

--
-- Indexes for table `userstable`
--
ALTER TABLE `userstable`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userID` (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitiestable`
--
ALTER TABLE `activitiestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `announcementtable`
--
ALTER TABLE `announcementtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `assignedcourses`
--
ALTER TABLE `assignedcourses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `basiccompetency`
--
ALTER TABLE `basiccompetency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `commoncompetency`
--
ALTER TABLE `commoncompetency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `corecompetency`
--
ALTER TABLE `corecompetency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `coursestable`
--
ALTER TABLE `coursestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `coursetracker`
--
ALTER TABLE `coursetracker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrolledtable`
--
ALTER TABLE `enrolledtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `enrollmenttable`
--
ALTER TABLE `enrollmenttable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `finalgradestable`
--
ALTER TABLE `finalgradestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gradestable`
--
ALTER TABLE `gradestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `modulestable`
--
ALTER TABLE `modulestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `studentprogress`
--
ALTER TABLE `studentprogress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissionstable`
--
ALTER TABLE `submissionstable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `timetracker`
--
ALTER TABLE `timetracker`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trackingtable`
--
ALTER TABLE `trackingtable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `traineestable`
--
ALTER TABLE `traineestable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `trainercourses`
--
ALTER TABLE `trainercourses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trainerstable`
--
ALTER TABLE `trainerstable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `userstable`
--
ALTER TABLE `userstable`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitiestable`
--
ALTER TABLE `activitiestable`
  ADD CONSTRAINT `activitiestable_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `activitiestable_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`);

--
-- Constraints for table `announcementtable`
--
ALTER TABLE `announcementtable`
  ADD CONSTRAINT `announcementtable_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `announcementtable_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `userstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `assignedcourses`
--
ALTER TABLE `assignedcourses`
  ADD CONSTRAINT `assignedcourses_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assignedcourses_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `trainerstable` (`trainerID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `basiccompetency`
--
ALTER TABLE `basiccompetency`
  ADD CONSTRAINT `basiccompetency_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `coursestable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `commoncompetency`
--
ALTER TABLE `commoncompetency`
  ADD CONSTRAINT `commoncompetency_ibfk_1` FOREIGN KEY (`courseID`) REFERENCES `coursestable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coursetracker`
--
ALTER TABLE `coursetracker`
  ADD CONSTRAINT `coursetracker_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrolledtable`
--
ALTER TABLE `enrolledtable`
  ADD CONSTRAINT `enrolledtable_ibfk_2` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollmenttable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrolledtable_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrolledtable_ibfk_4` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrollmenttable`
--
ALTER TABLE `enrollmenttable`
  ADD CONSTRAINT `enrollmenttable_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrollmenttable_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `trainercourses` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `enrollmenttable_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `trainerstable` (`trainerID`);

--
-- Constraints for table `finalgradestable`
--
ALTER TABLE `finalgradestable`
  ADD CONSTRAINT `finalgradestable_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `finalgradestable_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gradestable`
--
ALTER TABLE `gradestable`
  ADD CONSTRAINT `gradestable_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissionstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `gradestable_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `modulestable`
--
ALTER TABLE `modulestable`
  ADD CONSTRAINT `modulestable_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `modulestable_ibfk_2` FOREIGN KEY (`trainerID`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `studentprogress`
--
ALTER TABLE `studentprogress`
  ADD CONSTRAINT `studentprogress_ibfk_3` FOREIGN KEY (`trackingID`) REFERENCES `trackingtable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentprogress_ibfk_4` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `studentprogress_ibfk_5` FOREIGN KEY (`studentID`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `submissionstable`
--
ALTER TABLE `submissionstable`
  ADD CONSTRAINT `submissionstable_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `submissionstable_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activitiestable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `timetracker`
--
ALTER TABLE `timetracker`
  ADD CONSTRAINT `timetracker_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userstable` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trackingtable`
--
ALTER TABLE `trackingtable`
  ADD CONSTRAINT `trackingtable_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `traineestable`
--
ALTER TABLE `traineestable`
  ADD CONSTRAINT `traineestable_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trainercourses`
--
ALTER TABLE `trainercourses`
  ADD CONSTRAINT `trainercourses_ibfk_1` FOREIGN KEY (`trainerID`) REFERENCES `trainerstable` (`trainerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `trainercourses_ibfk_2` FOREIGN KEY (`courseID`) REFERENCES `coursestable` (`courseID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trainerstable`
--
ALTER TABLE `trainerstable`
  ADD CONSTRAINT `trainerBind` FOREIGN KEY (`trainerID`) REFERENCES `userstable` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
