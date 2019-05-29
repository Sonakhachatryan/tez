import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import AllFaculties from "./pages/allFaculties/allFaculties";
import AddFaculty from "./pages/addFaculty/addFaculty";
import UpdateFaculty from "./pages/updateFaculty/updateFaculty";
import Chairs from "./pages/chairs/chairs";
import Info from "./pages/aboutInfo/aboutInfo";
import AllUsers from "./pages/allUsers/allUsers";
import AddStudent from "./pages/addStudent/addStudent";
import AddUser from "./pages/addUser/addUser";
import UpdateUser from "./pages/updateUser/updateUser";
import Articles from "./pages/articles/articles";
import AllStudents from "./pages/allStudents/allStudents";
import UpdateStudent from "./pages/updateStudent/updateStudent";
import AllLecturers from "./pages/allLecturers/allLecturers";
import AddLecturer from "./pages/addLecturer/addLecturer";
import UpdateLecturer from "./pages/updateLecturer/updateLecturer";
import AllAcademicWorks from "./pages/allAcademicWorks/allAcademicWorks";
import AddAcademicWork from "./pages/addAcademicWork/addAcademicWork";
import UpdateAcademicWork from "./pages/updateAcademicWork/updateAcademicWork";
import ShowAcademicWork from "./pages/showAcademicWork/showAcademicWork";
import AllMarks from "./pages/allmarks/allMarks";
import AddMarks from "./pages/addMarks/addMarks";
import UpdateMarks from "./pages/updateMarks/updateMarks";
import AllMarksStudent from "./pages/allMarksStudent/allMarksStudent";
import Home from "./pages/home/home";

export default [
  {
    path: "/admin",
    exact: true,
    layout: DefaultLayout,
    component: Home
  },
  {
    path: "/admin/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/admin/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/admin/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/admin/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/admin/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/admin/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/admin/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  },
  {
    path: "/admin/faculty/all",
    layout: DefaultLayout,
    component: AllFaculties
  },
  {
    path: "/admin/faculty/add",
    layout: DefaultLayout,
    component: AddFaculty
  },
  {
    path: "/admin/faculty/edit/:id",
    layout: DefaultLayout,
    component: UpdateFaculty
  },
  {
    path: "/admin/faculty/chairs/:id",
    layout: DefaultLayout,
    component: Chairs
  },
  {
    path: "/admin/info",
    layout: DefaultLayout,
    component: Info
  },
  {
    path: "/admin/user/all",
    layout: DefaultLayout,
    component: AllUsers
  },
  {
    path: "/admin/user/add",
    layout: DefaultLayout,
    component: AddUser
  },
  {
    path: "/admin/user/edit/:id",
    layout: DefaultLayout,
    component: UpdateUser
  },
  {
    path: "/admin/articles",
    layout: DefaultLayout,
    component: Articles
  },
  {
    path: "/admin/students/all",
    layout: DefaultLayout,
    component: AllStudents,
  },
  {
    path: "/admin/student/add",
    layout: DefaultLayout,
    component: AddStudent
  },
  {
    path: "/admin/student/edit/:id",
    layout: DefaultLayout,
    component: UpdateStudent
  },
  {
    path: "/admin/lecturers/all",
    layout: DefaultLayout,
    component: AllLecturers,
  },
  {
    path: "/admin/lecturer/add",
    layout: DefaultLayout,
    component: AddLecturer
  },
  {
    path: "/admin/lecturer/edit/:id",
    layout: DefaultLayout,
    component: UpdateLecturer
  },
  {
    path: "/admin/academic-works/all/:id",
    layout: DefaultLayout,
    component: AllAcademicWorks,
  },
  {
    path: "/admin/academic-works/all",
    layout: DefaultLayout,
    component: AllAcademicWorks,
  },
  {
    path: "/admin/academic-work/add",
    layout: DefaultLayout,
    component: AddAcademicWork
  },
  {
    path: "/admin/academic-work/edit/:id",
    layout: DefaultLayout,
    component: UpdateAcademicWork
  },
  {
    path: "/admin/academic-work/show/:id",
    layout: DefaultLayout,
    component: ShowAcademicWork
  },
  {
    path: "/admin/marks/all",
    layout: DefaultLayout,
    component: AllMarks
  },
  {
    path: "/admin/mark/add",
    layout: DefaultLayout,
    component: AddMarks
  },
  {
    path: "/admin/marks/edit/:id",
    layout: DefaultLayout,
    component: UpdateMarks
  },
  {
    path: "/admin/student-marks/all",
    layout: DefaultLayout,
    component: AllMarksStudent
  },


];
