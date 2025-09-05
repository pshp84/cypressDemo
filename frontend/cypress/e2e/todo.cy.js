/* eslint-env cypress */

describe("React Todo App - Full Flow", () => {
  const username = "test";
  const password = "1234";
  const visitUrl = "http://localhost:5173";

  Cypress.Commands.add("login", (u = username, p = password) => {
    cy.visit(visitUrl);
    cy.get('input[placeholder="Username"]').type(u);
    cy.get('input[placeholder="Password"]').type(p);
    cy.get("#login-btn").click();
  });

  //Login Success
  it("logs in successfully with correct credentials", () => {
    cy.login();
    cy.contains("Todo App").should("exist");
  });

  //Invalid credentials
  it("shows error on invalid credentials", () => {
    cy.login("wronguser", "wrongpass");
    cy.get("#err-msg").should("contain", "Invalid credentials.");
  });

  //Empty credentials
  it("prevents login with empty credentials", () => {
    cy.visit("http://localhost:5173");
  cy.get("#login-btn").click();
  cy.get("#err-msg").should("contain", "Username and Password are required.");
  });

  //Add task
  it("adds a new task", () => {
    cy.login();
    cy.get('input[placeholder="Enter task..."]').type("test1");
    cy.contains("Add").click();
    cy.get("#task-0").should("contain", "test1");
  });

  // Edit task
  it("edits a task", () => {
    cy.login();
    cy.get("#task-0").should("contain", "test1");

    cy.contains("Edit").click();
    cy.get("#edit-int").clear().type("test1 updated");
    cy.contains("Save").click();
    cy.get("#task-0").should("contain", "test1 updated");
  });

  //Delete task
  it("deletes a task", () => {
    cy.login();
    cy.get('input[placeholder="Enter task..."]').type("test2");
    cy.contains("Add").click();
    cy.get("#task-1");

    cy.contains("Delete").click();
    cy.get("ul").should("not.contain", "test1 updated");
  });
});
