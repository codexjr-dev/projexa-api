# 📊 Codex

**CodeX** is a non-profit organization, founded on October 15, 2018. As the **junior company for Computer Science at UFCG**, its main objective is to develop high-quality creative and innovative solutions and promote a learning environment, entrepreneurship, and, in conjunction with these endeavors, foster leadership and offer computer science students experiences in other areas such as **personnel management, project management, financial management, prospecting, marketing, among others.**

# 📌Kanban

Kanban is a visual methodology used to manage projects, offering a clear view of task progress on a virtual board. In our project, it was used to control the workflow from idea to completion. The table has columns representing different stages of the process. Each task is represented by a card that moves between columns as it progresses. Allowing a clear view of the status of each task, making it easier to identify possible problems and plan the next steps.

## How each column works in Kanban

### 🆕 New
In this column, we record Issues without complete detail. We haven't done the description and priority mapping yet. They wait to be evaluated and prioritized before being moved to the next step.

### 📋 Backlog
The Issues in this column have been prioritized and have priority mapping, but have not yet been voted on for difficulty. They wait for the availability of resources or the completion of other activities to move forward.


### 📝 Ready
Here, the Issues were noted in detail, mapped, voted on and judged important for the current Sprint. They are ready to go and all the necessary resources are available.


### 🚀 In Progress
At this stage, Issues are being actively worked on. Each team member can sign off on a task, even if they are just studying about it. If for some reason the task cannot be completed, it can be returned to the Ready column.

### 🔍 In Review
The Issues in this column have been completed and are undergoing a final review before acceptance to be merged into the dev branch. This is important to ensure the work meets established standards and requirements.
 
### ✅ Done
In this final stage, the Issues were finalized, reviewed in the Sprint Review and have already been merged into Main. Therefore, at the end of the Sprint they will already be in production.

## 🏷️ TAGS
We have some tags that can help to organize the issues in Kanban, so let's see how it works:

### 👨🏽‍💻 Assignees
The one/those who will resolve the issue.

### ❗ Priority
Priority level to resolve the issue.

### ↕ Size
The difficult/effort level of the issue. (We use a customized Fibbonaci sequence to meansure this level {0.5, 1, 2, 3, 5, 8, 13, 21, ☕}).

### 📈 Sprint
Which sprint the issue belongs.

### 💻 Occupation
Which repository the issue belongs (Frontend, Backend or UI Design).

### 📋 Review stage
The review stage of the issue, which can be "To Review" (when you resolve the issue and wait for the review), "To Correct" (when the reviewer find something that need to correct and move your issue to column "In Progress") and "Merged" (when the reviewer approved your solution and merged at dev branch).

### ↕ Width
Integer version of Size (all values in size are strings so the github can't use this values to meansure in the graphics).


### 🔨 How to create an issue and move to backlog?

**1 - Identify which repository the issue belongs**
- Frontend, Backend or UI Design

**2 - Identify the type of the issue**
- Which could be: Feature, Fix, Refactor, Docs and Tests.

**3 - Name the issue and give a simple description**
- Use the previews information you got to name the issue.
- Example: Backend > Docs > Criar o arquivo COLLAB.md.

**4 - Select which repository the issue belongs**
- If it's a frontend issue, select projexa-web, else if it's backend select projexa-api, else is dashboard-codex-ui-designers.

**5 - Select some tags**
- Select the tags: Priority and occupation.
- Obs: The size and sprint is discussed in the sprint planning.

**6 - Describe the issue in detail**
- Explain the issue in detail to discuss in the sprint planning.

**7 - Move the issue to backlog**
- Now you can put the issue in backlog, but always put in the end of the list to keep the column and kanban organized.

### 📝 How to Subscribe to an Issue?

**1 - Choose Priority:**
- Select an issue based on its priority and your availability.

**2 - Assign to Yourself:**
- In the 'Assignees' field, add your name to indicate that you are responsible for the task.

**3 - Move to "In Progress":**
- Drag the card to the "In Progress" column on the Kanban board.

**4 - Complete the Task:**
- After finishing the work, move the card to "In Review".

**5 - Review the Task:**
- If necessary, mark the review stage as "To Review" for possible corrections.

After this, your code will be evaluated. If any corrections are needed, it will be marked as "To Correct" and you will be notified. If everything is fine, it will be merged into the main branch and marked as "Merged".


# How to do a Pull Riquest?

Taking into account that you have already cloned the project and that it is already running on your machine. Before you start making changes, open the terminal, type the commands and create a branch to work on. make sure it is in the root of the project.

### 1 - Create a new Branch:
for better identification, use the pattern "iss#" + "issue number in kanban" to name the branch [ex: iss#09].

     If you are going to work alone on this branch, use the following command and go to step 2:

         git chekout -b <branch-name>


     If you want to work from an existing remote branch, use the command below and go to step 3:

         git checkout -b <branch-name> origin/<remote-branch-name>


### 2 - Check if there are updates in the remote dev branch:
This is important so that you can start working in line with updates to the remote dev branch.

     git pull origin dev


### 3 - Make the Changes:

Now, make the necessary changes to the code.

### 4 - Commit Changes:
After making the changes, you need to add and commit the changes. Use the following commands:
    
     git add .
     git commit -m "Description of changes made"

### 5 - Upload to Remote Repository:
Now, push the changes to your remote repository using the command:

         git push origin <branch-name>
    
If the branch is already created in the remote repository, it will update it and you don't need to do anything else, if it is not created, it will create a new branch with that name.

### 6 - Creating the Pull Request:
When pushing, if it is a new branch in the remote repository, a link will appear on the terminal
    
     1 - Click on it to be directed to the pull request page.

     2 - In the "base repository" field, select the "codexjr-dev/dashboard-codex-api project", in the case of the backend repository repository, for the web repository, select "codexjr-dev/dashboard-codex-web project".

     3 - In the "base" field select the "dev" branch.

     4 - Copy the link of the page you are on.

     5 - Press the Pull Request button.

     6 - Open your Issue on the Kanban board and paste the link copied above in the comments.


# Teams categories

**Projexa** is a project that uses the SCRUM methodology, so, we have some teams categories/roles like the **Scrum Master** (SM), **Product Owner** (PO), **Quality Assurance** (QA), **Tech Leader** (TL) and, of course, the **Developers** and the **UI Designers**. Each one of these categories is detailed below:

### ⭐ Scrum Master (SM)
The Scrum Master is **essential for implementing and ensuring the use of Scrum methods in a project**. Their roles include facilitating events, removing impediments, coaching, practicing servant leadership, promoting continuous improvement, facilitating communication, and protecting the team from distractions, making them a crucial asset in Scrum-oriented projects.

### 👨‍💼 Product Owner (PO)
The Product Owner acts as a **liaison between real clients and the project team**, conveying updates to clients and representing their needs to the team. The PO is crucial for ensuring alignment between the team and the client requirements while also keeping clients informed about project progress.

### ✅ Quality Assurance (QA)
The Quality Assurance involves four key steps. First, the QA team **collaborates with the Product Owner** to understand the **product requirements** and **user stories**. Then, they **create test cases and plans** to validate these requirements during development. Throughout the sprint, QA **continuously tests and verifies the product's functionality, reporting any defects**. Finally, they participate in the sprint review to **ensure the product meets quality standards** and is ready for release.

### 👩‍🏫 Tech Leader (TL)
A Tech Leader serves as the **technical authority**, guiding the team's technical decisions and ensuring adherence to best practices. They **facilitate collaboration**, **help resolve technical challenges**, and **maintain product quality** by overseeing technical aspects of the project.

### 👨‍💻 Developers
The Developers are responsible for **turning product requirements into working software**. They collaborate closely, self-organize, and continuously communicate to achieve sprint goals. Developers also participate in Scrum events and **maintain a commitment to delivering high-quality products**.

### 👩‍🎨 UI Designers
The UI Designers are responsible for **crafting project prototypes** and ensuring the project's visuals are of the highest quality. Their primary objectives are to **create designs that not only attract clients but also provide an easy and intuitive access to the system**.