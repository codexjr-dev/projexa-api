# 🖥️Projexa API - Endpoints

# News
This route is responsible for the news of projects and has the following attributes:

| Attributes | Function                                                             |
| ---------- | -------------------------------------------------------------------- |
| Member id  | Id of the member who created the news                                |
| Project id | Id of the project which the news belongs to                          |
| Description | Description of the news                                             |
| image       | Image of news (under development)                                   |
| Update link | Link of news (like link of the pull request or other important link |

## 🛠️Methods
Below are the methods and their expected responses as well as possible errors:

| Method | Expected responses | Possible errors |
| ------ | ------------------------------- | -------------------- |
| GET    | (201) Project and all its news  | (500) Internal error |
| POST   | (201) News created successfully | (500) Internal error |
| PATCH  | (200) News updated successfully | (500) Internal error |
| DELETE | (200) News removed successfully | (500) Internal error |

### ⬇️GET
| Requirements | Function                                          |
| ------------ | ------------------------------------------------- |
| Project id   | Is required to get all the news from that project |
