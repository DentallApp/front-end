# front-end

DentallApp is a web application with chatbot for appointment management, reminders and sending appointment cancellation messages for the dental office called [World Dental CO](https://www.tiktok.com/@worlddentalco).

> The original maintainer of this repository is [Guillermo Rivera](https://github.com/Guiller1999). Guillermo no longer maintains this repository.
> 
> This project has not been improved much since its [first alpha version](https://github.com/DentallApp/front-end/tree/v0.1.0).

## Index

- [Important](#important)
- [Technologies used](#technologies-used)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Credentials](#credentials)

## Important

This application was developed as a degree project for the [University of Guayaquil](https://www.ug.edu.ec), however, it is not ready to run in a production environment. All requirements for this project were obtained through interviews with the owner dentist of [World Dental CO](https://www.facebook.com/worlddentalco).

In the end, this project was never deployed in that dental office for personal reasons of the authors. However, it was decided to publish the source code of this application so that the community can use it for learning purposes (learn from it or even improve it).

## Technologies used

- [BotFramework-WebChat](https://github.com/microsoft/BotFramework-WebChat)
- [Node](https://github.com/nodejs/node)
- [npm CLI](https://github.com/npm/cli)
- [React](https://github.com/facebook/react)
- [Bootstrap](https://github.com/twbs/bootstrap)

## Screenshots

The language of the pages are in Spanish. The app is intended for a dental office that speaks that language.

<details>
<summary>Home</summary>

![Home](https://github.com/DentallApp/front-end/blob/dev/screenshots/home.png)
</details>

<details>
<summary>Services</summary>

![Services](https://github.com/DentallApp/front-end/blob/dev/screenshots/services.png)
</details>

<details>
<summary>Service</summary>

![Service](https://github.com/DentallApp/front-end/blob/dev/screenshots/service.png)
</details>

<details>
<summary>Offices</summary>

![Offices](https://github.com/DentallApp/front-end/blob/dev/screenshots/offices.png)
</details>

<details>
<summary>Login</summary>

![Login](https://github.com/DentallApp/front-end/blob/dev/screenshots/login.png)
</details>

<details>
<summary>Signup</summary>

![Signup](https://github.com/DentallApp/front-end/blob/dev/screenshots/register.png)
</details>

<details>
<summary>Reset password</summary>

![Reset password](https://github.com/DentallApp/front-end/blob/dev/screenshots/reset-password.png)
</details>

<details>
<summary>Basic user panel</summary>

![Basic user panel](https://github.com/DentallApp/front-end/blob/dev/screenshots/user-panel.png)
</details>

<details>
<summary>ChatBot - part 1</summary>

![ChatBot part 1](https://github.com/DentallApp/front-end/blob/dev/screenshots/chatbot-part1.png)
</details>

<details>
<summary>ChatBot - part 2</summary>

![ChatBot part 2](https://github.com/DentallApp/front-end/blob/dev/screenshots/chatbot-part2.png)
</details>

<details>
<summary>ChatBot - part 3</summary>

![ChatBot part 3](https://github.com/DentallApp/front-end/blob/dev/screenshots/chatbot-part3.png)
</details>

<details>
<summary>Appointment history</summary>

![Appointment history](https://github.com/DentallApp/front-end/blob/dev/screenshots/appointment-history.png)
</details>


## Installation

- You first need to install the backend application. For more information, click [here](https://github.com/DentallApp/back-end?tab=readme-ov-file#installation).
- Once you have run the backend application, proceed to clone the frontend repository.
```sh
git clone https://github.com/DentallApp/front-end.git
```
- Change directory.
```sh
cd front-end
```
- Copy the contents of `.env.example` to `.env`.
```sh
cp .env.example .env
# On Windows use the "xcopy" command.
```
- Build the image and initiate services.
```sh
docker-compose up --build -d
```
- Access the application with this URL.
```
http://localhost:80
```

## Credentials

The following table shows the default credentials for authentication from the frontend application.

| Username                | Password                    |
|-------------------------|-----------------------------|
| basic_user@hotmail.com  | 123456                      |
| secretary@hotmail.com   | 123456                      |
| dentist@hotmail.com     | 123456                      |
| admin@hotmail.com       | 123456                      |
| superadmin@hotmail.com  | 123456                      |