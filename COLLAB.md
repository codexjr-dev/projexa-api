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


# Como fazer um Pull Riquest?

Levando em consideração que já tenha feito o clone do projeto e que já esteja rodando em sua máquina. Antes de começar a fazer alterações, abra o terminal, digite os comandos e crie uma branch para trabalhar. certifique-se de que esteja na raiz do projeto.

### 1 - Crie uma nova Branch:
para uma melhor indentificação, use o padrão "iss#" + "número da issue no kanban" para nomear a branch [ ex: iss#09 ].

    Caso você vá trabalhar sozinho nessa branch, use o seguinte comando e siga para o passo 2:

        git chekout -b <nome-da-branch>


    Caso você queira trabalhar a partir de uma branch remota já existente, use o comando abaixo e siga para o passo 3:

        git checkout -b <nome-da-branch> origin/<nome-da-branch-remota>


### 2 - Verifique se tem atualizações na branch remota dev:
isso é importante para que você começe a trabalhar alinhado com as atualizações da branch remota dev.

    git pull origin dev


### 3 - Faça as Alterações: 

Agora, faça as alterações necessárias no código.

### 4 - Commit das Alterações: 
Após realizar as alterações, você precisa adicionar e commitar as mudanças. Utilize os seguintes comandos:
    
    git add .
    git commit -m "Descrição das alterações feitas"

### Envie para o Repositório remoto: 
Agora, envie as alterações para o seu repositório remoto usando o comando:

        git push origin <nome-da-branch>
    
Caso a branch já esteja criada no repositório remoto, irá atualiza-la e não precisa fazer mais nada, caso não esteja criada, irá criar uma nova branch com esse nome.

### Criando o Pull Request:
Ao realizar o push, caso seja uma branch nova no repositório remoto, irá aparecer no terminal um link
    
    1 - Clique nele para ser direcionado para a página de pull request.

    2 - No campo "base repository" selecione o "projeto codexjr-dev/dashboard-codex-api", no caso do repositório do repositorio backend, para o repositorio web, selecione "projeto codexjr-dev/dashboard-codex-web".

    3 - No campo "base" selecione a branch "dev".

    4 - Copie o link da página em que você está.

    5 - Aperte no botão de Pull Request.

    6 - Abra sua Issue no quadro Kanban e cole nos comentários o link copiado acima.

