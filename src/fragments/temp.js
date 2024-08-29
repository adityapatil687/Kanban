// asuuming each list name is nuique
let arr = [
    {
      name: "Kanban",
      start_date: "22/05/2026",
      deadline: "25/05/2027",
      createdby: {
        name: "Aditya Patil",
       
        email: "manager@gmail.com",
      },
      team: [
        {
          userid: "1234zxdfsd7868",
          name: "user 1",
         
          email: "user1@email.com",
          role: "helper"
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 2",
         
          email: "user2@email.com",
          role: "helper"
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 3",
         
          email: "user3@email.com",
        },
        {
          userid: "1234zxdfsd7868",
          name: "user 4",
         
          email: "user2@email.com",
          role: "helper"
        },
      ],
      tasks: [
        {
          title: "Kanban Tasks 1"
        },
        {
          title: "Kanban Tasks 2"
        },
      ],
      completedTasks: [{
          title: "Do somethin 2"
        }],
    },
    {
        name: "Pizza Place",
        start_date: "22/05/2026",
        deadline: "25/05/2027",
        createdby: {
          name: "Aditya Patil",
         
          email: "manager@gmail.com",
        },
        team: [
          {
            userid: "1234zxdfsd7868",
            name: "user 1",
           
            email: "user1@email.com",
            role: "helper"
          },
          {
            userid: "1234zxdfsd7868",
            name: "user 2",
           
            email: "user2@email.com",
            role: "helper"
          },
          {
            userid: "1234zxdfsd7868",
            name: "user 3",
           
            email: "user3@email.com",
          },
          {
            userid: "1234zxdfsd7868",
            name: "user 4",
           
            email: "user2@email.com",
            role: "helper"
          },
        ],
        tasks: [
          {
            title: "Pizza Place 1"
          },
          {
            title: "Pizza Place 2"
          },
        ],
        completedTasks: [{
            title: "Do somethin 2"
          }],
      },
  ]

  function getTasks(name, arr) {
    arr.map(item => {
      if (item.name === name) {
        if (item.tasks && item.tasks.length > 0) {
          item.tasks.map((task, index) => console.log("title => ",task.title+" index => ", index));
        } else {
          console.log("No tasks present");
        }
      }
    });
  }

  getTasks("Kanban", arr)