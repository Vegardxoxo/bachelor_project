# IT2901: Group  TRDK3
## Information
This bachelor project is made as part of the subject _IT2901 - 
Informatikk Prosjektarbeid II_ at the Norwegian University of Science and Technology. 


The project authors are:
- Emma Blix
- Vegard Henriksen
- Ida Waage Høyland
- Solveig Myren
- Sarmi Ponnuthurai
- Alvaro Worren.
- Håkon Hargott Wullum

## Video Demonstration
A video demonstration of the product can be found here: https://www.youtube.com/watch?v=aS1Ls_RM_FY


## Documentation
This README provides general information about the project, and a guide on how to install and run it. 

### File structure
The project has the following (simplified) file structure:

* [dashboard/](dashboard): The folder for the main project
  * [api/](dashboard/api): Where main the Python files lie. Views, urls, models etc.
  * [frontend/](dashboard/frontend): Where the frontend Typescript files are located.
  * [license_dashboard/](dashboard/license_dashboard): Django settings.
  * [db.sqlite3](dashboard/db.sqlite3): The SQLite database file.
  * [manage.py](dashboard/manage.py): The manage.py file used to start the server etc.
  * [TECHNICAL_README.md](dashboard/TECHNICAL_README.md): The technical README for the project.


* [README.md](README.md): The main repository README, the one you are currently reading.
* [requirements.txt](requirements.txt): The Python dependencies. 


### Technical documentation
For a more technical and detailed documentation, please see the README in [dashboard/TECHNICAL_README.md](dashboard/TECHNICAL_README.md)


## Installation
Installation assumes Python 3.11 or later is installed. From the root of the project:
1. Run `pip install -r requirements.txt` to make sure all required Python dependencies are installed.
2. Run `cd dashboard`
3. Run `python manage.py migrate`
4. Run `python manage.py runserver`

In another terminal tab (don't close the previous one):
1. Run `cd dashboard/frontend`
2. Run `npm install`, then `npm start`. 

The project will be accessible on the url [http://localhost:3000/](http://localhost:3000/). You can login using the following:
- Email: `leendert.wienhofen@trondheim.kommune.no`
  - You can use any of the 9000 user emails in the database, this is simply an example.
- Password: `defaultpassword`
  - This is the password for all users.

- To access Django's browsable API, go to [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).
  - The username is `admin@admin.com` and the password is 
`admin`.

Please see the troubleshooting section in the [technical README](dashboard/TECHNICAL_README.md) if you any issues with the installation appear.


## License
The project is created under a GNU General Public License, version 3. 
Please [click here](https://www.gnu.org/licenses/gpl-3.0.html) for more information.