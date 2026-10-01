import { test, expect } from "@playwright/test";

const TEST_EMAIL = "test@booktracker.local";
const TEST_PASSWORD = process.env.TEST_PASSWORD;
const TEST_RATE_LIMIT_KEY = process.env.TEST_RATE_LIMIT_KEY;

const createdBookTitles = new Set();

async function login(page) {
  await page.goto("/login");

  await page.getByPlaceholder("Email").fill(TEST_EMAIL);
  await page.getByPlaceholder("Password").fill(TEST_PASSWORD);

  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/\/$/);
}

async function addBook(
  page,
  {
    title,
    author = "Playwright Test Author",
    genre = "",
    series = "",
    isbn = "",
    pages = "",
    publisher = "",
    publicationDate = "",
    status = "Want To Read",
    rating = "0",
    dateStarted = "",
    dateFinished = "",
    summary = "",
    notes = "",
  }
) {
  createdBookTitles.add(title);

  await page.goto("/add");

  await page
    .getByRole("textbox", { name: "Title" })
    .fill(title);

  await page
    .getByRole("textbox", { name: "Author" })
    .fill(author);

  if (genre) {
    await page.getByPlaceholder("Genre").fill(genre);
  }

  if (series) {
    await page.getByPlaceholder("Series").fill(series);
  }

  if (isbn) {
    await page.getByPlaceholder("ISBN").fill(isbn);
  }

  if (pages) {
    await page.getByPlaceholder("Page Count").fill(pages);
  }

  if (publisher) {
    await page.getByPlaceholder("Publisher").fill(publisher);
  }

  if (publicationDate) {
    await page
      .getByPlaceholder("Publication Date")
      .fill(publicationDate);
  }

  await page
    .locator(".book-form select")
    .nth(0)
    .selectOption(status);

  await page
    .locator(".book-form select")
    .nth(1)
    .selectOption(rating);

  if (dateStarted) {
    await page.locator("#dateStarted").fill(dateStarted);
  }

  if (dateFinished) {
    await page.locator("#dateFinished").fill(dateFinished);
  }

  if (summary) {
    await page
      .getByPlaceholder("Enter book summary here...")
      .fill(summary);
  }

  if (notes) {
    await page
      .getByPlaceholder("Add notes here...")
      .fill(notes);
  }

  await page
    .getByRole("button", { name: "Add Book" })
    .click();

  await expect(page).toHaveURL(/\/books$/);
}

async function deleteBook(page, title) {
  try {
    await page.goto("/books");

    const bookTitle = page.getByText(title, {
      exact: true,
    });

    if (!(await bookTitle.count())) {
      return;
    }

    await bookTitle.first().click();

    await expect(page).toHaveURL(/\/books\//);

    const deleteButton = page.getByRole("button", {
      name: "Delete",
    });

    if (!(await deleteButton.count())) {
      return;
    }

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await deleteButton.click();

    await expect(page).toHaveURL(/\/books$/);

    await expect(
      page.getByText(title, { exact: true })
    ).not.toBeVisible();
  } catch {
    // Cleanup should never cause a test failure.
  }
}

test.beforeEach(async ({ page }) => {
  if (!TEST_PASSWORD) {
    throw new Error(
      "TEST_PASSWORD is not set. Set it in PowerShell before running the tests."
    );
  }

  if (!TEST_RATE_LIMIT_KEY) {
    throw new Error(
      "TEST_RATE_LIMIT_KEY is not set. Set it in PowerShell before running the tests."
    );
  }

  await page.setExtraHTTPHeaders({
    "X-Test-Rate-Limit-Key": TEST_RATE_LIMIT_KEY,
  });

  await login(page);
});

test.afterEach(async ({ page }) => {
  const titlesToDelete = [...createdBookTitles];

  for (const title of titlesToDelete) {
    await deleteBook(page, title);
  }

  createdBookTitles.clear();
});

/* ============================================================
   BASIC PAGE ACCESS
   ============================================================ */

test("user can access the books library", async ({ page }) => {
  await page.goto("/books");

  await expect(
    page.getByRole("heading", { name: "My Books" })
  ).toBeVisible();
});

test("user can access the add book page", async ({ page }) => {
  await page.goto("/add");

  await expect(
    page.getByRole("heading", { name: "Add Book" })
  ).toBeVisible();
});

test("user can access the stats page", async ({ page }) => {
  await page.goto("/stats");

  await expect(
    page.getByRole("heading", { name: "Reading Statistics" })
  ).toBeVisible();
});

test("user can access the profile page", async ({ page }) => {
  await page.goto("/profile");

  await expect(
    page.getByRole("heading", { name: "My Profile" })
  ).toBeVisible();
});

/* ============================================================
   BOOK CRUD
   ============================================================ */

test("user can add, view, edit, and delete a book", async ({ page }) => {
  const bookTitle = `Playwright CRUD Book ${Date.now()}`;
  const updatedBookTitle = `${bookTitle} Updated`;

  await addBook(page, {
    title: bookTitle,
    author: "Playwright Test Author",
  });

  await expect(
    page.getByText(bookTitle, { exact: true })
  ).toBeVisible();

  await page.getByText(bookTitle, { exact: true }).click();

  await expect(
    page.getByRole("heading", { name: bookTitle })
  ).toBeVisible();

  await expect(
    page.getByText("Playwright Test Author", { exact: true })
  ).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();

  await expect(page).toHaveURL(/\/edit\//);

  await page
    .getByRole("textbox", { name: "Title" })
    .fill(updatedBookTitle);

  createdBookTitles.delete(bookTitle);
  createdBookTitles.add(updatedBookTitle);

  await page
    .getByRole("button", { name: "Save Changes" })
    .click();

  await expect(page).toHaveURL(/\/books\//);

  await expect(
    page.getByRole("heading", { name: updatedBookTitle })
  ).toBeVisible();

  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Delete" }).click();

  createdBookTitles.delete(updatedBookTitle);

  await expect(page).toHaveURL(/\/books$/);

  await expect(
    page.getByText(updatedBookTitle, { exact: true })
  ).not.toBeVisible();
});

test("book form saves all major book fields", async ({ page }) => {
  const title = `Playwright Full Fields ${Date.now()}`;

  await addBook(page, {
    title,
    author: "Full Fields Author",
    genre: "Fantasy",
    series: "Test Series",
    isbn: "9781234567890",
    pages: "450",
    publisher: "Test Publisher",
    publicationDate: "2025",
    status: "Finished",
    rating: "5",
    dateStarted: "2026-01-10",
    dateFinished: "2026-02-10",
    summary: "This is a Playwright test summary.",
    notes: "These are Playwright test notes.",
  });

  await page.getByText(title, { exact: true }).click();

  await expect(
    page.getByText("Full Fields Author", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(/Fantasy/)
  ).toBeVisible();

  await expect(
    page.getByText(/Test Series/)
  ).toBeVisible();

  await expect(
    page.getByText(/9781234567890/)
  ).toBeVisible();

  await expect(
    page.getByText(/450/)
  ).toBeVisible();

  await expect(
    page.getByText(/Test Publisher/)
  ).toBeVisible();

  await expect(
    page.getByText("Status: Finished", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(/5\/5/)
  ).toBeVisible();

  await expect(
    page.getByText(
      "This is a Playwright test summary.",
      { exact: true }
    )
  ).toBeVisible();

  await expect(
    page.getByText(
      "These are Playwright test notes.",
      { exact: true }
    )
  ).toBeVisible();
});

test("required book fields can be saved as unknown", async ({ page }) => {
  await page.goto("/add");

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toContain(
      "missing its title and author"
    );
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Add Book" }).click();

  createdBookTitles.add("Unknown Title");

  await expect(page).toHaveURL(/\/books$/);

  await expect(
    page.getByText("Unknown Title", { exact: true }).first()
  ).toBeVisible();

  await page
    .getByText("Unknown Title", { exact: true })
    .first()
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Unknown Title",
    })
  ).toBeVisible();
});

/* ============================================================
   SEARCH
   ============================================================ */

test("user can search books by title", async ({ page }) => {
  const uniqueTitle = `Searchable Book ${Date.now()}`;

  await addBook(page, {
    title: uniqueTitle,
    author: "Search Author",
  });

  const searchBox = page.getByRole("searchbox", {
    name: "Search books by title or author",
  });

  await searchBox.fill(uniqueTitle);

  await expect(
    page.getByText(uniqueTitle, { exact: true })
  ).toBeVisible();
});

test("user can search books by author", async ({ page }) => {
  const uniqueTitle = `Author Search Book ${Date.now()}`;
  const uniqueAuthor = `Unique Search Author ${Date.now()}`;

  await addBook(page, {
    title: uniqueTitle,
    author: uniqueAuthor,
  });

  const searchBox = page.getByRole("searchbox", {
    name: "Search books by title or author",
  });

  await searchBox.fill(uniqueAuthor);

  await expect(
    page.getByText(uniqueTitle, { exact: true })
  ).toBeVisible();
});

test("user can clear a book search", async ({ page }) => {
  const uniqueTitle = `Clear Search Book ${Date.now()}`;

  await addBook(page, {
    title: uniqueTitle,
  });

  const searchBox = page.getByRole("searchbox", {
    name: "Search books by title or author",
  });

  await searchBox.fill("something-that-will-not-match");

  await expect(
    page.getByText(uniqueTitle, { exact: true })
  ).not.toBeVisible();

  await page
    .getByRole("button", {
      name: "Clear search",
    })
    .click();

  await expect(
    page.getByText(uniqueTitle, { exact: true })
  ).toBeVisible();
});

/* ============================================================
   FILTERS
   ============================================================ */

test("user can filter books by status", async ({ page }) => {
  const readingTitle = `Reading Filter Book ${Date.now()}`;
  const finishedTitle = `Finished Filter Book ${Date.now()}`;

  await addBook(page, {
    title: readingTitle,
    status: "Reading",
  });

  await addBook(page, {
    title: finishedTitle,
    status: "Finished",
  });

  await page
    .getByRole("button", {
      name: "Filters",
      exact: true,
    })
    .click();

  await page
    .getByRole("checkbox", {
      name: "Reading",
    })
    .check();

  await expect(
    page.getByText(readingTitle, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(finishedTitle, { exact: true })
  ).not.toBeVisible();
});

test("user can filter books by genre", async ({ page }) => {
  const fantasyTitle = `Fantasy Filter Book ${Date.now()}`;
  const romanceTitle = `Romance Filter Book ${Date.now()}`;

  await addBook(page, {
    title: fantasyTitle,
    genre: "Fantasy",
  });

  await addBook(page, {
    title: romanceTitle,
    genre: "Romance",
  });

  await page
    .getByRole("button", {
      name: "Filters",
      exact: true,
    })
    .click();

  await page
    .getByRole("checkbox", {
      name: "Fantasy",
    })
    .check();

  await expect(
    page.getByText(fantasyTitle, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(romanceTitle, { exact: true })
  ).not.toBeVisible();
});

test("user can clear active filters", async ({ page }) => {
  const title = `Clear Filter Book ${Date.now()}`;

  await addBook(page, {
    title,
    status: "Reading",
    genre: "Fantasy",
  });

  await page
    .getByRole("button", {
      name: "Filters",
      exact: true,
    })
    .click();

  await page
    .getByRole("checkbox", {
      name: "Reading",
    })
    .check();

  await expect(
    page.getByText(title, { exact: true })
  ).toBeVisible();

  await page
    .getByRole("button", {
      name: "Clear",
      exact: true,
    })
    .click();

  await expect(
    page.getByText(title, { exact: true })
  ).toBeVisible();
});

/* ============================================================
   SORTING
   ============================================================ */

test("user can change book sorting", async ({ page }) => {
  const firstTitle = `AAA Sort Book ${Date.now()}`;
  const secondTitle = `ZZZ Sort Book ${Date.now()}`;

  await addBook(page, {
    title: firstTitle,
  });

  await addBook(page, {
    title: secondTitle,
  });

  await page
    .getByRole("button", {
      name: "Sort",
      exact: true,
    })
    .click();

  await page
    .getByRole("radio", {
      name: "Title: A-Z",
    })
    .check();

  await expect(
    page.getByText(firstTitle, { exact: true })
  ).toBeVisible();

  await expect(
    page.getByText(secondTitle, { exact: true })
  ).toBeVisible();

  const bookTitles = page.locator(".book-card h2");

  const firstTitleIndex = await bookTitles.evaluateAll(
    (elements, title) =>
      elements.findIndex(
        (element) => element.textContent?.trim() === title
      ),
    firstTitle
  );

  const secondTitleIndex = await bookTitles.evaluateAll(
    (elements, title) =>
      elements.findIndex(
        (element) => element.textContent?.trim() === title
      ),
    secondTitle
  );

  expect(firstTitleIndex).toBeGreaterThanOrEqual(0);
  expect(secondTitleIndex).toBeGreaterThanOrEqual(0);
  expect(firstTitleIndex).toBeLessThan(secondTitleIndex);
});

/* ============================================================
   PROFILE
   ============================================================ */

test("user can update their name", async ({ page }) => {
  await page.goto("/profile");

  const nameInput = page.locator("#profile-name");

  await nameInput.fill("Playwright Test User");

  await page
    .getByRole("button", {
      name: "Save name",
    })
    .click();

  await expect(
    page.getByText("Name updated successfully.")
  ).toBeVisible();
});

test("user can reject an incorrect email change password", async ({
  page,
}) => {
  await page.goto("/profile");

  await page
    .locator("#new-email")
    .fill(
      `invalid-email-change-${Date.now()}@example.com`
    );

  await page
    .locator("#email-current-password")
    .fill("definitely-not-the-correct-password");

  await page
    .getByRole("button", {
      name: "Save email address",
    })
    .click();

  await expect(
    page.locator(".form-error").filter({
      hasText: /password|incorrect|invalid/i,
    })
  ).toBeVisible();
});

test("user rejects mismatched new passwords", async ({ page }) => {
  await page.goto("/profile");

  await page
    .locator("#current-password")
    .fill(TEST_PASSWORD);

  await page
    .locator("#new-password")
    .fill("PlaywrightNewPassword123!");

  await page
    .locator("#confirm-password")
    .fill("DifferentPassword123!");

  await page
    .getByRole("button", {
      name: "Change password",
    })
    .click();

  await expect(
    page.getByText(
      "The new password confirmation does not match."
    )
  ).toBeVisible();
});

/* ============================================================
   LIBRARY EXPORT
   ============================================================ */

test("user can export library as CSV", async ({ page }) => {
  await addBook(page, {
    title: `CSV Export Book ${Date.now()}`,
  });

  await page.goto("/profile");

  const downloadPromise =
    page.waitForEvent("download");

  await page
    .getByRole("button", {
      name: "Export CSV",
    })
    .click();

  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /^book-tracker-library-\d{4}-\d{2}-\d{2}\.csv$/
  );
});

test("user can export library as JSON", async ({ page }) => {
  await addBook(page, {
    title: `JSON Export Book ${Date.now()}`,
  });

  await page.goto("/profile");

  const downloadPromise =
    page.waitForEvent("download");

  await page
    .getByRole("button", {
      name: "Export JSON",
    })
    .click();

  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /^book-tracker-library-\d{4}-\d{2}-\d{2}\.json$/
  );

  const fileContents =
    await download.createReadStream();

  let contents = "";

  for await (const chunk of fileContents) {
    contents += chunk.toString();
  }

  const backup = JSON.parse(contents);

  expect(backup.format).toBe(
    "book-tracker-library"
  );

  expect(backup.version).toBe(1);

  expect(Array.isArray(backup.books)).toBe(true);
});

/* ============================================================
   LOGOUT / PROTECTED ROUTES
   ============================================================ */

test("logged-out users cannot access protected pages", async ({
  page,
}) => {
  await page.goto("/profile");

  await page
    .getByRole("button", {
      name: "Log out",
    })
    .click();

  await expect(page).toHaveURL(/\/login/);

  const protectedPages = [
    "/books",
    "/add",
    "/stats",
    "/profile",
  ];

  for (const path of protectedPages) {
    await page.goto(path);

    await expect(
      page.getByRole("button", {
        name: "Log out",
      })
    ).not.toBeVisible();
  }
});

test("logout clears the authenticated profile", async ({
  page,
}) => {
  await page.goto("/profile");

  await page
    .getByRole("button", {
      name: "Log out",
    })
    .click();

  await expect(page).toHaveURL(/\/login/);

  await page.goto("/profile");

  await expect(
    page.getByRole("heading", {
      name: "My Profile",
    })
  ).not.toBeVisible();
});

/* ============================================================
   LOGIN / REGISTRATION VALIDATION
   ============================================================ */

test("incorrect login credentials are rejected", async ({
  page,
}) => {
  await page.goto("/login");

  await page
    .getByPlaceholder("Email")
    .fill(TEST_EMAIL);

  await page
    .getByPlaceholder("Password")
    .fill("DefinitelyWrongPassword123!");

  await page
    .getByRole("button", {
      name: "Log In",
    })
    .click();

  await expect(
    page.getByText(
      /invalid|incorrect|password/i
    )
  ).toBeVisible();

  await expect(page).toHaveURL(/\/login/);
});

test("registration rejects an already registered email", async ({
  page,
}) => {
  await page.goto("/register");

  await page
    .getByPlaceholder("Name")
    .fill("Playwright Duplicate User");

  await page
    .getByPlaceholder("Email")
    .fill(TEST_EMAIL);

  await page
    .getByPlaceholder("Password")
    .fill(TEST_PASSWORD);

  await page
    .getByRole("button", {
      name: "Create Account",
    })
    .click();

  await expect(
    page.getByText(
      /already|exists|registered/i
    )
  ).toBeVisible();

  await expect(page).toHaveURL(/\/register/);
});

/* ============================================================
   LONG TEXT DISPLAY
   ============================================================ */

test("long summaries and notes can be expanded and collapsed", async ({
  page,
}) => {
  const title = `Long Text Book ${Date.now()}`;
  const longSummary = "Summary text ".repeat(30);
  const longNotes = "Notes text ".repeat(30);

  await addBook(page, {
    title,
    summary: longSummary,
    notes: longNotes,
  });

  await page.getByText(title, { exact: true }).click();

  await expect(
    page.getByRole("button", {
      name: "Show More",
    })
  ).toHaveCount(2);

  await page
    .getByRole("button", {
      name: "Show More",
    })
    .first()
    .click();

  await expect(
    page.getByRole("button", {
      name: "Show Less",
    })
  ).toHaveCount(1);

  await page
    .getByRole("button", {
      name: "Show Less",
    })
    .click();

  await expect(
    page.getByRole("button", {
      name: "Show More",
    })
  ).toHaveCount(2);
});