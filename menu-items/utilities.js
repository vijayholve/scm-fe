import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

import { useSelector } from 'react-redux';
import { userDetails } from 'utils/apiService';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));



// assets
import { 
    IconTypography, 
    IconPalette, 
    IconShadow, 
    IconWindmill, 
    IconUsers,
    IconUserCheck,
    IconBuildingCommunity,
    IconSchool,
    IconBox,
    IconLayoutGrid,
    IconBook,
    IconCalendarEvent,
    IconClipboardList,
    IconKey,
    IconUsersGroup,
    IconFileText,
    IconClock,
    IconUserCircle
} from '@tabler/icons-react'; // Moved imports here for better organization

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    IconUsers,
    IconUserCheck,
    IconBuildingCommunity,
    IconSchool,
    IconBox,
    IconLayoutGrid,
    IconBook,
    IconCalendarEvent,
    IconClipboardList,
    IconKey,
    IconUsersGroup,
    IconFileText,
    IconClock,
    IconUserCircle
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const permissions = userDetails.getPermissions();
// const permissions = useSelector((state) => 
//    state?.user?.role?.permissions  || []
// );

function hasPermission(permissions, entity, action = 'view') {
  // Ensure permissions is an array before attempting to find
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }
  const perm = permissions.find(
    (p) =>
      (p.entityName?.toLowerCase() === entity.toLowerCase() || p.name?.toLowerCase() === entity.toLowerCase())
      && p.actions?.[action]
  );
  return !!perm;
}

// Helper to filter menu items recursively
function filterMenuByPermissions(menu, permissions) {
  if (!menu.children) return menu;

  const filteredChildren = menu.children
    .map((item) => {
      // If item has children, filter recursively
      if (item.children) {
        const filtered = filterMenuByPermissions(item, permissions);
        // Only include if it has children after filtering
        return filtered.children && filtered.children.length > 0 ? filtered : null;
      }
      // For leaf menu items, check permission
      // Use item.id as entity name for permission check
      const entity = item.id;
      if (hasPermission(permissions, entity, 'view')) {
        return item;
      }
      return null;
    })
    .filter(Boolean);

  return { ...menu, children: filteredChildren };
}

console.log(permissions);
const rawUtilities = {
    id: 'masters',
    title: 'Masters',
    type: 'group',
    children: [
        {
            id: 'USERS_MANAGEMENT', // A more generic ID for the collapse menu
            title: 'Users',
            type: 'collapse',
            icon: icons.IconUsers,
            breadcrumbs: false,
            children: [
                {
                    id: 'TEACHER', // Use specific entity ID for permission check
                    title: 'Teachers',
                    type: 'item',
                    url: '/masters/teachers',
                    icon: icons.IconUserCheck,
                    breadcrumbs: false
                },
                {
                    id: 'STUDENT', // Use specific entity ID for permission check
                    title: 'Students',
                    type: 'item',
                    url: '/masters/students',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                },
            ]
        },
        {
            id: 'INSTITUTE', // Consistent ID for parent
            title: 'Institutes',
            type: 'collapse',
            icon: icons.IconBuildingCommunity, // Consider a different icon if available for institutes
            breadcrumbs: false,
            children: [
                {
                    id: 'INSTITUTE',
                    title: 'Institutes',
                    type: 'item',
                    url: '/masters/institutes',
                    icon: icons.IconBuildingCommunity,
                    breadcrumbs: false
                },
                {
                    id: 'SCHOOL',
                    title: 'Schools',
                    type: 'item',
                    url: '/masters/schools',
                    icon: icons.IconSchool,
                    breadcrumbs: false
                },
                {
                    id: 'CLASS',
                    title: 'Classes',
                    type: 'item',
                    url: '/masters/classes',
                    icon: icons.IconBox,
                    breadcrumbs: false
                },
                {
                    id: 'DIVISION',
                    title: 'Divisions',
                    type: 'item',
                    url: '/masters/divisions',
                    icon: icons.IconLayoutGrid,
                    breadcrumbs: false
                },
                {
                    id: 'SUBJECT',
                    title: 'Subjects',
                    type: 'item',
                    url: '/masters/subjects',
                    icon: icons.IconBook,
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'ATTENDANCE', // Corrected typo from Attendence
            title: 'Attendance', // Corrected typo in title
            type: 'item',
            url: '/masters/attendances',
            icon: icons.IconCalendarEvent,
            breadcrumbs: false
        },
        {
            id: 'STUDENT_ATTENDANCE',
            title: 'Student Attendance',
            type: 'item',
            url: '/masters/student-attendance',
            icon: icons.IconUserCheck,
            breadcrumbs: false
        },
        {
            id: 'ASSIGNMENT',
            title: 'Assignments',
            type: 'item',
            url: '/masters/assignments',
            icon: icons.IconClipboardList,
            breadcrumbs: false
        },
        {
            id: 'ROLE',
            title: 'Roles',
            type: 'item',
            url: '/masters/roles',
            icon: icons.IconKey,
            breadcrumbs: false
        },
        {
            id: 'STUDENT_PARENT', // Assuming this is the entity name for permissions
            title: 'StudentParents',
            type: 'item',
            url: '/masters/studentParents',
            icon: icons.IconUsersGroup,
            breadcrumbs: false
        },
        {
            id: 'EXAM', // Assuming this is the entity name for permissions
            title: 'Exams',
            type: 'item',
            url: '/masters/exams',
            icon: icons.IconFileText,
            breadcrumbs: false
        },
        {
            id: 'TIMETABLE', // Consistent ID for permission check
            title: 'Timetables',
            type: 'item',
            url: '/masters/timetables',
            icon: icons.IconClock,
            breadcrumbs: false
        } ,
        {
            id: 'LMS',
            title: 'LMS',
            type: 'item',
            url: '/masters/lms',
            icon: icons.IconUsers,
            breadcrumbs: false
        },
        {
            id: 'USER_PROFILE', // Consistent ID for permission check
            title: 'USER_PROFILE',
            type: 'item',
            url: '/masters/profile',
            icon: icons.IconUserCircle,
            breadcrumbs: false
        },
        {
            id: 'QUIZ_MANAGEMENT',
            title: 'Quiz & Tests',
            type: 'collapse',
            icon: icons.IconUsers,
            breadcrumbs: false,
            children: [
                {
                    id: 'QUIZ',
                    title: 'Manage Quizzes',
                    type: 'item',
                    url: '/masters/quiz',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                },
                {
                    id: 'QUIZ_STUDENT',
                    title: 'Available Quizzes',
                    type: 'item',
                    url: '/masters/student/quizzes',
                    icon: icons.IconUsers,
                    breadcrumbs: false
                }
            ]
        }
        
       
    ]
};


// Filter the menu according to permissions
const utilities = filterMenuByPermissions(rawUtilities, permissions);

export default utilities;
// ...existing code...

export { filterMenuByPermissions };
