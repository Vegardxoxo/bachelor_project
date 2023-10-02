# Technical information about the project

[Back to main README.md](../README.md)

## 1. Stack used

For the backend, we used for the backend a combination of Django and Django Rest Framework (DRF) and SQLite for the
database system.
For the frontend, we have used React and Typescript.

- The backend files are located in [/dashboard/api](api)
- The frontend files are located in [/dashboard/frontend/](frontend)
- The database file is located in [/dashboard/db.sqlite3](db.sqlite3)


### MVT

The project is based on the Model-Controller-Template (MVT) model.

#### Model

The models are located in [/dashboard/api/models.py](api/models.py).
They are the actual tables in the database.

#### View

The view is located in [/dashboard/api/views](api/views).
This file is how the data is accessed by the frontend.
Depending on which of the the urls from [urls.py](api/urls.py) is requested on the frontend, the correct view
is shown.

#### Template

Django does not use a controller to manage the model like in many other types of projects.
Instead, a 'template' is used, which is our frontend (see above for a link).

## 2. Detailed repository

Please note that the files and folders mentioned here are what the team sees as the ones that could use some explanation
of what they are.
It is not meant as a list of all files.

#### As viewed from [root/dashboard/](../dashboard):

[api/](api): Where main the Python files lie. urls, models etc.

- [management/commands](api/management/commands): Useful Python files during the development of the product. Should not be of
  interest to most users.
- [urls/](api/urls): The Django urls.
- [views/](api/views): The Django views.
- [tests.py](api/tests.py): All tests used for frontend.

[frontend/](frontend): Where the frontend files are located.

- [cypress/](frontend/cypress): The Cypress test folder. The tests are in the folder called [e2e](frontend/cypress/e2e).
- [src/](frontend/src): Contains the most important files for frontend.
    - [components/](frontend/src/components): All the components used in the React pages, sorted in folders
      for the respective page.
    - [pages/](frontend/src/pages): The pages files.

## 3. Troubleshooting

- If another process is running on port 3000, run `npx kill-port 3000` before repeating step 5 of the installation.
- If you get the error message `django.db.utils.OperationalError: table api_licensepool" already exists` when trying to
  migrate tables, run ` python manage.py migrate --fake`.

## 4. Other information - how to run tests

### Backend tests:

1. Locate to `/dashboard/` in the terminal.
2. Run `python manage.py test api`

The frontend tests are located in the file [dashboard/api/tests.py](api/tests.py).

### Frontend tests:

1. Locate to `/dashboard/frontend` in the terminal.
2. Run `npm test`

The frontend tests are located in the same folder as the corresponding file that is tested.

### Cypress tests:
The Cypress tests are located inside [/dashboard/frontend/cypress/](frontend/cypress).
Since running them requires installation of Cypress, a tutorial will not be provided here.
When Cypress is installed:

1. Run `npx cypress open` in the terminal.
2. Choose to configure "E2E" testing.
3. Run the tests in the browser chosen during configuration.