# 🖥️ Projexa API - Endpoints

# 🌉 Middleware (auth.js)
It is responsible for authenticating whether the member trying to perform this action actually has permission to do so. Additionally, it provides the member and ej id from the token.

| Attributes      | Function                                                             |
| --------------  | -------------------------------------------------------------------- |
| Token           | Jsonwebtoken which contains informations about the member            |

## ⚙ Functions

| Name                    | Function                                                       |
| ----------------------- | -------------------------------------------------------------- |
| existentUser            | Verify if the member exists                                    |
| authorizedUser          | Verify if the member has authorization to do that action       |
| isLeadership            | Verify if the member is a leadership (director or president)   |
| isMemberOnProject       | Verify if the member is on the project                         |
| haveRightsToTheNews     | Verify if the member is the owner of the news                  |

# Member
This route is responsible for the members of the junior company and has the following attributes:

| Attributes      | Function                                                             |
| --------------  | -------------------------------------------------------------------- |
| Name            | Name that identifies the member of the junior company                |
| E-mail          | E-mail of member, that will be yours login e-mail                    |
| Role            | The role that this member has in the junior company                  |
| Password        | Password of member, that will be yours login password                |
| Ej              | The junior company that this member is part of                       |
| Birth date      | The birth date of member                                             |
| Entry date      | The date the member joined the junior company                        |
| Phone           | Member' number of phone to contact                                   |
| Observations    | Any observation of member that is relevant to be reported            |
| Habilities      | Habilities that member has (back-end, front-end and others)          |
| Department      | The department this member belongs to                                |

## 🛠️ Methods
Below are the methods and their expected responses as well as possible errors:

| Method | Expected responses                | Possible errors      |
| ------ | --------------------------------- | -------------------- |
| GET    | (200) All members of the Ej       | (500) Internal error |
| POST   | (201) Member created successfully | (500) Internal error |
| PATCH  | (200) Member updated successfully | (500) Internal error |
| DELETE | (200) Member removed successfully | (500) Internal error |

### ⬇️ GET

| Requirements                     | Function                       |
| -------------------------------- | ------------------------------ |
| Middleware                       | Contains the id of the Ej      |
| Authentication (from middleware) | existentUser                   |

### ⬆ POST

| Requirements | Function                                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------|
| Middleware                       | Contains the id of the ej                                                                                |
| Authentication (from middleware) | isLeadership                                                                                             |
| Body                             | Contains the name, email, role, password, birthDate, entryDate, phone, observations, habilities and department of the member |

### 🔄 PATCH

| Requirements                     | Function                                                      |
| -------------------------------- | ------------------------------------------------------------- |
| Middleware                       | Contais the id of the member                                  |
| Authentication (from middleware) | authorizedUser                                                |
| Body                             | Contains the new data of the member                           |

### ❌ DELETE

| Requirements                     | Function                       |
| -------------------------------- | ------------------------------ |
| Middleware                       | Contains the id of the member  |
| Authentication (from middleware) | isLeadership                   |

# News
This route is responsible for the news of projects and has the following attributes:

| Attributes   | Function                                                             |
| -----------  | -------------------------------------------------------------------- |
| Member id    | Id of the member who created the news                                |
| Project id   | Id of the project which the news belongs to                          |
| Description  | Description of the news                                              |
| image        | Image of news (under development)                                    |
| Update link  | Link of news (like link of the pull request or other important link) |

## 🛠️ Methods
Below are the methods and their expected responses as well as possible errors:

| Method | Expected responses | Possible errors |
| ------ | ------------------------------- | -------------------- |
| GET    | (201) Project and all its news  | (500) Internal error |
| POST   | (201) News created successfully | (500) Internal error |
| PATCH  | (200) News updated successfully | (500) Internal error |
| DELETE | (200) News removed successfully | (500) Internal error |

### ⬇️ GET

| Requirements                     | Function                       |
| -------------------------------- | ------------------------------ |
| Params                           | Contains the id of the project |
| Authentication (from middleware) | existentUser                   |

### ⬆ POST

| Requirements                     | Function                                                        |
| -------------------------------- | --------------------------------------------------------------- |
| Params                           | Contains the id of the project                                  |
| Middleware                       | Contains the id of the member                                   |
| Authentication (from middleware) | isMemberOnProject                                               |
| Body                             | Contains the description, image and the update link of the news |

### 🔄 PATCH

| Requirements                     | Function                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------- |
| Authentication (from middleware) | haveRightsToTheNews                                                             |
| Body                             | Contains the id of the news, description, image and the update link of the news |

### ❌ DELETE

| Requirements                     | Function                       |
| -------------------------------- | ------------------------------ |
| Params                           | Contains the id of the project |
| Authentication (from middleware) | haveRightsToTheNews            |
| Body                             | Contains the id of the news    |

# Link
This route is responsible for the junior company links and has the following attributes:

| Attributes   | Function                                                             |
| ----------   | -------------------------------------------------------------------- |
| Name         | Name that identifies what the link is about                          |
| Url          | Uniform Resource Locator - the destination address of the link       |
| Tags         | Tags that direct to the area that the link relates to                |
| Ej           | The junior company that added the link                               |
| Departments  | Departments to which the link is important to know (or most related) |
| Observations | Observation about added link                                         |

## 🛠️ Methods
Below are the methods and their expected responses as well as possible errors:

| Method | Expected responses              | Possible errors      |
| ------ | ------------------------------- | -------------------- |
| GET    | (201) Ej and all its links      | (500) Internal error |
| POST   | (201) Link created successfully | (500) Internal error |
| PATCH  | (200) Link updated successfully | (500) Internal error |
| DELETE | (200) Link removed successfully | (500) Internal error |

### ⬇️ GET

| Requirements                     | Function                       |
| -------------------------------- | ------------------------------ |
| Middleware                       | Contains the id of the ej      |
| Authentication (from middleware) | existentUser                   |

### ⬆ POST

| Requirements                     | Function                                                                   |
| -------------------------------- | -------------------------------------------------------------------------- |
| Middleware                       | Contains the id of the ej                                                  |
| Authentication (from middleware) | isLeadership                                                               |
| Body                             | Contains the name, url, tags, departments and the observations of the link |

### 🔄 PATCH

| Requirements | Function                                                                        |
| -------------------------------- | ----------------------------------------------------------- |
| Params                           | Contais the id of the link                                  |
| Authentication (from middleware) | authorizedUser                                              |
| Body                             | Contains the new data of the link                           |

### ❌ DELETE

| Requirements                     | Function                                                    |
| -------------------------------- | ----------------------------------------------------------- |
| Params                           | Contains the id of the link                                 |
| Authentication (from middleware) | isLeadership                                                |

# Projects

This route is responsible for the junior company projects and has the following attributes:

| Attributes   | Function                                                             |
| ----------   | -------------------------------------------------------------------- |
| Name         | Name that identifies what the project is about                       |
| Description  | A brief description about the project                                |
| Tags         | Categories associed with the project                                 |
| Ej           | Name referring to the junior company                                 |
| Team         | Team members associated with the project                             |
| StartDate    | The planned start date for the project                               |
| FinishDate   | The planned end date for the project                                 |
| ContractLink | The link to the contract associated with the project                 |
| Customer     | The name of the client or organization requesting the project        |
| Email        | The customer contact email address                                   |
| Contact      | The customer contact information (phone, address, etc.)              |
| Name         | Customer name                                                        |
| News         | Relevant updates about the project                                   |

## 🛠️ Methods
Below are the methods and their expected responses as well as possible errors:

| Method |        Expected responses       |             Possible errors                   |
| ------ | ------------------------------- | --------------------------------------------- |
| GET    | (201) All Ej projects                                    | (500) Internal error |
| POST   | (201) Project created                                    | (500) Internal error |
| PATCH  | (200) Project updated end "Project updated successfully" | (500) Internal error |
| DELETE | (200) Project removed end "Project removed successfully" | (500) Internal error |

### ⬇️ GET

| Requirements                     | Function                                              |
| -------------------------------- | ----------------------------------------------------- |
| Middleware                       | Contains the id of the ej                             |
| Authentication (from middleware) | existentUser                                          |

### ⬆ POST

| Requirements                      | Function                                             |                      
| --------------------------------- | ---------------------------------------------------- |
| Middleware                        | Contains the id of the ej                            |
| Authentication (from middleware)	| isLeadership                                         |
| Body                              | Contains project name, description, tags, team, startDate, finishDate, contractLink, customer end news |

### 🔄 PATCH

| Requirements                     | Function                                              |
| -------------------------------- | ----------------------------------------------------- |
| Params                           | Contais the id of the project                         |
| Authentication (from middleware) | authorizedUser                                        |
| Body                             | Contains the new data to be updated for the project   |

### ❌ DELETE

| Requirements                      | Function                                             |
| --------------------------------- | ---------------------------------------------------- |
| Params                            | Contains the id of the removed project               |
| Authentication (from middleware)	| isLeadership                                         |

# Ej

This route is responsible for the junior company and has the following attributes:

| Attributes   | Function                                                             |
| ------------ | -------------------------------------------------------------------- |
| Name         | Name that identifies the junior company                              |
| Departaments | Departments that the junior company has                              |
| Skills       | Skills that the junior company has                                   |


## 🛠️ Methods
Below are the methods and their expected responses as well as possible errors:

| Method | Expected responses                          | Possible errors      |
| ------ | ------------------------------------------- | -------------------- |
| GET    | (201) Data about ej and who created it      | (500) Internal error |
| POST   | (201) Ej created successfully               | (500) Internal error |
| PATCH  | (200) Ej updated successfully               | (500) Internal error |
| DELETE | (200) Ej removed successfully               | (500) Internal error |

### ⬆ POST

| Requirements                     | Function                                                                   |
| -------------------------------- | -------------------------------------------------------------------------- |
| Body                             | Contains the name, presidentData                                           |

### ⬇️ GET

| Requirements                     | Function                                              |
| -------------------------------- | ----------------------------------------------------- |
| Middleware                       | Contains the id of the ej                             |
