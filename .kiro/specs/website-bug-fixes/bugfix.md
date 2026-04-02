# Bugfix Requirements Document

## Introduction

Two bugs have been identified on the Bugema University Department of Computing and Informatics website:

1. **Wrong Staff link destination** — The "Staff" navigation link across all public pages (`index.html`, `task7-home.html`, `task7-about.html`, `task7-contact.html`) points to `task2-profile.html`, which is a student profile page, instead of the staff area (`staff/dashboard.html`).

2. **Broken/incomplete pages** — Two pages have malformed HTML from an interrupted previous session: `task2-profile.html` has unclosed `<span>` tags inside the hobby cards, and `task3-timetable.html` has unclosed `<div>` tags inside the summary stat cards. Both cause broken rendering in browsers.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user clicks the "Staff" navigation link on any public page THEN the system navigates to `task2-profile.html` (the student profile page) instead of the staff area

1.2 WHEN a browser renders `task2-profile.html` THEN the system displays broken hobby cards due to unclosed `<span>` tags causing malformed HTML structure

1.3 WHEN a browser renders `task3-timetable.html` THEN the system displays broken summary stat cards due to unclosed `<div>` tags causing malformed HTML structure

### Expected Behavior (Correct)

2.1 WHEN a user clicks the "Staff" navigation link on any public page THEN the system SHALL navigate to `staff/dashboard.html`

2.2 WHEN a browser renders `task2-profile.html` THEN the system SHALL display all hobby cards correctly with properly closed HTML tags

2.3 WHEN a browser renders `task3-timetable.html` THEN the system SHALL display all summary stat cards correctly with properly closed HTML tags

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user clicks any other navigation link (Home, About, Department, Timetable, Resources, Contact, Apply Now, Login) THEN the system SHALL CONTINUE TO navigate to the correct destination page

3.2 WHEN a browser renders `task2-profile.html` THEN the system SHALL CONTINUE TO display the student profile header, about section, and all other page content correctly

3.3 WHEN a browser renders `task3-timetable.html` THEN the system SHALL CONTINUE TO display the timetable table, legend, and all other page content correctly

3.4 WHEN a staff member logs in via `login.html` THEN the system SHALL CONTINUE TO redirect to `staff/dashboard.html` via the login API
