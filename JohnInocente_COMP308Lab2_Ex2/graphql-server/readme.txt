to run this app:
execute an npm install
ctrl-click on http://localhost:4000/
In Apollo Server sandbox enter queries or mutations to test:

Query All Students:
query {
  students {
    id
    firstName
    lastName
    email
    college
    program
    startingYear
  }
}

Add a student:
mutation {
  addStudent(
    firstName: "Alice"
    lastName: "Smith"
    email: "alice.smith@example.com"
    college: "XYZ University"
    program: "Computer Science"
    startingYear: 2023
  ) {
    id
    firstName
    lastName
  }
}

Use the returned id to fetch the student:
query {
  student(id: "63ea2c8b9a7e880b36c7a9df") {
    id
    firstName
    lastName
    email
    college
    program
    startingYear
  }
}

You can fetch all students to get their IDs:
query {
  students {
    id
    firstName
  }
}

Using email to delete:
mutation {
  deleteStudent(email: "student@example.com") {
    id
    firstName
  }
}

