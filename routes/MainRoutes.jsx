import { lazy, useEffect } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import EditDivision from 'views/masters/division/division.edit';
import Divisions from 'views/masters/division/division';
import Exams from 'views/masters/exam';
import { use } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const StudentDashboardV1 = Loadable(lazy(() => import('views/dashboard/studentDashboard/StudentDashboardV1')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));


const Users = Loadable(lazy(() => import('views/masters/teacher/index')));
const EditUsers = Loadable(lazy(() => import('views/masters/teacher/edit')));

const Institutes = Loadable(lazy(() => import('views/masters/institute/institutes')));
const EditInstitute = Loadable(lazy(() => import('views/masters/institute/institute.edit')));

const Schools = Loadable(lazy(() => import('views/masters/school/schools')));
const EditSchools = Loadable(lazy(() => import('views/masters/school/school.edit')));



const Students = Loadable(lazy(() => import('views/masters/student/index')));
const EditStudents = Loadable(lazy(() => import('views/masters/student/edit')));

const Attendence = Loadable(lazy(() => import('views/masters/attendence')));

const Subjects = Loadable(lazy(() => import('views/masters/subject/subjects')));
const EditSubject = Loadable(lazy(() => import('views/masters/subject/subject.edit')));

const division = Loadable(lazy(() => import('views/masters/division/division')));
const divisionEdit = Loadable(lazy(() => import('views/masters/division/division.edit')));

const Classes = Loadable(lazy(() => import('views/masters/class/classes')));
const ClassEdit = Loadable(lazy(() => import('views/masters/class/class.edit')));

const Assignments = Loadable(lazy(() => import('views/masters/assignment/assignments')));
const AssignmentEdit = Loadable(lazy(() => import('views/masters/assignment/assignment.edit')));

const AttendanceList = Loadable(lazy(() => import('views/masters/attendence/attendenceList')));
const AttendanceEdit = Loadable(lazy(() => import('views/masters/attendence/index')));
const StudentAttendanceList = Loadable(lazy(() => import('views/masters/attendence/studentAttendanceList')));

const Roles = Loadable(lazy(() => import('views/masters/roles/roleslist')));
const RoleEdit = Loadable(lazy(() => import('views/masters/roles/role.edit')));

const Timetable = Loadable(lazy(() => import('views/masters/timetable/index')));
const TimetableEdit = Loadable(lazy(() => import('views/masters/timetable/edit')));
const TimetableView = Loadable(lazy(() => import('views/masters/timetable/view')));
const Profiles = Loadable(lazy(() => import('views/masters/profile/index')));

const ExamList = Loadable(lazy(() => import('views/masters/exam/index')));
const ExamEdit = Loadable(lazy(() => import('views/masters/exam/edit')));

const StudentParentList = Loadable(lazy(() => import('views/masters/StudentParent/index')));
const StudentParentEdit = Loadable(lazy(() => import('views/masters/StudentParent/edit')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

function hasPermission(permissions, entity, action = 'view') {
  const perm = permissions.find(
    (p) =>
      (p.entityName?.toLowerCase() === entity.toLowerCase() || p.name?.toLowerCase() === entity.toLowerCase())
      && p.actions?.[action]
  );
  return !!perm;
}

const getMainRoutes = (permissions = []) => ({
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'student-dashboard',
      element: <StudentDashboardV1 />
    },
    {
      path: 'masters',
      children: [
      hasPermission(permissions, 'TEACHER', 'view') && {
        path: 'teachers',
        element: <Users />
      },
      hasPermission(permissions, 'TEACHER', 'edit') && {
        path: 'teacher/edit/:id',
        element: <EditUsers />
      },
      hasPermission(permissions, 'TEACHER', 'add') && {
        path: 'teacher/add',
        element: <EditUsers />
      },
      hasPermission(permissions, 'STUDENT', 'view') && {
        path: 'students',
        element: <Students />
      },
      hasPermission(permissions, 'STUDENT', 'edit') && {
        path: 'students/edit/:id',
        element: <EditStudents />
      },
      hasPermission(permissions, 'STUDENT', 'add') && {
        path: 'student/add',
        element: <EditStudents />
      },
      // ...repeat for other entities like 'INSTITUTE', 'SCHOOL', etc.
      // Example for roles:
      hasPermission(permissions, 'INSTITUTE', 'view') && {
        path: 'institutes',
        element: <Institutes />
      },
      hasPermission(permissions, 'INSTITUTE', 'edit') && {
        path: 'institute/edit/:id',
        element: <EditInstitute />
      },
      hasPermission(permissions, 'INSTITUTE', 'add') && {
        path: 'institute/add',
        element: <EditInstitute />
      },
      hasPermission(permissions, 'SCHOOL', 'view') && {
        path: 'schools',
        element: <Schools />
      },
      hasPermission(permissions, 'SCHOOL', 'edit') && {
        path: 'school/edit/:id',
        element: <EditSchools />
      },
      hasPermission(permissions, 'SCHOOL', 'add') && {
        path: 'school/add',
        element: <EditSchools />
      },
      hasPermission(permissions, 'CLASS', 'view') && {
        path: 'classes',
        element: <Classes />
      },
      hasPermission(permissions, 'CLASS', 'edit') && {
        path: 'class/edit/:id',
        element: <ClassEdit />
      },
      hasPermission(permissions, 'CLASS', 'add') && {
        path: 'class/add',
        element: <ClassEdit />
      },
      hasPermission(permissions, 'DIVISION', 'view') && {
        path: 'divisions',
        element: <Divisions />
      },
      hasPermission(permissions, 'DIVISION', 'edit') && {
        path: 'division/edit/:id',
        element: <EditDivision />
      },
      hasPermission(permissions, 'DIVISION', 'add') && {
        path: 'division/add',
        element: <EditDivision />
      },
      hasPermission(permissions, 'SUBJECT', 'view') && {
        path: 'subjects',
        element: <Subjects />
      },
      hasPermission(permissions, 'SUBJECT', 'edit') && {
        path: 'subject/edit/:id',
        element: <EditSubject />
      },
      hasPermission(permissions, 'SUBJECT', 'add') && {
        path: 'subject/add',
        element: <EditSubject />
      },
      hasPermission(permissions, 'ASSIGNMENT', 'view') && {
        path: 'assignments',
        element: <Assignments />
      },
      hasPermission(permissions, 'ASSIGNMENT', 'edit') && {
        path: 'assignment/edit/:id',
        element: <AssignmentEdit />
      },
      hasPermission(permissions, 'ASSIGNMENT', 'add') && {
        path: 'assignment/add',
        element: <AssignmentEdit />
      },
      hasPermission(permissions, 'ATTENDANCE', 'view') && {
        path: 'attendances',
        element: <AttendanceList />
      },
      hasPermission(permissions, 'ATTENDANCE', 'edit') && {
        path: 'attendance/edit/:id',
        element: <AttendanceEdit />
      },
      hasPermission(permissions, 'ATTENDANCE', 'add') && {
        path: 'attendance/add',
        element: <AttendanceEdit />
      },
      {
        path: 'student-attendance',
        element: <StudentAttendanceList />
      },
      hasPermission(permissions, 'ROLE', 'view') && {
        path: 'roles',
        element: <Roles />
      },
      hasPermission(permissions, 'ROLE', 'edit') && {
        path: 'role/edit/:id',
        element: <RoleEdit />
      },
      hasPermission(permissions, 'ROLE', 'add') && {
        path: 'role/add',
        element: <RoleEdit />
      },
      hasPermission(permissions, 'USER_PROFILE', 'view') && {
        path: 'profile',
        element: <Profiles />
      },
      hasPermission(permissions, 'EXAM', 'view') && {
        path: 'exams',
        element: <ExamList />
      },
      hasPermission(permissions, 'EXAM', 'edit') && {
        path: 'exam/edit/:id',
        element: <ExamEdit />
      },
      hasPermission(permissions, 'EXAM', 'add') && {
        path: 'exam/add',
        element: <ExamEdit />
      },
      hasPermission(permissions, 'STUDENT_PARENT', 'view') && {
        path: 'studentParents',
        element: <StudentParentList />
      },
      hasPermission(permissions, 'STUDENT_PARENT', 'edit') && {
        path: 'studentParent/edit/:id',
        element: <StudentParentEdit />
      },
      hasPermission(permissions, 'STUDENT_PARENT', 'add') && {
        path: 'studentParent/add',
        element: <StudentParentEdit />
      },
      hasPermission(permissions, 'TIMETABLE', 'view') && {
        path: 'timetables',
        element: <Timetable />
      },
      hasPermission(permissions, 'TIMETABLE', 'edit') && {
        path: 'timetable/edit/:id',
        element: <TimetableEdit />
      },
      hasPermission(permissions, 'TIMETABLE', 'add') && {
        path: 'timetable/add',
        element: <TimetableEdit />
      },
      hasPermission(permissions, 'TIMETABLE', 'view') && {
        path: 'timetable/view/:id',
        element: <TimetableView />
      }
      ]
    }

  ]
});

export default getMainRoutes;


