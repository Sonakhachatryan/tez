export default function(role) {
  if(role == 100){
    return [
      {
        title: "Faculties",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/faculty/all",
      },
      {
        title: "Users",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/user/all",
      },
      {
        title: "University Info",
        htmlBefore: '<i class="material-icons">info</i>',
        to: "/admin/info",
      },
    ];
  }

  if(role == 1){
    return [
      {
        title: "Articles",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/articles",
      },
      {
        title: "Lecturers",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/lecturers/all",
      },
      {
        title: "Students",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/students/all",
      },
    ];
  }



  if(role == 3){
    return [
      {
        title: "Marks",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/student-marks/all",
      },
      {
        title: "Academic work",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/academic-works/all",
      },
    ];
  }



  if(role == 4){
    return [
      {
        title: "Marks",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/marks/all",
      },
      {
        title: "Academic work",
        htmlBefore: '<i class="material-icons">vertical_split</i>',
        to: "/admin/academic-works/all",
      },
    ];
  }


  return [
    {
      title: "Blog Dashboard",
      to: "/admin/blog-overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Blog Posts",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/admin/blog-posts",
    },
    {
      title: "Faculties",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/admin/faculty/all",
    },
    {
      title: "Users",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/admin/user/all",
    },
    {
      title: "University Info",
      htmlBefore: '<i class="material-icons">info</i>',
      to: "/admin/info",
    },
    {
      title: "Add New Post",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/admin/add-new-post",
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/admin/components-overview",
    },
    {
      title: "Tables",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/admin/tables",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/admin/user-profile-lite",
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/admin/errors",
    }
  ];
}
