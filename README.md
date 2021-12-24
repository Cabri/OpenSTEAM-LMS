# French
OpenSTEAM LMS est un module de gestion de classe (LMS en anglais) co-développé par Vittascience et Cabrilog, qui vous est proposé sur les plateformes [vittascience.com](https://fr.vittascience.com) et [cabri.com](https://cabri.com/fr/) sous forme de service Cloud.

[![Slack Badge](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://join.slack.com/t/opensteamlms/shared_invite/zt-vte7c70i-ISGyg~OpWqFrodMlSVOkXg)

![Vittascience-Cabri-FR](https://user-images.githubusercontent.com/36603099/115318825-d7003b80-a17e-11eb-89e6-2884b40bef60.jpg)

OpenSTEAM LMS a bénéficié du soutien du Ministère de l'Éducation Nationale via [le dispositif Édu-up](https://eduscol.education.fr/1603/le-dispositif-edu).
 
Il est également possible de déployer ce LMS par soi-même, en dupliquant le code source ci-dessus. Celui-ci est libre, disponible [sous licence AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.fr.html).

Le LMS a été pensé de façon modulaire, avec un cœur flexible pour de nombreux usages et un système de plugins permettant d’ajouter des fonctionnalités avancées ou de modifier l’apparence.

Vous souhaitez contribuer ? Votre aide est précieuse à de nombreux niveaux, que ce soit pour faire remonter des problèmes ou des idées, apporter des éléments de traduction, créer un thème ou un plugin personnalisé.

N’hésitez pas à contacter l’équipe [Vittascience](mailto:contact@vittascience.com) ou [Cabri](mailto:contact@cabri.com) pour toute question.

# English
OpenSTEAM LMS is a Learning Management System (LMS) co-developed by Vittascience and Cabrilog, which is offered to you on the [vittascience.com](https://en.vittascience.com) and [cabri.com](https://cabri.com/en/) platforms as a Cloud service.

[![Slack Badge](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://join.slack.com/t/opensteamlms/shared_invite/zt-vte7c70i-ISGyg~OpWqFrodMlSVOkXg)

![Vittascience-Cabri-EN](https://user-images.githubusercontent.com/36603099/115319277-b2589380-a17f-11eb-9f17-2bbfbd4b227c.jpg)

OpenSTEAM LMS benefited from the support of the French Ministry of National Education through [the Édu-up program](https://eduscol.education.fr/1603/le-dispositif-edu).
 
You can also deploy this LMS on your own, by duplicating the source code above. This one is free, available [under the AGPL-3.0 license](https://www.gnu.org/licenses/agpl-3.0.en.html).

The LMS has been designed in a modular fashion, with a flexible core for many uses and a system of plugins to add advanced features or modify the appearance.

Do you want to contribute? Your help is invaluable on many levels, whether it is to raise problems or ideas, to provide translation elements, to create a theme or a custom plugin:

Please do not hesitate to contact the team [Vittascience](mailto:contact@vittascience.com) or [Cabri](mailto:contact@cabri.com) for any questions.


# OpenSTEAM LMS use tutorial

You can find the LMS tutorial on [a video on Youtube](https://www.youtube.com/watch?v=rN3hhDZCRMc) (In french)

# How to setup project environment

1. [Clone the repository](https://github.com/vittascience/OpenSTEAM-LMS#clone-the-repository)
2. [.env file creation](https://github.com/vittascience/OpenSTEAM-LMS#env-file-creation)
3. [VirtualHost Setup](https://github.com/vittascience/OpenSTEAM-LMS#virtualhost-setup)
4. [Dependencies](https://github.com/vittascience/OpenSTEAM-LMS#dependencies)
5. [Database setup](https://github.com/vittascience/OpenSTEAM-LMS#database-setup)
6. [Build](https://github.com/vittascience/OpenSTEAM-LMS#build)
7. [Plugins](https://github.com/vittascience/OpenSTEAM-LMS#plugins)
8. [Email Templates](https://github.com/vittascience/OpenSTEAM-LMS#email-templates)
9. [OpenSTEAM LMS back end core](https://github.com/vittascience/OpenSTEAM-LMS#opensteam-lms-back-end-core)

## Clone the repository

Clone the present repository into your server

## .env file creation

At the root of your current folder (`/OpenSTEAM-LMS/`) create a `.env` file.
Inside of this file, copy/paste the following

``` 
VS_HOST=
VS_DB_HOST=**localhost**
VS_DB_PORT=**3306**
VS_DB_NAME=
VS_DB_USER=
VS_DB_PWD=
VS_MAPS_API_KEY=
VS_CAPTCHA_SECRET=
VS_CAPTCHA_PUBLIC_KEY=
VS_MAIL_SERVER=
VS_MAIL_PORT=
VS_MAIL_TYPE=
VS_MAIL_ADDRESS=
VS_MAIL_PASSWORD=
VS_REPLY_TO_MAIL=support@your_company_name.com
VS_REPLY_TO_NAME=Support # it can be Support,Contact or something else
VS_SET_FROM=your_website.com

# set the default student name to every classroom to be created
VS_DEMOSTUDENT=vittademo

# path to use for the activity logger(ie: routing/Routing.php)
VS_LOG_PATHH=/logs/log.log

# setup the new admin data
ADMIN_PSEUDO=PSEUDO
ADMIN_PASSWORD=PASSWORD
ADMIN_EMAIL=EMAIL

# registration's fields options
USER_USERNAME=false
USER_BIO=false
USER_PHONE=false
# Subject can not be true if grade is not true 
USER_TEACHER_GRADE=false
USER_TEACHER_SUBJECT=false
USER_TEACHER_SCHOOL=false
```


Don't forget to fill/change these constants with relevant information (at least all the VS_DB)

## VirtualHost Setup

1. Open your hosts file with admin privileges (`C:\windows\system32\drivers\etc\hosts`) or  (`sudo nano /etc/hosts`)

2. Modify your hosts file by adding this line: `127.0.0.1 steamlms`

3. 🏗️ Add steamlms:80 as a VirtualHost in your XAMPP/MAMP/hosting software

4. Make sure that PHP is running a version 7.x (with x above 2) and that NodeJS at least 14 is there.

5. Choose a logs directory. By default, this is `/logs/`. You can change this value using the entry in the `.env` named  `VS_LOG_PATH`, e.g. `VS_LOG_PATH=/tmp/log`.

## Dependencies

Run `composer install` to download all the needed PHP dependencies.
Then, run `npm install` to download all the needed JavaScript dependencies (for instance for the gulp build...).

Now you should be able to access the lms on your browser in ```http://steamlms/classroom```
The default account login is ```the email you provide here ADMIN_EMAIL``` and password is ```the password you provided here ADMIN_PASSWORD```

## Database setup

To setup the database, type this command in your shell: php sql-files/SteamLmsGenerateDb.php
Make sure you added the necessay informations (below # setup the new admin data) in the .env file
Then you have to check if the created database name match the VS_DB_NAME in the .env file.

## Build

When changing the view files or when working on a plugin, you need to run a gulp build to apply the changes on the L.M.S.

To do so, you just need to follow few steps:

1. Open a terminal

2. Go to the OpenSTEAM LMS folder

3. Type the command ```gulp build```

4. Wait for the tasks to finish

5.  If using php-fpm, restart or refresh it, e.g. `service php7.4-fpm restart`and voilà !

## Plugins

If you need to add some features and/or theme design which aren't relevant in the OpenSTEAM LMS core, you must create plugins. To do so you need to respect a certain directory structure for your plugin folder(s) and some recommendations.

### 1. Create your plugin(s) directory

#### Plugin directory tree

```
+---your-plugin-directory
|   +---Controller
|   +---Entities
|   +---public
|   |   +---css
|   |   +---images
|   |   \---js
|   \---Views
```

#### Where do I need to put my plugin directory ?

You just need to put it in a folder named ```plugins``` at the root of the OpenSTEAM LMS (It is in the .gitignore, so you'll probably have to create it).

### 2. Create your plugin files and put them in the relevant folders
- Your custom controller file(s) in the ```Controller``` folder
- Your custom entitie file(s) in the ```Entities``` folder
- Your custom css file(s) in the ```public/css``` folder
- Your custom image file(s) in the ```public/images``` folder
- Your custom javascript file(s) in the ```public/js``` folder
- Your custom view file(s) in the ```Views``` folder

</ul>

*As far as possible, avoid to change the view files. Otherwise, it'll be more difficult to retrieve changes from the LMS core in future updates*

### 3. Launch the Build

Follow the steps described in the Build section above

## Email Templates

Once you have set up all the fields related to emails + the ```VS_HOST``` in your .env file, the users who will register or request an email address update will receive a confirmation email to active their new account/ confirm their new email address.

A default html email is used, but you can create your own html emails and overwrite the default email templates.

How to do ?

- create a folder at the root of openSteamLMS and name it ```emailTemplates```
- inside emailTemplates folder, add a 'Fr' and a 'En' folder for example
- inside theses folders, add a ```en_confirm_account.php``` and a ```en_confirm_email_update.php``` file (these files will contain your email's html markups)

email directory tree

```
+---database
+---emailTemplates
|   +---En
|       +---en_confirm_account.php
|       +---en_confirm_email_update.php
|   +---Fr
|       +---fr_confirm_account.php
|       +---fr_confirm_email_update.php
+---gulp
```
Note: your email template have to have a ```<div> <?php echo  $body;?> </div>``` variable hard coded.

If you go to openSteamLMS/vendor/vtuser/src/Controller/ControllerUser, you will find the register and update_user_infos methods that have a ```$body``` defined.

This $body variable will be injected inside your html emails before sending each email.

## OpenSTEAM LMS back end core

The current repository only contains front elements of the LMS. The back end is mainly located in the dependencies (in the vendor folder) :

- [vuser](https://github.com/vittascience/vuser) : current version (1.2.3)
- [vclassroom](https://github.com/vittascience/vclassroom) : current version (1.2.4)
- [vutils](https://github.com/vittascience/vutils) : current version (1.2.3)
- vinterfaces (not public yet) : current version (1.2.1)
- vlearn (not public yet) : current version (1.2.6)

## Build integration tests

[Redirect here](tests/README.md)